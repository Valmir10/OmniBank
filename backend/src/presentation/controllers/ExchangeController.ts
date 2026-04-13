import { Request, Response, NextFunction } from "express";
import { ExchangeCurrency } from "../../application/use-cases/ExchangeCurrency";
import { CryptoApiService } from "../../infrastructure/external-apis/CryptoApiService";
import { Currency } from "../../domain/entities/Account";

export class ExchangeController {
  constructor(
    private exchangeCurrency: ExchangeCurrency,
    private cryptoApiService: CryptoApiService
  ) {}

  getPrices = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prices = await this.cryptoApiService.getPrices();
      res.status(200).json(prices);
    } catch (error) {
      next(error);
    }
  };

  exchange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }

      const { fromCurrency, toCurrency, amount } = req.body;

      if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
        res.status(400).json({ error: "Invalid exchange parameters" });
        return;
      }

      const result = await this.exchangeCurrency.execute({
        userId: req.user.userId,
        fromCurrency: fromCurrency as Currency,
        toCurrency: toCurrency as Currency,
        amount: parseFloat(amount),
      });

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Insufficient")) {
          res.status(400).json({ error: error.message });
          return;
        }
        if (error.message.includes("same currency")) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      next(error);
    }
  };
}
