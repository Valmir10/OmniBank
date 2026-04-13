import { LoginUser } from "../../src/application/use-cases/LoginUser";
import { User } from "../../src/domain/entities/User";
import { IUserRepository } from "../../src/domain/repositories/IUserRepository";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("../../src/infrastructure/config/jwt", () => ({
  generateToken: jest.fn().mockReturnValue("mock_jwt_token"),
}));

import bcrypt from "bcrypt";

describe("LoginUser Use Case", () => {
  let loginUser: LoginUser;
  let mockUserRepo: jest.Mocked<IUserRepository>;

  const existingUser = User.create({
    id: "user-123",
    email: "test@omnibank.se",
    name: "Test User",
    passwordHash: "hashed_password",
    isVerified: true,
  });

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    loginUser = new LoginUser(mockUserRepo);
  });

  it("should login successfully with correct credentials", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(existingUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginUser.execute({
      email: "test@omnibank.se",
      password: "correctpassword",
    });

    expect(result.token).toBe("mock_jwt_token");
    expect(result.user.email).toBe("test@omnibank.se");
    expect(result.user.isVerified).toBe(true);
  });

  it("should throw error for non-existent email", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      loginUser.execute({ email: "wrong@email.com", password: "password" })
    ).rejects.toThrow("Invalid email or password");
  });

  it("should throw error for incorrect password", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(existingUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginUser.execute({ email: "test@omnibank.se", password: "wrong" })
    ).rejects.toThrow("Invalid email or password");
  });
});
