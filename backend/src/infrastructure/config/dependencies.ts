import { Pool } from "pg";
import { UserRepository } from "../database/repositories/UserRepository";
import { AccountRepository } from "../database/repositories/AccountRepository";
import { SparService } from "../external-apis/SparService";
import { SanctionService } from "../external-apis/SanctionService";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { VerifyIdentity } from "../../application/use-cases/VerifyIdentity";
import { AuthController } from "../../presentation/controllers/AuthController";

export interface AppDependencies {
  authController: AuthController;
}

export function createDependencies(pool: Pool): AppDependencies {
  // Repositories
  const userRepository = new UserRepository(pool);
  const accountRepository = new AccountRepository(pool);

  // External services
  const sparService = new SparService();
  const sanctionService = new SanctionService();

  // Use cases
  const registerUser = new RegisterUser(userRepository, accountRepository);
  const loginUser = new LoginUser(userRepository);
  const verifyIdentity = new VerifyIdentity(userRepository, sparService, sanctionService);

  // Controllers
  const authController = new AuthController(registerUser, loginUser, verifyIdentity);

  return { authController };
}
