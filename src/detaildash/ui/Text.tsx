import React from "react";
import { Text as RNText, type TextProps, type TextStyle } from "react-native";
import { typography } from "../theme/tokens";
import { useDD } from "../theme/useDD";

type Variant = keyof typeof typography;
type Tone =
  | "default"
  | "muted"
  | "subtle"
  | "brand"
  | "danger"
  | "success"
  | "inverse";

export interface DDTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle["textAlign"];
  weight?: TextStyle["fontWeight"];
}

export function DDText({
  variant = "body",
  tone = "default",
  align,
  weight,
  style,
  children,
  ...rest
}: DDTextProps) {
  const { theme } = useDD();

  const color =
    tone === "muted"
      ? theme.colors.textMuted
      : tone === "subtle"
        ? theme.colors.textSubtle
        : tone === "brand"
          ? theme.colors.brand
          : tone === "danger"
            ? theme.colors.danger
            : tone === "success"
              ? theme.colors.success
              : tone === "inverse"
                ? theme.mode === "dark"
                  ? "#0A0A0B"
                  : "#FFFFFF"
                : theme.colors.text;

  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        {
          color,
          textAlign: align,
          fontWeight: weight ?? typography[variant].fontWeight,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
