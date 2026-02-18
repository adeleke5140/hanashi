import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { voiceConfig } from "./lib/11labs/eleven-labs-config";
import { generateTransliteration } from "./lib/ai/generate-text";
import { auth } from "./lib/auth";

const app = new Hono();

app.use("*", cors());

type VoiceGender = "male" | "female";

interface TTSRequest {
	text: string;
	gender?: VoiceGender;
}

const VOICES = {
	male: voiceConfig.male.asahi_id,
	female: voiceConfig.female.sakura_id,
};

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
	return c.text("Welcome to Hanashi! 🌸");
});

app.post("/tts", async (c) => {
	try {
		const { ELEVENLABS_API_KEY, OPENAI_API_KEY } = env<{
			ELEVENLABS_API_KEY: string;
			OPENAI_API_KEY: string;
		}>(c);
		const { text, gender = "female" }: TTSRequest = await c.req.json();

		if (!text) {
			return c.json({ error: "Text is required" }, 400);
		}

		const transliteration = await generateTransliteration(text, OPENAI_API_KEY);

		const textForSpeech = transliteration.text ? transliteration.text : text;

		const apiKey = ELEVENLABS_API_KEY as string;
		if (!apiKey) {
			return c.json({ error: "ElevenLabs API key not configured" }, 500);
		}

		const voiceId = VOICES[gender];
		const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"xi-api-key": apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: textForSpeech,
				model_id: "eleven_multilingual_v2",
				// this should be dynamic from the client
				voice_settings: {
					stability: 0.5,
					similarity_boost: gender === "male" ? 0.14 : 0.75,
					use_speaker_boost: true,
				},
			}),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.error("ElevenLabs API Error:", response.status, errorBody);
			return c.json({ error: "TTS generation failed" }, 500);
		}

		const audioBuffer = await response.arrayBuffer();

		return new Response(audioBuffer, {
			headers: {
				"Content-Type": "audio/mpeg",
				"Content-Length": audioBuffer.byteLength.toString(),
			},
		});
	} catch (error) {
		console.error("TTS endpoint error:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

app.get("/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
