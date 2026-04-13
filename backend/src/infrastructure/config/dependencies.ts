import { Pool } from "pg";
import { UserRepository } from "../database/repositories/UserRepository";
import { AccountRepository } from "../database/repositories/AccountRepository";
import { TransactionRepository } from "../database/repositories/TransactionRepository";
import { BudgetRepository } from "../database/repositories/BudgetRepository";
import { AuditLogRepository } from "../database/repositories/AuditLogRepository";
import { SparService } from "../external-apis/SparService";
import { SanctionService } from "../external-apis/SanctionService";
import { MockBankApi } from "../external-apis/MockBankApi";
import { CryptoApiService } from "../external-apis/CryptoApiService";
import { SocketServer } from "../websocket/SocketServer";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { VerifyIdentity } from "../../application/use-cases/VerifyIdentity";
import { AggregatorService } from "../../application/services/AggregatorService";
import { ManageBudget } from "../../application/use-cases/ManageBudget";
import { CreateTransaction } from "../../application/use-cases/CreateTransaction";
import { ExchangeCurrency } from "../../application/use-cases/ExchangeCurrency";
import { AuthController } from "../../presentation/controllers/AuthController";
import { DashboardController } from "../../presentation/controllers/DashboardController";
import { BudgetController } from "../../presentation/controllers/BudgetController";
import { TransactionController } from "../../presentation/controllers/TransactionController";
import { ExchangeController } from "../../presentation/controllers/ExchangeController";
import { AuditLogController } from "../../presentation/controllers/AuditLogController";

export interface AppDependencies {
  authController: AuthController;
  dashboardController: DashboardController;
  budgetController: BudgetController;
  transactionController: TransactionController;
  exchangeController: ExchangeController;
  auditLogController: AuditLogController;
}

export function createDependencies(pool: Pool, socketServer: SocketServer | null): AppDependencies {
  // Repositories
  const userRepository = new UserRepository(pool);
  const accountRepository = new AccountRepository(pool);
  const transactionRepository = new TransactionRepository(pool);
  const budgetRepository = new BudgetRepository(pool);
  const auditLogRepository = new AuditLogRepository(pool);

  // External services
  const sparService = new SparService();
  const sanctionService = new SanctionService();
  const mockBankApi = new MockBankApi();
  const cryptoApiService = new CryptoApiService();

  // Use cases & services
  const registerUser = new RegisterUser(userRepository, accountRepository);
  const loginUser = new LoginUser(userRepository);
  const verifyIdentity = new VerifyIdentity(userRepository, sparService, sanctionService);
  const aggregatorService = new AggregatorService(accountRepository, transactionRepository, mockBankApi);
  const manageBudget = new ManageBudget(budgetRepository);
  const createTransaction = new CreateTransaction(transactionRepository, accountRepository, budgetRepository);
  const exchangeCurrency = new ExchangeCurrency(pool, accountRepository, cryptoApiService);

  // Controllers
  const authController = new AuthController(registerUser, loginUser, verifyIdentity);
  const dashboardController = new DashboardController(aggregatorService);
  const budgetController = new BudgetController(manageBudget);
  const transactionController = new TransactionController(createTransaction, socketServer);
  const exchangeController = new ExchangeController(exchangeCurrency, cryptoApiService);
  const auditLogController = new AuditLogController(auditLogRepository);

  return {
    authController, dashboardController, budgetController,
    transactionController, exchangeController, auditLogController,
  };
}
