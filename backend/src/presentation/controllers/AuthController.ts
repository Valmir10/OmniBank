import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { VerifyIdentity } from "../../application/use-cases/VerifyIdentity";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private verifyIdentity: VerifyIdentity
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUser.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUser.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid")) {
        res.status(401).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      const result = await this.verifyIdentity.execute(req.user.userId);
      const statusCode = result.verified ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      res.status(200).json({ user: req.user });
    } catch (error) {
      next(error);
    }
  };
}
