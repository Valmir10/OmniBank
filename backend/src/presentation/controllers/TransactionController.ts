import { Request, Response, NextFunction } from "express";
import { CreateTransaction } from "../../application/use-cases/CreateTransaction";
import { DeleteTransaction } from "../../application/use-cases/DeleteTransaction";
import { UpdateTransaction } from "../../application/use-cases/UpdateTransaction";
import { SocketServer } from "../../infrastructure/websocket/SocketServer";

export class TransactionController {
  constructor(
    private createTransaction: CreateTransaction,
    private deleteTransaction: DeleteTransaction,
    private updateTransaction: UpdateTransaction,
    private socketServer: SocketServer | null
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }

      const result = await this.createTransaction.execute({
        userId: req.user.userId,
        accountId: req.body.accountId,
        type: req.body.type,
        category: req.body.category,
        amount: req.body.amount,
        description: req.body.description,
      });

      if (this.socketServer) {
        this.socketServer.emitTransactionCreated(req.user.userId, {
          id: result.transaction.id,
          type: result.transaction.type,
          category: result.transaction.category,
          amount: result.transaction.amount,
          description: result.transaction.description,
        });

        if (result.budgetAlert) {
          this.socketServer.emitBudgetAlert(req.user.userId, result.budgetAlert);
        }
      }

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === "Insufficient funds") {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      await this.updateTransaction.execute(
        req.user.userId,
        req.params.id as string,
        parseFloat(req.body.amount)
      );
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      await this.deleteTransaction.execute(req.user.userId, req.params.id as string);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        res.status(403).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
}
