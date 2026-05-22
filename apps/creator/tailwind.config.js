/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B4FE9",
        "primary-soft": "#8B82F0",
        "primary-shadow": "rgba(91,79,233,0.25)",
        background: "#FBF9F6",
        "background-dark": "#0B0B14",
        surface: "rgba(255,255,255,0.82)",
        "surface-dark": "rgba(26,26,46,0.62)",
        "text-primary": "#1A1A2E",
        "text-secondary": "#6B6B7B",
        "text-muted": "#9B96B0",
        "text-faint": "#C4C0D4",
        "border-glass": "rgba(232,228,240,0.5)",
        "error-soft": "#FFB4A2",
        error: "#E07A5F"
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans"],
        serif: ["Instrument Serif"]
      },
      borderRadius: {
        glass: "24px"
      },
      boxShadow: {
        primary: "0 8px 30px rgba(91,79,233,0.25)",
        glass: "0 8px 40px rgba(91,79,233,0.12)"
      }
    }
  },
  plugins: []
};
