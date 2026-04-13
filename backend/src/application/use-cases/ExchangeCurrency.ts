import { Pool } from "pg";
import { Transaction } from "../../domain/entities/Transaction";
import { AuditLog } from "../../domain/entities/AuditLog";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { CryptoApiService } from "../../infrastructure/external-apis/CryptoApiService";
import { Currency } from "../../domain/entities/Account";
import { v4 as uuidv4 } from "uuid";

export interface ExchangeDTO {
  userId: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: number;
}

export interface ExchangeResult {
  fromAmount: number;
  fromCurrency: Currency;
  toAmount: number;
  toCurrency: Currency;
  rate: number;
  transactionHash: string;
  auditLogId: string;
}

export class ExchangeCurrency {
  constructor(
    private pool: Pool,
    private accountRepository: IAccountRepository,
    private cryptoApiService: CryptoApiService
  ) {}

  async execute(dto: ExchangeDTO): Promise<ExchangeResult> {
    if (dto.fromCurrency === dto.toCurrency) {
      throw new Error("Cannot exchange same currency");
    }

    const prices = await this.cryptoApiService.getPrices();
    const { toAmount, rate } = this.calculateExchange(dto, prices);

    const transactionHash = `exch_${uuidv4().replace(/-/g, "").substring(0, 16)}`;
    const client = await this.pool.connect();

    try {
      // BEGIN ATOMIC TRANSACTION
      await client.query("BEGIN");

      // Get source account
      const fromAccount = await this.accountRepository.findByUserIdAndCurrency(
        dto.userId, dto.fromCurrency
      );
      if (!fromAccount) throw new Error(`No ${dto.fromCurrency} account found`);
      if (fromAccount.balance < dto.amount) throw new Error("Insufficient funds");

      // Get or create destination account
      let toAccount = await this.accountRepository.findByUserIdAndCurrency(
        dto.userId, dto.toCurrency
      );
      if (!toAccount) {
        const { Account } = await import("../../domain/entities/Account");
        toAccount = Account.create({
          userId: dto.userId,
          currency: dto.toCurrency,
          balance: 0,
        });
        await client.query(
          `INSERT INTO accounts (id, user_id, currency, balance, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [toAccount.id, toAccount.userId, toAccount.currency, toAccount.balance]
        );
      }

      // Debit source (atomic)
      const debitResult = await client.query(
        `UPDATE accounts SET balance = balance - $1, updated_at = NOW()
         WHERE id = $2 AND balance >= $1 RETURNING *`,
        [dto.amount, fromAccount.id]
      );
      if (debitResult.rows.length === 0) throw new Error("Insufficient funds (concurrent check)");

      // Credit destination (atomic)
      await client.query(
        `UPDATE accounts SET balance = balance + $1, updated_at = NOW()
         WHERE id = $2`,
        [toAmount, toAccount.id]
      );

      // Record debit transaction
      const debitTx = Transaction.create({
        accountId: fromAccount.id,
        type: "exchange",
        category: "crypto_exchange",
        amount: dto.amount,
        currency: dto.fromCurrency,
        description: `Exchange ${dto.amount} ${dto.fromCurrency} to ${dto.toCurrency}`,
        transactionHash: `${transactionHash}_debit`,
      });

      await client.query(
        `INSERT INTO transactions (id, account_id, type, category, amount, currency, description, transaction_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [debitTx.id, debitTx.accountId, debitTx.type, debitTx.category, debitTx.amount, debitTx.currency, debitTx.description, debitTx.transactionHash]
      );

      // Record credit transaction
      const creditTx = Transaction.create({
        accountId: toAccount.id,
        type: "exchange",
        category: "crypto_exchange",
        amount: toAmount,
        currency: dto.toCurrency,
        description: `Received from ${dto.fromCurrency} exchange`,
        transactionHash: `${transactionHash}_credit`,
      });

      await client.query(
        `INSERT INTO transactions (id, account_id, type, category, amount, currency, description, transaction_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [creditTx.id, creditTx.accountId, creditTx.type, creditTx.category, creditTx.amount, creditTx.currency, creditTx.description, creditTx.transactionHash]
      );

      // Write to audit log (immutable ledger)
      const auditLog = AuditLog.create({
        userId: dto.userId,
        action: "CURRENCY_EXCHANGE",
        details: {
          fromCurrency: dto.fromCurrency,
          toCurrency: dto.toCurrency,
          fromAmount: dto.amount,
          toAmount,
          rate,
          btcPrice: prices.btc,
          ethPrice: prices.eth,
        },
        transactionHash,
      });

      await client.query(
        `INSERT INTO audit_logs (id, user_id, action, details, transaction_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [auditLog.id, auditLog.userId, auditLog.action, JSON.stringify(auditLog.details), auditLog.transactionHash]
      );

      // COMMIT ATOMIC TRANSACTION
      await client.query("COMMIT");

      return {
        fromAmount: dto.amount,
        fromCurrency: dto.fromCurrency,
        toAmount,
        toCurrency: dto.toCurrency,
        rate,
        transactionHash,
        auditLogId: auditLog.id,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private calculateExchange(
    dto: ExchangeDTO,
    prices: { btc: number; eth: number }
  ): { toAmount: number; rate: number } {
    let rate: number;

    if (dto.fromCurrency === "SEK") {
      rate = dto.toCurrency === "BTC" ? prices.btc : prices.eth;
      return { toAmount: dto.amount / rate, rate };
    }

    if (dto.toCurrency === "SEK") {
      rate = dto.fromCurrency === "BTC" ? prices.btc : prices.eth;
      return { toAmount: dto.amount * rate, rate };
    }

    // Crypto to crypto (BTC <-> ETH)
    const fromSek = dto.fromCurrency === "BTC" ? dto.amount * prices.btc : dto.amount * prices.eth;
    const toRate = dto.toCurrency === "BTC" ? prices.btc : prices.eth;
    rate = dto.fromCurrency === "BTC" ? prices.btc / prices.eth : prices.eth / prices.btc;
    return { toAmount: fromSek / toRate, rate };
  }
}
