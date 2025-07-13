# Nihongo Speech Server

A Hono server that provides Japanese text-to-speech using ElevenLabs API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Add your ElevenLabs API key to `.env`:
```
ELEVENLABS_API_KEY=your_api_key_here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### POST /tts
Convert Japanese text to speech.

**Request Body:**
```json
{
  "text": "こんにちは",
  "gender": "female"
}
```

**Parameters:**
- `text` (required): Japanese text to convert
- `gender` (optional): "male" or "female" (defaults to "female")

**Response:** Audio file (MP3)

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```