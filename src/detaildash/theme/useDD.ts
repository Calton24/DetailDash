import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type DDTheme } from "./tokens";

/**
 * Primary theme hook for DetailDash screens.
 * Defaults to dark (premium automotive aesthetic) unless explicit light scheme.
 */
export function useDD(): { theme: DDTheme } {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? lightTheme : darkTheme;
  return { theme };
}
