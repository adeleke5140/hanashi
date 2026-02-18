import { z } from "zod";

const envSchema = z.object({
	POSTGRES_PORT: z.coerce.number().min(4),
	POSTGRES_USER: z.string(),
	POSTGRES_DB: z.string(),
	POSTGRES_HOST: z.string(),
	POSTGRES_PASSWORD: z.string().min(5),
	DATABASE_URL: z.url("You need a url for the db"),
	RESEND_API_KEY: z.string().min(2),
	AUTH_BASE_URL: z.url("Please provide an auth base url").min(2),
});

export const env = envSchema.parse(process.env);
