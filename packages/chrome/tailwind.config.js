module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,html}", "./public/*.html"],
	theme: {
		extend: {
			colors: {
				primary: "var(--primary)",
				secondary: "rgba(20, 22, 18, 1)",
				tertiary: "var(--tertiary)"
			},
			fontFamily: {
				mono: [
					"Berkeley Mono",
					"Fira Code",
					"JetBrains Mono",
					"Caskaydia Cove",
					"Iosevka",
					"ui-monospace",
					"monospace",
				],
				stick: ["Stick", "ui-monospace", "monospace"],
				kaisei: ["Kaisei Tokumin", "serif"],
			},
		},
	},
	plugins: [],
};
