import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { env } from "src/env";
import { db } from "../db/db";
import { sendEmail } from "./emails/send-email";

const isDev = process.env.NODE_ENV === "development";

export const auth = betterAuth({
	baseURL: env.AUTH_BASE_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async (ctx) => {
			void sendEmail({
				to: isDev ? "delivered@resend.dev" : ctx.user.email,
				username: ctx.user.name,
				subject: "Verify your email address",
				url: ctx.url,
			});
		},
	},
	plugins: [openAPI()],
});
