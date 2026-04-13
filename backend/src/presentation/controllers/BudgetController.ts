import { Request, Response, NextFunction } from "express";
import { ManageBudget } from "../../application/use-cases/ManageBudget";

export class BudgetController {
  constructor(private manageBudget: ManageBudget) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const result = await this.manageBudget.create({
        userId: req.user.userId,
        category: req.body.category,
        limitAmount: req.body.limitAmount,
        month: req.body.month,
        year: req.body.year,
      });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const budgets = await this.manageBudget.getUserBudgets(req.user.userId);
      res.status(200).json(budgets);
    } catch (error) {
      next(error);
    }
  };

  updateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const result = await this.manageBudget.updateLimit(req.params.id as string, req.body.limitAmount);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
