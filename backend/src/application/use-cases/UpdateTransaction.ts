import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";

export class UpdateTransaction {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, transactionId: string, newAmount: number): Promise<void> {
    if (newAmount <= 0) throw new Error("Amount must be positive");

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) throw new Error("Transaction not found");

    const account = await this.accountRepository.findById(transaction.accountId);
    if (!account) throw new Error("Account not found");
    if (account.userId !== userId) throw new Error("Unauthorized");

    const diff = newAmount - transaction.amount;

    if (diff !== 0) {
      // Adjust account balance based on transaction type and amount difference
      let updatedAccount;
      if (transaction.type === "deposit" || transaction.type === "exchange") {
        // Income: increasing amount = credit more, decreasing = debit
        updatedAccount = diff > 0 ? account.credit(diff) : account.debit(Math.abs(diff));
      } else {
        // Expense: increasing amount = debit more, decreasing = credit back
        updatedAccount = diff > 0 ? account.debit(diff) : account.credit(Math.abs(diff));
      }
      await this.accountRepository.update(updatedAccount);
    }

    // Update the transaction amount directly in DB
    await this.transactionRepository.updateAmount(transactionId, newAmount);
  }
}
