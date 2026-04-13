import { VerifyIdentity } from "../../src/application/use-cases/VerifyIdentity";
import { User } from "../../src/domain/entities/User";
import { IUserRepository } from "../../src/domain/repositories/IUserRepository";
import { SparService } from "../../src/infrastructure/external-apis/SparService";
import { SanctionService } from "../../src/infrastructure/external-apis/SanctionService";

describe("VerifyIdentity Use Case", () => {
  let verifyIdentity: VerifyIdentity;
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockSparService: jest.Mocked<SparService>;
  let mockSanctionService: jest.Mocked<SanctionService>;

  const unverifiedUser = User.create({
    id: "user-123",
    email: "test@omnibank.se",
    name: "Test User",
    passwordHash: "hash",
    isVerified: false,
  });

  const verifiedUser = User.create({
    id: "user-456",
    email: "verified@omnibank.se",
    name: "Verified User",
    passwordHash: "hash",
    isVerified: true,
  });

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockSparService = {
      lookup: jest.fn(),
    } as unknown as jest.Mocked<SparService>;
    mockSanctionService = {
      check: jest.fn(),
    } as unknown as jest.Mocked<SanctionService>;

    verifyIdentity = new VerifyIdentity(
      mockUserRepo,
      mockSparService,
      mockSanctionService
    );
  });

  it("should verify a user successfully", async () => {
    mockUserRepo.findById.mockResolvedValue(unverifiedUser);
    mockSparService.lookup.mockResolvedValue({
      found: true,
      name: "Test User",
      registeredAddress: "Storgatan 1",
    });
    mockSanctionService.check.mockResolvedValue({ isSanctioned: false });
    mockUserRepo.update.mockImplementation(async (u) => u);

    const result = await verifyIdentity.execute("user-123");

    expect(result.verified).toBe(true);
    expect(result.sparLookup?.found).toBe(true);
    expect(result.sanctionCheck?.clear).toBe(true);
    expect(mockUserRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should return already verified for verified users", async () => {
    mockUserRepo.findById.mockResolvedValue(verifiedUser);

    const result = await verifyIdentity.execute("user-456");

    expect(result.verified).toBe(true);
    expect(result.message).toBe("User is already verified");
    expect(mockSparService.lookup).not.toHaveBeenCalled();
  });

  it("should fail if SPAR lookup fails", async () => {
    mockUserRepo.findById.mockResolvedValue(unverifiedUser);
    mockSparService.lookup.mockResolvedValue({ found: false });

    const result = await verifyIdentity.execute("user-123");

    expect(result.verified).toBe(false);
    expect(result.message).toContain("SPAR registry");
  });

  it("should fail if user is on sanctions list", async () => {
    mockUserRepo.findById.mockResolvedValue(unverifiedUser);
    mockSparService.lookup.mockResolvedValue({
      found: true,
      name: "Test User",
      registeredAddress: "Somewhere",
    });
    mockSanctionService.check.mockResolvedValue({
      isSanctioned: true,
      matchedEntity: {
        name: "Test User",
        reason: "Sanctioned entity",
        country: "XX",
      },
    });

    const result = await verifyIdentity.execute("user-123");

    expect(result.verified).toBe(false);
    expect(result.message).toContain("sanctions list");
    expect(mockUserRepo.update).not.toHaveBeenCalled();
  });

  it("should throw error if user not found", async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(verifyIdentity.execute("nonexistent")).rejects.toThrow(
      "User not found"
    );
  });
});
