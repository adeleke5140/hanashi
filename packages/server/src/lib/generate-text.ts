import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { systemPrompt } from "./prompt";

export async function generateTransliteration(text: string, apiKey: string) {
	const openai = createOpenAI({
		apiKey,
	});
	return await generateText({
		model: openai("gpt-4.1-mini-2025-04-14"),
		system: systemPrompt,
		prompt: text,
	});
}
