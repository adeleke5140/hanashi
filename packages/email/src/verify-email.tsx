import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

export interface VerifyEmailProps {
	username?: string;
	verificationUrl: string;
}

const VerifyEmail = ({
	username = "Nicole",
	verificationUrl,
}: VerifyEmailProps) => {
	const previewText = `Welcome to Hanashi, ${username}!`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="m-auto font-sans">
					<Container className="mb-10 mx-auto p-5 max-w-[465px]">
						<Heading className="text-2xl text-black font-normal text-center p-0 my-8 mx-0">
							Welcome to <strong>Hanashi</strong>, {username}!
						</Heading>
						<Text className="text-start text-sm text-black">
							Hello {username},
						</Text>
						<Text className="text-start text-sm text-black leading-relaxed">
							We're excited to have you onboard at Hanashi. To begin your
							journey with us, please verify your email by clicking the button
							below.
						</Text>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								className="py-2.5 px-5 bg-black rounded-xl text-white text-sm font-semibold no-underline text-center"
								href={verificationUrl}
							>
								Verify Email
							</Button>
						</Section>
						<Text className="text-start text-sm text-white">
							Cheers,
							<br />
							The Hanashi Team
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default VerifyEmail;
