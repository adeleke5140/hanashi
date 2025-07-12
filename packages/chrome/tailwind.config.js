module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}", "./public/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(253, 255, 121, 1)",
        secondary: "rgba(20, 22, 18, 1)",
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
