import { Request, Response, NextFunction } from "express";
import { AggregatorService } from "../../application/services/AggregatorService";

export class DashboardController {
  constructor(private aggregatorService: AggregatorService) {}

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      const data = await this.aggregatorService.getDashboardData(req.user.userId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
