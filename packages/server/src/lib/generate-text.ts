import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { systemPrompt } from "./prompt";

export async function generateTransliteration(text: string) {
  return await generateText({
    model: openai("gpt-4.1-mini-2025-04-14"),
    system: systemPrompt,
    prompt: text,
  });
}
