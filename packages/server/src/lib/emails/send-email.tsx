import { VerifyEmail } from "@hanashi/email";
import { consola } from "consola";
import { Resend } from "resend";

import { env } from "src/env";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailInput = {
	username: string;
	to: string;
	subject: string;
	url: string;
};

export async function sendEmail({
	username,
	to,
	subject,
	url,
}: SendEmailInput) {

	const emailResponse = await resend.emails.send({
		from: "Hanashi <hello@hanashi.kehinde.xyz>",
		to,
		subject,
		text: `Click the link to verify your email: ${url}`,
		react: <VerifyEmail username={username} verificationUrl={url} />
	});

	if (emailResponse.error) {
		consola.error({
			name: emailResponse.error.name,
			message: emailResponse.error.message,
		});
		return;
	}
	consola.log(emailResponse.data);
}
