---
trigger: testing_decision
description: Use this when writing or modifying tests
---

# Testing Guide

This guide outlines the testing philosophy, patterns, and utilities for the BLC Stack B2B project.

## Testing Philosophy

We follow the **Testing Pyramid** approach, prioritizing faster and more isolated tests while ensuring critical user flows are covered by end-to-end tests.

1.  **Unit Tests**: Logic and utility functions (Fastest, most isolated).
2.  **Integration Tests**: API routes and complex business logic flows.
3.  **Component Tests**: React components, focusing on accessibility and core interactions.
4.  **E2E Tests**: Full user journeys from a real browser perspective (Slowest, most comprehensive).

## File Organization

Tests are co-located with the source code they test, using the `*.test.ts` or `*.test.tsx` suffix.

- `src/lib/utils.ts` -> `src/lib/utils.test.ts`
- `src/components/ui/button.tsx` -> `src/components/ui/button.test.tsx`
- `src/app/api/example/route.ts` -> `src/app/api/example/route.test.ts`

E2E tests are located in the `e2e/` directory.

## Running Tests

We use **Vitest** for unit/integration/component tests and **Playwright** for E2E tests.

```bash
# Run all Vitest tests
pnpm test

# Run Vitest in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e --ui
```

## Unit Testing

Focus on pure functions and isolated logic.

- **Example**: `src/lib/utils.test.ts`
- **Tooling**: Vitest + `expect` assertions.

## Integration Testing

Test API routes and logic that interacts with multiple systems (DB, external APIs).

- **Example**: `src/app/api/contact/submit/route.test.ts`
- **Patterns**:
    - Mock external services (Resend, Altcha).
    - Use `mockEnv` to override environment variables.
    - Use `mockPrismaClient` or `createTestPrismaClient` for database isolation.

## Component Testing

Test React components using **React Testing Library**.

- **Example**: `src/components/logo.test.tsx`
- **Tooling**: `@testing-library/react`, `jsdom`, `vitest`.
- **Guidelines**:
    - Test accessibility (ARIA roles, labels).
    - Test user interactions (clicks, input changes).
    - **DO NOT** test Shadcn base components unless you've added significant custom logic.
    - **DO NOT** test trivial implementation details.

## E2E Testing

Test full user flows using **Playwright**.

- **Example**: `e2e/contact-form.spec.ts`, `e2e/auth.spec.ts`
- **Patterns**:
    - Use `prisma` directly for database setup and verification.
    - Use `seedTestUser` and `authenticatedPage` for testing protected routes.
    - Cleanup database between tests using `cleanupDatabase`.

## Testing Utilities

Located in `tests/utils/`:

| Utility | Purpose |
| :--- | :--- |
| `db.ts` | `createTestPrismaClient`, `withTransaction`, `cleanupDatabase` |
| `mocks.ts` | `mockResend`, `mockAltcha`, `mockEnv`, `resetAllMocks` |
| `factories.ts` | `createUser`, `createOrganization`, `createContactQuery`, etc. |
| `auth.ts` | `seedTestUser`, `authenticatedPage`, `TEST_USER` |

### Database Utilities

Always ensure test isolation. For Vitest, prefer mocking or in-memory SQLite. For E2E, use the development database with explicit cleanup.

```ts
// Example E2E cleanup
test.beforeEach(async () => {
  await cleanupDatabase(prisma);
});
```

### Mocking Examples

```ts
import { mockResend, mockAltcha, mockEnv } from '@/../tests/utils/mocks';

// Mock Resend
const resend = mockResend();

// Mock Altcha validation
mockAltcha(true);

// Mock Env
const cleanupEnv = mockEnv({ MY_VAR: 'test' });
```

## Common Pitfalls

- **State Leakage**: Always cleanup database and reset mocks between tests.
- **Flaky E2E Tests**: Use proper Playwright locators and wait for visibility/navigation.
- **Over-testing**: Focus on business value and critical paths. Don't test what the framework/library already tests.

## What NOT to Test

1.  **Implementation Details**: If you can refactor code without changing behavior and your tests fail, you're testing implementation details.
2.  **Trivial Code**: Simple getters/setters or purely presentational components with no logic.
3.  **Third-party Libraries**: Assume libraries like Radix UI or Shadcn base components work as intended. Test your *usage* of them, not the libraries themselves.
