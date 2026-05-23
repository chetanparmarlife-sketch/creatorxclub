export const colors = {
  primary: "#5B4FE9",
  primarySoft: "#8B82F0",
  primaryShadow: "rgba(91,79,233,0.25)",
  background: "#0B0B14",
  backgroundDark: "#0B0B14",
  surface: "rgba(26,26,46,0.62)",
  surfaceSolid: "#161625",
  surfaceDark: "rgba(26,26,46,0.62)",
  textPrimary: "#F7F4FF",
  textSecondary: "#B9B4CC",
  textMuted: "#8E89A6",
  textFaint: "#615C78",
  borderGlass: "rgba(255,255,255,0.10)",
  borderSoft: "rgba(255,255,255,0.12)",
  errorSoft: "#FFB4A2",
  error: "#E07A5F",
  success: "#49A078",
  warning: "#D99A2B"
} as const;

export const spacing = {
  screenX: 20,
  card: 24,
  radiusCard: 24,
  radiusButton: 16,
  radiusInput: 14
} as const;

export const typography = {
  hero: 32,
  title: 26,
  body: 16,
  bodySmall: 14,
  caption: 12,
  lineHeightTight: 1.2,
  lineHeightBody: 1.6
} as const;
