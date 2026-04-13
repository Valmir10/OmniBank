import { v4 as uuidv4 } from "uuid";

export type Currency = "SEK" | "BTC" | "ETH";

export interface AccountProps {
  id?: string;
  userId: string;
  currency: Currency;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account {
  public readonly id: string;
  public readonly userId: string;
  public readonly currency: Currency;
  public readonly balance: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: Required<AccountProps>) {
    this.id = props.id;
    this.userId = props.userId;
    this.currency = props.currency;
    this.balance = props.balance;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: AccountProps): Account {
    if (props.balance < 0) {
      throw new Error("Account balance cannot be negative");
    }
    return new Account({
      id: props.id ?? uuidv4(),
      userId: props.userId,
      currency: props.currency,
      balance: props.balance,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  credit(amount: number): Account {
    if (amount <= 0) throw new Error("Credit amount must be positive");
    return Account.create({
      ...this,
      balance: this.balance + amount,
      updatedAt: new Date(),
    });
  }

  debit(amount: number): Account {
    if (amount <= 0) throw new Error("Debit amount must be positive");
    if (amount > this.balance) throw new Error("Insufficient funds");
    return Account.create({
      ...this,
      balance: this.balance - amount,
      updatedAt: new Date(),
    });
  }
}
