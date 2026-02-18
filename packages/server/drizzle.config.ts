import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
	out: "./src/migrations",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	casing: "snake_case",
});
