import { describe, it, expect } from 'vitest';
import { fetchTTS, TTSOptions } from '../utils/ttsProviders'; // Adjust path as necessary

describe('fetchTTS', () => {
  it('should fetch TTS audio blob for female voice', async () => {
    const options: TTSOptions = {
      text: 'こんにちは、テストです。', // "Hello, this is a test."
      gender: 'female',
    };

    try {
      const blob = await fetchTTS(options);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('audio/mpeg'); // Or whatever the expected type is
      expect(blob.size).toBeGreaterThan(0);
      // Further checks can be added if needed, e.g., if the API returns specific error structures for bad requests
    } catch (error: any) {
      // Log the detailed error if the API call itself fails
      console.error('TTS API call failed during test:', error.message);
      // If the error is an API error we expect (e.g. bad API key), we might want to assert that
      // For now, we'll rethrow to make the test fail clearly if any unexpected error occurs
      throw error;
    }
  }, 30000); // Increase timeout to 30 seconds for network requests

  it('should fetch TTS audio blob for male voice', async () => {
    const options: TTSOptions = {
      text: 'こんにちは、男性の声のテストです。', // "Hello, this is a male voice test."
      gender: 'male',
    };

    try {
      const blob = await fetchTTS(options);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('audio/mpeg'); // Or whatever the expected type is
      expect(blob.size).toBeGreaterThan(0);
    } catch (error: any) {
      console.error('TTS API call failed during test:', error.message);
      throw error;
    }
  }, 30000); // Increase timeout to 30 seconds

  // Optional: Test for expected error handling, e.g., if text is empty
 
}); 