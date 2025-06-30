import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

type VoiceGender = "male" | "female";

interface TTSRequest {
  text: string;
  gender?: VoiceGender;
}

// Voice IDs from your existing setup
const VOICES = {
  male: "GKDaBI8TKSBJVhsCLD6n", // Asahi
  female: "RBnMinrYKeccY3vaUxlZ", // Sakura
};

app.post("/tts", async (c) => {
  try {
    const { text, gender = "female" }: TTSRequest = await c.req.json();

    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
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
        text: text,
        model_id: "eleven_multilingual_v2",
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

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
