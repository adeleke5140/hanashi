import { z } from "zod";

const envSchema = z.object({
	POSTGRES_PORT: z.coerce.number().min(4),
	POSTGRES_USER: z.string(),
	POSTGRES_DB: z.string(),
	POSTGRES_HOST: z.string(),
	POSTGRES_PASSWORD: z.string().min(5),
});

export const env = envSchema.parse(process.env);
