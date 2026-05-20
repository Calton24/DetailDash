import React from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDText } from "./Text";

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  tone?: "default" | "success" | "warning" | "danger" | "brand";
  size?: "sm" | "md";
  style?: ViewStyle;
}

export function Chip({
  label,
  icon,
  selected,
  onPress,
  tone = "default",
  size = "md",
  style,
}: ChipProps) {
  const { theme } = useDD();
  const isInteractive = typeof onPress === "function";

  const toneBg = selected
    ? theme.colors.brand
    : tone === "success"
      ? "rgba(16, 185, 129, 0.14)"
      : tone === "warning"
        ? "rgba(245, 158, 11, 0.16)"
        : tone === "danger"
          ? "rgba(239, 68, 68, 0.16)"
          : tone === "brand"
            ? "rgba(59, 130, 246, 0.16)"
            : theme.colors.surfaceAlt;

  const toneText = selected
    ? theme.mode === "dark"
      ? "#0A0A0B"
      : "#FFFFFF"
    : tone === "success"
      ? theme.colors.success
      : tone === "warning"
        ? theme.colors.warning
        : tone === "danger"
          ? theme.colors.danger
          : tone === "brand"
            ? theme.colors.brand
            : theme.colors.text;

  const inner = (
    <View
      style={{
        paddingHorizontal: size === "sm" ? spacing.md : spacing.lg,
        paddingVertical: size === "sm" ? 6 : 8,
        borderRadius: radii.pill,
        backgroundColor: toneBg,
        borderWidth: selected ? 0 : 1,
        borderColor: theme.colors.stroke,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon}
      <DDText
        variant={size === "sm" ? "micro" : "caption"}
        style={{ color: toneText, fontWeight: "700" }}
      >
        {label}
      </DDText>
    </View>
  );

  if (!isInteractive) return <View style={style}>{inner}</View>;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        style,
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      {inner}
    </Pressable>
  );
}
