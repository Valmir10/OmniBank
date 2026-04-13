import { v4 as uuidv4 } from "uuid";
import { TransactionCategory } from "./Transaction";

export interface BudgetProps {
  id?: string;
  userId: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  month: number;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Budget {
  public readonly id: string;
  public readonly userId: string;
  public readonly category: TransactionCategory;
  public readonly limitAmount: number;
  public readonly currentSpent: number;
  public readonly month: number;
  public readonly year: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: Required<BudgetProps>) {
    this.id = props.id;
    this.userId = props.userId;
    this.category = props.category;
    this.limitAmount = props.limitAmount;
    this.currentSpent = props.currentSpent;
    this.month = props.month;
    this.year = props.year;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: BudgetProps): Budget {
    return new Budget({
      id: props.id ?? uuidv4(),
      userId: props.userId,
      category: props.category,
      limitAmount: props.limitAmount,
      currentSpent: props.currentSpent,
      month: props.month,
      year: props.year,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get isExceeded(): boolean {
    return this.currentSpent > this.limitAmount;
  }

  get remainingAmount(): number {
    return Math.max(0, this.limitAmount - this.currentSpent);
  }

  addSpending(amount: number): Budget {
    return Budget.create({
      ...this,
      currentSpent: this.currentSpent + amount,
      updatedAt: new Date(),
    });
  }
}
