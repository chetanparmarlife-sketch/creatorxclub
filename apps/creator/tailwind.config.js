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
        background: "#0B0B14",
        "background-dark": "#0B0B14",
        surface: "rgba(26,26,46,0.62)",
        "surface-solid": "#161625",
        "surface-dark": "rgba(26,26,46,0.62)",
        "text-primary": "#F7F4FF",
        "text-secondary": "#B9B4CC",
        "text-muted": "#8E89A6",
        "text-faint": "#615C78",
        "border-glass": "rgba(255,255,255,0.10)",
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
