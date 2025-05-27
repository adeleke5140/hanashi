# Nihongo Speech

<<<<<<< Updated upstream
Convert Japanese sentences to realistic male and female speech using elevenLabs TTS API
=======
A Chrome extension for converting Japanese text to realistic speech using ElevenLabs AI voices.
>>>>>>> Stashed changes

## Features

- 🎌 **Japanese TTS**: Convert Japanese text to natural-sounding speech
- 👥 **Multiple Voices**: Choose between male (Asahi) and female (Morioki) voices
- 🎵 **Audio Player**: Built-in player with progress and volume controls
- 🔒 **Secure**: API keys stored locally in Chrome storage
- 🎨 **Modern UI**: Clean interface with rounded corners and smooth animations

## Setup

### 1. Get ElevenLabs API Key
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to [API Settings](https://elevenlabs.io/app/settings/api-keys)
3. Create a new API key

### 2. Install Extension
1. Clone this repository
2. Run `npm install`
3. Run `npm run build:prod`
4. Load the `dist` folder as an unpacked extension in Chrome

### 3. Configure API Key
1. Click the extension icon
2. Enter your ElevenLabs API key in the settings
3. Start converting Japanese text to speech!

## Development

```bash
# Install dependencies
npm install

<<<<<<< Updated upstream
**Note:** This extension does not ship with any API keys. You must provide your own in a `.env` file in the root directory. 
=======
# Development build (with source maps)
npm run build

# Production build (minified, optimized)
npm run build:prod

# Development server
npm run dev
```

## Security

- ✅ **No hardcoded API keys** in source code
- ✅ **Local storage** - API keys stored in Chrome's secure storage
- ✅ **Minimal permissions** - only accesses ElevenLabs API
- ✅ **No data collection** - all processing happens locally

## Chrome Web Store Deployment

This extension is ready for Chrome Web Store submission:

1. Run `npm run build:prod`
2. Zip the `dist` folder
3. Upload to Chrome Web Store Developer Dashboard

## License

MIT License 
>>>>>>> Stashed changes
