import { IUserRepository } from "../../domain/repositories/IUserRepository";

interface SanctionCheckResult {
  isSanctioned: boolean;
  details?: string;
}

export class VerifyIdentity {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ verified: boolean; message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isVerified) {
      return { verified: true, message: "User is already verified" };
    }

    // Simulated mTLS call to mocked SPAR service
    const sparResult = await this.simulateSparLookup(user.name);
    if (!sparResult) {
      return { verified: false, message: "SPAR lookup failed - identity not found" };
    }

    // Simulated sanction list check
    const sanctionResult = await this.checkSanctionList(user.name);
    if (sanctionResult.isSanctioned) {
      return {
        verified: false,
        message: `Verification denied: ${sanctionResult.details}`,
      };
    }

    const verifiedUser = user.verify();
    await this.userRepository.update(verifiedUser);

    return { verified: true, message: "Identity verified successfully via simulated KYC" };
  }

  private async simulateSparLookup(name: string): Promise<boolean> {
    // Simulates mTLS handshake + SPAR registry lookup
    await new Promise((resolve) => setTimeout(resolve, 100));
    return name.length > 0;
  }

  private async checkSanctionList(_name: string): Promise<SanctionCheckResult> {
    // Check against local sanction list (simulated)
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { isSanctioned: false };
  }
}
