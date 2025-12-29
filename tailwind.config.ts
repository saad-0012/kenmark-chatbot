import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <--- ENABLED DARK MODE HERE
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#3b82f6",
      },
    },
  },
  plugins: [],
};
export default config;