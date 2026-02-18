/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const copyIconsPlugin = () => {
	return {
		name: "copy-icons",
		writeBundle() {
			const iconFiles = ["icon-16.png", "icon-48.png", "icon-128.png"];
			for (const file of iconFiles) {
				const src = join("public", file);
				const dest = join("dist", file);
				if (existsSync(src)) {
					copyFileSync(src, dest);
				}
			}

			const fontFiles = ["kaisei-regular.ttf", "stick-regular.ttf"];
			for (const file of fontFiles) {
				const src = join("src", "fonts", file);
				const dest = join("dist", "fonts", file);
				if (existsSync(src)) {
					mkdirSync(dirname(dest), { recursive: true });
					copyFileSync(src, dest);
				}
			}
		},
	};
};

export default defineConfig(({ mode }) => ({
	plugins: [react(), copyIconsPlugin()],
	server: {
		open: mode === "development" ? "/overlay-dev.html" : "/popup.html",
	},
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["src/__tests__/setupTests.ts"],
		include: ["src/__tests__/**/*.test.{ts,tsx}"],
	},
	build: {
		outDir: "dist",
		minify: mode === "production" ? "esbuild" : false,
		sourcemap: mode !== "production",
		rollupOptions: {
			input: {
				popup_entry: "popup.html",
				background: "src/background/background.ts",
				overlay: "src/content/overlay.ts",
			},
			output: {
				entryFileNames: "[name].js",
				assetFileNames: "assets/[name]-[hash][extname]",
			},
		},
		emptyOutDir: true,
	},
}));
