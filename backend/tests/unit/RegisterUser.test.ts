import { RegisterUser } from "../../src/application/use-cases/RegisterUser";
import { User } from "../../src/domain/entities/User";
import { Account } from "../../src/domain/entities/Account";
import { IUserRepository } from "../../src/domain/repositories/IUserRepository";
import { IAccountRepository } from "../../src/domain/repositories/IAccountRepository";

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

// Mock jwt
jest.mock("../../src/infrastructure/config/jwt", () => ({
  generateToken: jest.fn().mockReturnValue("mock_jwt_token"),
}));

describe("RegisterUser Use Case", () => {
  let registerUser: RegisterUser;
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAccountRepo: jest.Mocked<IAccountRepository>;

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockAccountRepo = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByUserIdAndCurrency: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    registerUser = new RegisterUser(mockUserRepo, mockAccountRepo);
  });

  it("should register a new user successfully", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.create.mockImplementation(async (user) => user);
    mockAccountRepo.create.mockImplementation(async (account) => account);

    const result = await registerUser.execute({
      email: "test@omnibank.se",
      name: "Test User",
      password: "securepassword123",
    });

    expect(result.token).toBe("mock_jwt_token");
    expect(result.user.email).toBe("test@omnibank.se");
    expect(result.user.name).toBe("Test User");
    expect(result.user.isVerified).toBe(false);
    expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
    expect(mockAccountRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should throw error if email already exists", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(
      User.create({
        email: "test@omnibank.se",
        name: "Existing",
        passwordHash: "hash",
        isVerified: false,
      })
    );

    await expect(
      registerUser.execute({
        email: "test@omnibank.se",
        name: "Test",
        password: "password123",
      })
    ).rejects.toThrow("User with this email already exists");
  });

  it("should create a SEK account with 10000 starting balance", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.create.mockImplementation(async (user) => user);
    mockAccountRepo.create.mockImplementation(async (account) => account);

    await registerUser.execute({
      email: "test@omnibank.se",
      name: "Test User",
      password: "securepassword123",
    });

    const createdAccount = mockAccountRepo.create.mock.calls[0][0];
    expect(createdAccount.currency).toBe("SEK");
    expect(createdAccount.balance).toBe(10000);
  });
});
