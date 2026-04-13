import sanctionData from "./sanction-list.json";

export interface SanctionCheckResult {
  isSanctioned: boolean;
  matchedEntity?: {
    name: string;
    reason: string;
    country: string;
  };
}

export class SanctionService {
  private sanctionedNames: Map<string, (typeof sanctionData.sanctionedEntities)[0]>;

  constructor() {
    this.sanctionedNames = new Map();
    for (const entity of sanctionData.sanctionedEntities) {
      this.sanctionedNames.set(entity.name.toLowerCase(), entity);
    }
  }

  async check(name: string): Promise<SanctionCheckResult> {
    // Simulate external API call delay
    await new Promise((resolve) => setTimeout(resolve, 80));

    const normalizedName = name.toLowerCase().trim();

    // Check exact match
    const exactMatch = this.sanctionedNames.get(normalizedName);
    if (exactMatch) {
      return {
        isSanctioned: true,
        matchedEntity: exactMatch,
      };
    }

    // Check partial match (name contained in sanctioned list)
    for (const [sanctionedName, entity] of this.sanctionedNames) {
      if (normalizedName.includes(sanctionedName) || sanctionedName.includes(normalizedName)) {
        return {
          isSanctioned: true,
          matchedEntity: entity,
        };
      }
    }

    return { isSanctioned: false };
  }
}
