import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";

export class DeleteTransaction {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, transactionId: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) throw new Error("Transaction not found");

    const account = await this.accountRepository.findById(transaction.accountId);
    if (!account) throw new Error("Account not found");
    if (account.userId !== userId) throw new Error("Unauthorized");

    // Reverse the balance change
    const updatedAccount =
      transaction.type === "deposit" || transaction.type === "exchange"
        ? account.debit(transaction.amount)
        : account.credit(transaction.amount);

    await this.accountRepository.update(updatedAccount);
    await this.transactionRepository.delete(transactionId);
  }
}
