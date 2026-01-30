import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';
import { execSync } from 'node:child_process';

beforeAll(() => {
  const testDatabaseUrl = 'file:./test.db?cache=shared';
  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: testDatabaseUrl }
    });
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }
});

afterAll(() => {});
