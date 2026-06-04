import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { radii, shadows, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";

export interface SurfaceProps extends ViewProps {
  variant?: "flat" | "elevated" | "outlined" | "muted";
  radius?: keyof typeof radii;
  padding?: keyof typeof spacing;
  paddingX?: keyof typeof spacing;
  paddingY?: keyof typeof spacing;
  shadow?: keyof typeof shadows;
}

export function Surface({
  variant = "flat",
  radius = "lg",
  padding,
  paddingX,
  paddingY,
  shadow,
  style,
  children,
  ...rest
}: SurfaceProps) {
  const { theme } = useDD();

  const bg =
    variant === "elevated"
      ? theme.colors.bgElevated
      : variant === "outlined"
        ? theme.colors.surface
        : variant === "muted"
          ? theme.colors.surfaceAlt
          : theme.colors.surface;

  const surfaceStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radii[radius],
    borderWidth: variant === "outlined" ? 1 : 0,
    borderColor: theme.colors.stroke,
    padding: padding !== undefined ? spacing[padding] : undefined,
    paddingHorizontal: paddingX !== undefined ? spacing[paddingX] : undefined,
    paddingVertical: paddingY !== undefined ? spacing[paddingY] : undefined,
  };

  return (
    <View
      {...rest}
      style={[
        surfaceStyle,
        shadow ? (shadows[shadow] as ViewStyle) : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}
