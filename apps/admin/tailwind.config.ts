import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#5B4FE9",
        ink: "#1A1A2E",
        canvas: "#FBF9F6"
      }
    }
  },
  plugins: []
};

export default config;
