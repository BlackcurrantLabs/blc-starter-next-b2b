import { vi } from 'vitest';

/**
 * Mock return type for Resend send method
 */
export interface MockResendResponse {
  data?: {
    id: string;
  };
  error?: {
    message: string;
  };
}

/**
 * Mock return type for the entire Resend client
 */
export interface MockResendClient {
  emails: {
    send: ReturnType<typeof vi.fn>;
  };
}

/**
 * Mocks the Resend email client
 * Returns a spy that can be asserted on for email sending calls
 *
 * @returns {MockResendClient} Mock Resend client with spyable send method
 *
 * @example
 * const mockResend = mockResend();
 * // Use in tests
 * expect(mockResend.emails.send).toHaveBeenCalledWith(
 *   expect.objectContaining({ to: 'test@example.com' })
 * );
 */
export function mockResend(): MockResendClient {
  const sendSpy = vi.fn(async (): Promise<MockResendResponse> => {
    return {
      data: {
        id: `email-${Date.now()}`,
      },
    };
  });

  // vi.doMock (not vi.mock): Vitest 5 only allows vi.mock at the top level of
  // a test file. Call this helper before dynamically importing the module
  // under test.
  vi.doMock('resend', () => ({
    // A regular function so the mock can be constructed with `new Resend()`.
    Resend: vi.fn(function () {
      return {
        emails: {
          send: sendSpy,
        },
      };
    }),
  }));

  return {
    emails: {
      send: sendSpy,
    },
  };
}

/**
 * Mocks the Altcha verifyAltchaPayload helper (@/lib/altcha)
 * Allows controlling whether captcha validation passes or fails
 *
 * @param {boolean} valid - Whether the captcha solution should be valid
 * @returns {void}
 *
 * @example
 * mockAltcha(true);
 * // verifyAltchaPayload will resolve to true
 *
 * mockAltcha(false);
 * // verifyAltchaPayload will resolve to false
 */
export function mockAltcha(valid: boolean): void {
  // vi.doMock (not vi.mock): see mockResend above.
  vi.doMock('@/lib/altcha', () => ({
    verifyAltchaPayload: vi.fn(async (): Promise<boolean> => valid),
  }));
}

/**
 * Temporarily sets environment variables for testing
 * Saves original values and returns a cleanup function
 *
 * @param {Record<string, string>} overrides - Environment variables to set
 * @returns {() => void} Cleanup function to restore original values
 *
 * @example
 * const cleanup = mockEnv({
 *   RESEND_KEY: 'test-key',
 *   RESEND_FROM: 'test@example.com',
 * });
 *
 * // Run tests...
 *
 * cleanup(); // Restore original values
 */
export function mockEnv(overrides: Record<string, string>): () => void {
  const originalValues: Record<string, string | undefined> = {};

  // Save original values
  for (const key of Object.keys(overrides)) {
    originalValues[key] = process.env[key];
  }

  // Set new values
  for (const [key, value] of Object.entries(overrides)) {
    process.env[key] = value;
  }

  // Return cleanup function
  return () => {
    for (const [key, originalValue] of Object.entries(originalValues)) {
      if (originalValue === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalValue;
      }
    }
  };
}

/**
 * Resets all mocks to their initial state
 * Clears all spy call history and mock implementations
 *
 * @returns {void}
 *
 * @example
 * beforeEach(() => {
 *   resetAllMocks();
 * });
 */
export function resetAllMocks(): void {
  vi.clearAllMocks();
}
