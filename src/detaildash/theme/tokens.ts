/**
 * DetailDash Design Tokens
 * Apple-level polish · dark premium automotive aesthetic
 */

import { Platform } from "react-native";

export const palette = {
  // Brand — electric blue gradient
  brand: "#3B82F6",
  brandDeep: "#1D4ED8",
  brandSoft: "#60A5FA",

  // Surface
  ink0: "#0A0A0B",
  ink1: "#111114",
  ink2: "#17171C",
  ink3: "#1F1F26",
  ink4: "#2A2A33",

  // Light surfaces
  paper0: "#FFFFFF",
  paper1: "#FAFAFB",
  paper2: "#F4F4F6",
  paper3: "#E8E8EC",

  // Text
  textOnDark: "#F5F5F7",
  textOnDarkMuted: "#A0A0AB",
  textOnDarkSubtle: "#6B6B76",
  textOnLight: "#0A0A0B",
  textOnLightMuted: "#5C5C66",
  textOnLightSubtle: "#8C8C96",

  // Semantic
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",

  // Tinted
  successSoft: "rgba(16, 185, 129, 0.12)",
  warningSoft: "rgba(245, 158, 11, 0.14)",
  dangerSoft: "rgba(239, 68, 68, 0.14)",
  brandSoftBg: "rgba(59, 130, 246, 0.14)",

  // Strokes
  strokeOnDark: "rgba(255, 255, 255, 0.08)",
  strokeOnDarkStrong: "rgba(255, 255, 255, 0.14)",
  strokeOnLight: "rgba(0, 0, 0, 0.06)",
  strokeOnLightStrong: "rgba(0, 0, 0, 0.12)",
} as const;

export type ThemeMode = "dark" | "light";

export interface DDTheme {
  mode: ThemeMode;
  colors: {
    bg: string;
    bgElevated: string;
    surface: string;
    surfaceAlt: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    brand: string;
    brandDeep: string;
    brandSoft: string;
    stroke: string;
    strokeStrong: string;
    success: string;
    warning: string;
    danger: string;
    overlay: string;
    skeleton: string;
  };
}

export const darkTheme: DDTheme = {
  mode: "dark",
  colors: {
    bg: palette.ink0,
    bgElevated: palette.ink1,
    surface: palette.ink2,
    surfaceAlt: palette.ink3,
    surfaceMuted: palette.ink4,
    text: palette.textOnDark,
    textMuted: palette.textOnDarkMuted,
    textSubtle: palette.textOnDarkSubtle,
    brand: palette.brand,
    brandDeep: palette.brandDeep,
    brandSoft: palette.brandSoft,
    stroke: palette.strokeOnDark,
    strokeStrong: palette.strokeOnDarkStrong,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    overlay: "rgba(0, 0, 0, 0.6)",
    skeleton: "rgba(255, 255, 255, 0.06)",
  },
};

export const lightTheme: DDTheme = {
  mode: "light",
  colors: {
    bg: palette.paper1,
    bgElevated: palette.paper0,
    surface: palette.paper0,
    surfaceAlt: palette.paper2,
    surfaceMuted: palette.paper3,
    text: palette.textOnLight,
    textMuted: palette.textOnLightMuted,
    textSubtle: palette.textOnLightSubtle,
    brand: palette.brand,
    brandDeep: palette.brandDeep,
    brandSoft: palette.brandSoft,
    stroke: palette.strokeOnLight,
    strokeStrong: palette.strokeOnLightStrong,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    overlay: "rgba(0, 0, 0, 0.4)",
    skeleton: "rgba(0, 0, 0, 0.05)",
  },
};

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

export const radii = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500" as const,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
  },
  micro: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
  },
  buttonLg: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.1,
  },
  buttonSm: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700" as const,
  },
} as const;

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
    },
    android: { elevation: 6 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 26,
    },
    android: { elevation: 12 },
    default: {},
  }),
} as const;

export const motion = {
  fast: 180,
  base: 240,
  slow: 360,
} as const;
