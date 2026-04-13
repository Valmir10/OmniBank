import { Pool } from "pg";
import { UserRepository } from "../database/repositories/UserRepository";
import { AccountRepository } from "../database/repositories/AccountRepository";
import { TransactionRepository } from "../database/repositories/TransactionRepository";
import { SparService } from "../external-apis/SparService";
import { SanctionService } from "../external-apis/SanctionService";
import { MockBankApi } from "../external-apis/MockBankApi";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { VerifyIdentity } from "../../application/use-cases/VerifyIdentity";
import { AggregatorService } from "../../application/services/AggregatorService";
import { AuthController } from "../../presentation/controllers/AuthController";
import { DashboardController } from "../../presentation/controllers/DashboardController";

export interface AppDependencies {
  authController: AuthController;
  dashboardController: DashboardController;
}

export function createDependencies(pool: Pool): AppDependencies {
  // Repositories
  const userRepository = new UserRepository(pool);
  const accountRepository = new AccountRepository(pool);
  const transactionRepository = new TransactionRepository(pool);

  // External services
  const sparService = new SparService();
  const sanctionService = new SanctionService();
  const mockBankApi = new MockBankApi();

  // Use cases & services
  const registerUser = new RegisterUser(userRepository, accountRepository);
  const loginUser = new LoginUser(userRepository);
  const verifyIdentity = new VerifyIdentity(userRepository, sparService, sanctionService);
  const aggregatorService = new AggregatorService(accountRepository, transactionRepository, mockBankApi);

  // Controllers
  const authController = new AuthController(registerUser, loginUser, verifyIdentity);
  const dashboardController = new DashboardController(aggregatorService);

  return { authController, dashboardController };
}
