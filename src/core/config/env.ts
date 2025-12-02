import { z } from "zod";

const envSchema = z.object({
  apiUrl: z.string().url("NEXT_PUBLIC_API_URL must be a valid URL"),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
});

function validateEnv() {
  const envVars = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    nodeEnv: process.env.NODE_ENV as "development" | "production" | "test",
  };

  try {
    return envSchema.parse(envVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
      throw new Error(
        `❌ Invalid environment variables:\n${errorMessages.join("\n")}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
