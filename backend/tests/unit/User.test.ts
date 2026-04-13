import { User } from "../../src/domain/entities/User";

describe("User Entity", () => {
  const validProps = {
    email: "test@omnibank.se",
    name: "Test User",
    passwordHash: "hashed_password_123",
    isVerified: false,
  };

  it("should create a user with valid properties", () => {
    const user = User.create(validProps);

    expect(user.email).toBe(validProps.email);
    expect(user.name).toBe(validProps.name);
    expect(user.passwordHash).toBe(validProps.passwordHash);
    expect(user.isVerified).toBe(false);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it("should create a user with a provided id", () => {
    const user = User.create({ ...validProps, id: "custom-id-123" });
    expect(user.id).toBe("custom-id-123");
  });

  it("should verify a user", () => {
    const user = User.create(validProps);
    expect(user.isVerified).toBe(false);

    const verifiedUser = user.verify();
    expect(verifiedUser.isVerified).toBe(true);
    expect(verifiedUser.id).toBe(user.id);
    expect(verifiedUser.email).toBe(user.email);
  });

  it("should preserve original user data when verifying", () => {
    const user = User.create(validProps);
    const verifiedUser = user.verify();

    expect(verifiedUser.name).toBe(user.name);
    expect(verifiedUser.passwordHash).toBe(user.passwordHash);
    expect(verifiedUser.email).toBe(user.email);
  });
});
