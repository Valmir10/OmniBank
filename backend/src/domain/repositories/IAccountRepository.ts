import { Account, Currency } from "../entities/Account";

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  findByUserIdAndCurrency(userId: string, currency: Currency): Promise<Account | null>;
  create(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
}
