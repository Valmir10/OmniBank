import bcrypt from "bcrypt";
import { User } from "../../domain/entities/User";
import { Account } from "../../domain/entities/Account";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { RegisterDTO, AuthResponseDTO } from "../dto/AuthDTO";
import { generateToken } from "../../infrastructure/config/jwt";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private accountRepository: IAccountRepository
  ) {}

  async execute(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = User.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      isVerified: false,
    });

    const savedUser = await this.userRepository.create(user);

    await this.accountRepository.create(
      Account.create({
        userId: savedUser.id,
        currency: "SEK",
        balance: 10000,
      })
    );

    const token = generateToken({ userId: savedUser.id, email: savedUser.email });

    return {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        isVerified: savedUser.isVerified,
      },
    };
  }
}
