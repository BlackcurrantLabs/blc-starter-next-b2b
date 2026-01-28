import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';
import { execSync } from 'child_process';

/**
 * Creates a Prisma client configured for in-memory SQLite testing.
 * Each call creates a new isolated database instance.
 * 
 * @example
 * ```ts
 * const prisma = createTestPrismaClient();
 * await setupTestDatabase();
 * // ... run tests
 * await prisma.$disconnect();
 * ```
 */
export function createTestPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: 'file::memory:?cache=shared'
  });

  return new PrismaClient({ adapter });
}

/**
 * Wraps a test function in a transaction that automatically rolls back.
 * Ensures test isolation - changes are never committed to the database.
 * 
 * @param test - Async test function that receives a Prisma client
 * 
 * @example
 * ```ts
 * await withTransaction(async (prisma) => {
 *   await prisma.user.create({ data: { ... } });
 *   // Test assertions here
 *   // Transaction automatically rolls back after
 * });
 * ```
 */
export async function withTransaction(
  test: (prisma: PrismaClient) => Promise<void>
): Promise<void> {
  const prisma = createTestPrismaClient();

  try {
    await prisma.$transaction(async (tx) => {
      await test(tx as PrismaClient);
      throw new Error('ROLLBACK_TRANSACTION');
    });
  } catch (error) {
    if (error instanceof Error && error.message !== 'ROLLBACK_TRANSACTION') {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Truncates all tables in the database in correct dependency order.
 * Used for E2E test cleanup to ensure a clean slate between tests.
 * 
 * @param prisma - Prisma client instance
 * 
 * @example
 * ```ts
 * beforeEach(async () => {
 *   await cleanupDatabase(prisma);
 * });
 * ```
 */
export async function cleanupDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.contactReply.deleteMany();
  await prisma.contactQuery.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Sets up a test database by running Prisma migrations.
 * Creates schema and returns a configured test client.
 * 
 * @returns Configured Prisma client for testing
 * 
 * @example
 * ```ts
 * beforeAll(async () => {
 *   prisma = await setupTestDatabase();
 * });
 * 
 * afterAll(async () => {
 *   await prisma.$disconnect();
 * });
 * ```
 */
export async function setupTestDatabase(): Promise<PrismaClient> {
  const testDatabaseUrl = 'file::memory:?cache=shared';

  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: testDatabaseUrl }
    });
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }

  return createTestPrismaClient();
}
