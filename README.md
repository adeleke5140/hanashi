# Nihongo Speech Chrome Extension

Convert Japanese sentences to realistic male and female speech using elevenLabs TTS API

## Features
- Input a Japanese sentence and get a realistic voice reading (male/female)
- Modular TTS provider integration
- Tailwind CSS styling

## Setup
1. Clone this repo
2. Run `npm install`
3. Create a `.env` file in the root directory and add your TTS API key:
   ```
   VITE_ELEVENLABS_API_KEY=your_api_key_here
   ```
   (You can copy `.env.example` as a starting point if available)
4. Run `npm run build` to generate the extension files (using Vite)

## Local Testing
1. Open Chrome and go to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked" and select the `dist` directory
4. Use the extension popup to test Japanese TTS

## API Providers
- The code is modular: you can easily swap between OpenAI, ElevenLabs, Sesame AI, or any other TTS provider.
- See `src/utils/ttsProviders.ts` for integration details.
- Add your API keys as environment variables in the `.env` file.

## Development
- Uses TypeScript, React, Tailwind CSS, and Vite
- Popup UI in `src/popup/`
- Background logic in `src/background/`
- TTS logic in `src/utils/`

---

**Note:** This extension does not ship with any API keys. You must provide your own in a `.env` file in the root directory. 
