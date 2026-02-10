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
      },
      boxShadow: {
        panel: "0 16px 35px rgba(16, 34, 38, 0.08)",
      },
      backgroundImage: {
        paper: "radial-gradient(circle at 20% 10%, rgba(231,116,43,0.16), transparent 35%), radial-gradient(circle at 75% 40%, rgba(32,91,90,0.18), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
