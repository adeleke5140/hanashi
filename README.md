# Nihongo Speech Chrome Extension

Convert Japanese sentences to realistic male and female speech using advanced TTS APIs (OpenAI, ElevenLabs, Sesame AI, etc).

## Features
- Input a Japanese sentence and get a realistic voice reading (male/female)
- Modular TTS provider integration
- Tailwind CSS styling

## Setup
1. Clone this repo
2. Run `npm install`
3. Add your TTS API key and endpoint in `src/utils/ttsProviders.ts`
4. Run `npm run build` to generate the extension files (using Vite)

## Local Testing
1. Open Chrome and go to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked" and select the `dist` directory
4. Use the extension popup to test Japanese TTS

## API Providers
- The code is modular: you can easily swap between OpenAI, ElevenLabs, Sesame AI, or any other TTS provider.
- See `src/utils/ttsProviders.ts` for integration details.

## Development
- Uses TypeScript, React, Tailwind CSS, and Vite
- Popup UI in `src/popup/`
- Background logic in `src/background/`
- TTS logic in `src/utils/`

---

**Note:** This extension does not ship with any API keys. You must provide your own in the appropriate file. 