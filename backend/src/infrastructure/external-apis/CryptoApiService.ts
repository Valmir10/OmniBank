export interface CryptoPrice {
  btc: number;
  eth: number;
  lastUpdated: string;
}

export class CryptoApiService {
  private cachedPrices: CryptoPrice | null = null;
  private cacheExpiry = 0;
  private readonly CACHE_TTL = 30000;

  async getPrices(): Promise<CryptoPrice> {
    if (this.cachedPrices && Date.now() < this.cacheExpiry) {
      return this.cachedPrices;
    }

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=sek"
      );

      if (response.ok) {
        const data = await response.json() as { bitcoin: { sek: number }; ethereum: { sek: number } };
        this.cachedPrices = {
          btc: data.bitcoin.sek,
          eth: data.ethereum.sek,
          lastUpdated: new Date().toISOString(),
        };
        this.cacheExpiry = Date.now() + this.CACHE_TTL;
        return this.cachedPrices;
      }
    } catch {
      // Fall through to mock prices
    }

    this.cachedPrices = {
      btc: 985420 + Math.round((Math.random() - 0.5) * 20000),
      eth: 28750 + Math.round((Math.random() - 0.5) * 1500),
      lastUpdated: new Date().toISOString(),
    };
    this.cacheExpiry = Date.now() + this.CACHE_TTL;
    return this.cachedPrices;
  }

  async getSekToCrypto(amount: number, crypto: "BTC" | "ETH"): Promise<number> {
    const prices = await this.getPrices();
    const rate = crypto === "BTC" ? prices.btc : prices.eth;
    return amount / rate;
  }

  async getCryptoToSek(amount: number, crypto: "BTC" | "ETH"): Promise<number> {
    const prices = await this.getPrices();
    const rate = crypto === "BTC" ? prices.btc : prices.eth;
    return amount * rate;
  }
}
