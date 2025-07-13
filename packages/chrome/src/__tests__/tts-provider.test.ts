import { describe, it, expect } from "vitest";
import { fetchResponse, type TTSOptions } from "../utils/tts-provider";
import { getErrorMessage } from "../utils/error";

describe("fetchTTS", () => {
  it("should fetch TTS audio blob for female voice", async () => {
    const options: TTSOptions = {
      text: "こんにちは、テストです。",
      gender: "female",
    };

    try {
      const blob = await fetchResponse(options);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("audio/mpeg");
      expect(blob.size).toBeGreaterThan(0);
    } catch (error: unknown) {
      console.error("TTS API call failed during test:", getErrorMessage(error));
      throw error;
    }
  }, 30000);

  it("should fetch TTS audio blob for male voice", async () => {
    const options: TTSOptions = {
      text: "こんにちは、男性の声のテストです。",
      gender: "male",
    };

    try {
      const blob = await fetchResponse(options);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("audio/mpeg");
      expect(blob.size).toBeGreaterThan(0);
    } catch (error: unknown) {
      console.error("TTS API call failed during test:", getErrorMessage(error));
      throw error;
    }
  }, 30000);
});
