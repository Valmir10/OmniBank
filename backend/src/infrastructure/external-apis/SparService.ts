export interface SparLookupResult {
  found: boolean;
  name?: string;
  registeredAddress?: string;
  dateOfBirth?: string;
}

export class SparService {
  async lookup(name: string): Promise<SparLookupResult> {
    // Simulate mTLS handshake delay
    await this.simulateMtlsHandshake();

    // Simulate SPAR registry response
    if (!name || name.trim().length < 2) {
      return { found: false };
    }

    return {
      found: true,
      name: name,
      registeredAddress: "Storgatan 1, 111 22 Stockholm",
      dateOfBirth: "1990-01-15",
    };
  }

  private async simulateMtlsHandshake(): Promise<void> {
    // Simulates the mTLS certificate exchange delay
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}
