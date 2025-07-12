# Hanashi

A Chrome extension for Japanese speech recognition and text-to-speech functionality with realistic voices.

## Project Structure

This is a monorepo containing multiple packages:

```bash
nihongo-speech/
├── packages/
│   ├── chrome/          # Chrome extension package
│   └── raycast/         # Raycast extension package
├── package.json         # Root package configuration
└── pnpm-workspace.yaml  # Workspace configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nihongo-speech
```

2. Install dependencies:

```bash
pnpm install
```

### Development

#### Chrome Extension

To start development for the Chrome extension:

```bash
pnpm dev
```

To build the Chrome extension:

```bash
pnpm build
```

#### Raycast Extension

To start development for the Raycast extension:

```bash
pnpm dev:r
```

To build the Raycast extension:

```bash
pnpm build:r
```

### Code Quality

Format code:

```bash
pnpm format
```

Lint code:

```bash
pnpm lint
```

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest, Testing Library
- **Code Quality**: Biome (formatting & linting)
- **Package Manager**: pnpm (workspace)

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Chrome extension development |
| `pnpm build` | Build Chrome extension |
| `pnpm dev:r` | Start Raycast extension development |
| `pnpm build:r` | Build Raycast extension |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |

## Chrome Extension Setup

1. Build the extension: `pnpm build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `packages/chrome/dist` folder

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

