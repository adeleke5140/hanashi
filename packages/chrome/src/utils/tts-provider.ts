export type VoiceGender = "male" | "female";

export interface TTSOptions {
	text: string;
	gender: VoiceGender;
}

export async function fetchResponse({
	text,
	gender,
}: {
	text: string;
	gender: VoiceGender;
}) {
	const response = await fetch(`http://localhost:8787/tts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			text,
			gender,
		}),
	});

	if (!response.ok) {
		const errorBody = await response.text(); // Or response.json() if the API returns JSON errors
		console.error("TTS API Error Status:", response.status);
		console.error("TTS API Error Body:", errorBody);
		throw new Error(`TTS API error: ${response.status} - ${errorBody}`);
	}
	return await response.blob();
}
