import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2D2A26", // Deep Charcoal
        mist: "#FDFCF9", // Warm Cream Background
        pine: "#4A5D5E", // Muted Teal/Green
        ember: "#D4A373", // Muted Gold/Paper
        sand: "#F4EFE7", // Slightly darker cream for cards
        clay: "#A98467", // Warm Brown
      },
      boxShadow: {
        panel: "0 8px 30px rgba(45, 42, 38, 0.06)",
        soft: "0 4px 20px rgba(45, 42, 38, 0.04)",
      },
      backgroundImage: {
        paper: "linear-gradient(to bottom, #FDFCF9, #F4EFE7)",
        aurora:
          "radial-gradient(circle at 5% 15%, rgba(212, 163, 115, 0.15), transparent 30%), radial-gradient(circle at 82% 12%, rgba(74, 93, 94, 0.12), transparent 42%), linear-gradient(135deg, #FDFCF9 0%, #F4EFE7 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        reveal: "reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
