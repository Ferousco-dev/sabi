import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: "#013D47",
        gold: "#AA852E",
        cream: "#F0EEE6",
        ink: "#0D1F23",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
