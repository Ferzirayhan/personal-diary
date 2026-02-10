import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102226",
        mist: "#f5f7f4",
        pine: "#205b5a",
        ember: "#e7742b",
        sand: "#f4efe7",
        clay: "#b8653b",
      },
      boxShadow: {
        panel: "0 16px 35px rgba(16, 34, 38, 0.08)",
        soft: "0 10px 25px rgba(16, 34, 38, 0.12)",
      },
      backgroundImage: {
        paper: "radial-gradient(circle at 20% 10%, rgba(231,116,43,0.16), transparent 35%), radial-gradient(circle at 75% 40%, rgba(32,91,90,0.18), transparent 40%)",
        aurora:
          "radial-gradient(circle at 5% 15%, rgba(231,116,43,0.3), transparent 30%), radial-gradient(circle at 82% 12%, rgba(32,91,90,0.28), transparent 42%), linear-gradient(135deg, #f5f7f4 0%, #f4efe7 100%)",
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
        float: "float 5s ease-in-out infinite",
        reveal: "reveal 500ms ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
