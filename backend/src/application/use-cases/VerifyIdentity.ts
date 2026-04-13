import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { SparService } from "../../infrastructure/external-apis/SparService";
import { SanctionService } from "../../infrastructure/external-apis/SanctionService";

export interface VerifyResult {
  verified: boolean;
  message: string;
  sparLookup?: { found: boolean; registeredAddress?: string };
  sanctionCheck?: { clear: boolean; reason?: string };
}

export class VerifyIdentity {
  constructor(
    private userRepository: IUserRepository,
    private sparService: SparService,
    private sanctionService: SanctionService
  ) {}

  async execute(userId: string): Promise<VerifyResult> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isVerified) {
      return { verified: true, message: "User is already verified" };
    }

    // Step 1: Simulated mTLS call to SPAR registry
    const sparResult = await this.sparService.lookup(user.name);
    if (!sparResult.found) {
      return {
        verified: false,
        message: "Identity not found in SPAR registry",
        sparLookup: { found: false },
      };
    }

    // Step 2: Check against sanction list
    const sanctionResult = await this.sanctionService.check(user.name);
    if (sanctionResult.isSanctioned) {
      return {
        verified: false,
        message: `Verification denied: match found on sanctions list`,
        sparLookup: { found: true, registeredAddress: sparResult.registeredAddress },
        sanctionCheck: {
          clear: false,
          reason: sanctionResult.matchedEntity?.reason,
        },
      };
    }

    // Step 3: Mark user as verified
    const verifiedUser = user.verify();
    await this.userRepository.update(verifiedUser);

    return {
      verified: true,
      message: "Identity verified successfully via simulated KYC/AML process",
      sparLookup: { found: true, registeredAddress: sparResult.registeredAddress },
      sanctionCheck: { clear: true },
    };
  }
}
