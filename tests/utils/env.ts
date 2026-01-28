export function mockEnv(overrides: Record<string, string>): () => void {
  const originalValues: Record<string, string | undefined> = {};

  for (const key of Object.keys(overrides)) {
    originalValues[key] = process.env[key];
  }

  for (const [key, value] of Object.entries(overrides)) {
    process.env[key] = value;
  }

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
