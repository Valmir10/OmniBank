import { v4 as uuidv4 } from "uuid";

export interface UserProps {
  id?: string;
  email: string;
  name: string;
  passwordHash: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly passwordHash: string;
  public readonly isVerified: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: Required<UserProps>) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.passwordHash = props.passwordHash;
    this.isVerified = props.isVerified;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: UserProps): User {
    return new User({
      id: props.id ?? uuidv4(),
      email: props.email,
      name: props.name,
      passwordHash: props.passwordHash,
      isVerified: props.isVerified,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  verify(): User {
    return User.create({
      ...this,
      isVerified: true,
      updatedAt: new Date(),
    });
  }
}
