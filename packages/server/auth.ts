import { betterAuth } from "better-auth";
import { Pool } from "pg";
import "dotenv/config";
import { env } from "./src/env";

export const auth = betterAuth({
	database: new Pool({
		port: env.POSTGRES_PORT,
		user: env.POSTGRES_USER,
		database: env.POSTGRES_DB,
		host: env.POSTGRES_HOST,
		password: env.POSTGRES_PASSWORD,
	}),
});
