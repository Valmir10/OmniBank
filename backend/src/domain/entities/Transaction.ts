import { v4 as uuidv4 } from "uuid";
import { Currency } from "./Account";

export type TransactionType = "deposit" | "withdrawal" | "transfer" | "exchange";
export type TransactionCategory =
  | "food"
  | "entertainment"
  | "rent"
  | "salary"
  | "transport"
  | "utilities"
  | "crypto_exchange"
  | "other";

export interface TransactionProps {
  id?: string;
  accountId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  description: string;
  transactionHash?: string;
  createdAt?: Date;
}

export class Transaction {
  public readonly id: string;
  public readonly accountId: string;
  public readonly type: TransactionType;
  public readonly category: TransactionCategory;
  public readonly amount: number;
  public readonly currency: Currency;
  public readonly description: string;
  public readonly transactionHash: string;
  public readonly createdAt: Date;

  private constructor(props: Required<TransactionProps>) {
    this.id = props.id;
    this.accountId = props.accountId;
    this.type = props.type;
    this.category = props.category;
    this.amount = props.amount;
    this.currency = props.currency;
    this.description = props.description;
    this.transactionHash = props.transactionHash;
    this.createdAt = props.createdAt;
  }

  static create(props: TransactionProps): Transaction {
    if (props.amount <= 0) {
      throw new Error("Transaction amount must be positive");
    }
    return new Transaction({
      id: props.id ?? uuidv4(),
      accountId: props.accountId,
      type: props.type,
      category: props.category,
      amount: props.amount,
      currency: props.currency,
      description: props.description,
      transactionHash: props.transactionHash ?? generateHash(),
      createdAt: props.createdAt ?? new Date(),
    });
  }
}

function generateHash(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `tx_${timestamp}_${random}`;
}
