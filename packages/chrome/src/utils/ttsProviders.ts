export type VoiceGender = "male" | "female";

export interface TTSOptions {
  text: string;
  gender: VoiceGender;
}

export async function fetchTTS({ text, gender }: TTSOptions): Promise<Blob> {
  return fetchFromElevenLabs({ text, gender });
}

const Asahi = "GKDaBI8TKSBJVhsCLD6n";
const Morioki = "8EkOjt4xTPGMclNlh1pk";
const Sakura = "RBnMinrYKeccY3vaUxlZ";
const Saanu = "50YSQEDPA2vlOxhCseP4";

const config = {
  male: {
    stability: 0.5,
    similarity_boost: 0.14,
    use_speaker_boost: true,
  },
  female: {
    speed: 0.9,
    stability: 0.5,
    similarity_boost: 0.75,
    use_speaker_boost: true,
  },
};

async function fetchFromElevenLabs({
  text,
  gender,
}: TTSOptions): Promise<Blob> {
  const result = await chrome.storage.local.get(["elevenLabsApiKey"]);
  const apiKey = result.elevenLabsApiKey;

  if (!apiKey) {
    throw new Error(
      "Please set your ElevenLabs API key in the extension settings.",
    );
  }

  const voiceId = gender === "male" ? Asahi : Sakura;
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
        similarity_boost: 0.14,
        use_speaker_boost: true,
      },
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
