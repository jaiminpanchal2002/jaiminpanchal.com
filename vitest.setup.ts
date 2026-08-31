// Ensure a signing secret exists for session round-trip tests.
process.env.AUTH_SECRET =
  process.env.AUTH_SECRET ?? "test-secret-at-least-16-chars-long-abcdef";
