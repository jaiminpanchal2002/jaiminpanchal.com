import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/matching.ts",
        "src/lib/ai/ats.ts",
        "src/lib/ai/text.ts",
        "src/lib/ai/provider.ts",
        "src/lib/form.ts",
        "src/lib/json.ts",
        "src/lib/session.ts",
        "src/lib/password.ts",
        "src/lib/jobs/constants.ts",
      ],
      reporter: ["text", "json-summary"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
