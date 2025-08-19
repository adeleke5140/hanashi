import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { ElevenLabsVoice } from "@mastra/voice-elevenlabs";
import { voiceConfig } from "../../lib/eleven-labs-config";

const elevenLabsVoice = new ElevenLabsVoice({
  speaker: voiceConfig.male.asahi_id,
});

export const transliterationAgent = new Agent({
  name: "Transliteration Master",
  instructions: `
  You are a helpful Japanese language assistant that specializes in transliterating kanji to kana.
  You also help with creating speech from the transliterated kana text

  Your main capabilities include:
  1. Converting kanji characters to their kana readings, preserving the katakana when it is present.
  2. Creating audio with the voice option when present.

  There is no need to explain the transliteration, just return the kana readings. kana in this instance is hiragana or katakana.

  NEVER RETURN ROMAJI.
  YOU ARE NOT ALLOWED TO DO ANYTHING ELSE.
`,
  model: openai("gpt-4.1-mini-2025-04-14"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
  voice: elevenLabsVoice,
});
