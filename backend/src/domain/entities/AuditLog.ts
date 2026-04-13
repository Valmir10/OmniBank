import { v4 as uuidv4 } from "uuid";

export interface AuditLogProps {
  id?: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
  transactionHash: string;
  createdAt?: Date;
}

export class AuditLog {
  public readonly id: string;
  public readonly userId: string;
  public readonly action: string;
  public readonly details: Record<string, unknown>;
  public readonly transactionHash: string;
  public readonly createdAt: Date;

  private constructor(props: Required<AuditLogProps>) {
    this.id = props.id;
    this.userId = props.userId;
    this.action = props.action;
    this.details = props.details;
    this.transactionHash = props.transactionHash;
    this.createdAt = props.createdAt;
  }

  static create(props: AuditLogProps): AuditLog {
    return new AuditLog({
      id: props.id ?? uuidv4(),
      userId: props.userId,
      action: props.action,
      details: Object.freeze({ ...props.details }),
      transactionHash: props.transactionHash,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
