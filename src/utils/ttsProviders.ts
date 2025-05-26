export type VoiceGender = 'male' | 'female';

export interface TTSOptions {
  text: string;
  gender: VoiceGender;
}

export async function fetchTTS({ text, gender }: TTSOptions): Promise<Blob> {
  // Choose provider here (stub: ElevenLabs)
  return fetchFromElevenLabs({ text, gender });
}

const Asahi = 'GKDaBI8TKSBJVhsCLD6n'
const Morioki = '8EkOjt4xTPGMclNlh1pk'

// Example: ElevenLabs API integration (replace with your API key)
async function fetchFromElevenLabs({ text, gender }: TTSOptions): Promise<Blob> {
  const apiKey = 'sk_47147aad742cdc08ee6039966a1dff46e2df05489e07acf3';
  const voiceId = gender === 'male' ? Asahi : Morioki;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.14,
        use_speaker_boost: true
      }
    })
  });
  if (!response.ok) {
    const errorBody = await response.text(); // Or response.json() if the API returns JSON errors
    console.error('TTS API Error Status:', response.status);
    console.error('TTS API Error Body:', errorBody);
    throw new Error(`TTS API error: ${response.status} - ${errorBody}`);
  }
  return await response.blob();
}

// Add similar functions for OpenAI, Sesame AI, etc. 