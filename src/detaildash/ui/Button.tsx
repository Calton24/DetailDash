import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    View,
    type PressableProps,
    type ViewStyle,
} from "react-native";
import { palette, radii, spacing, typography } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDText } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface DDButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  haptic?: boolean;
}

export function DDButton({
  label,
  variant = "primary",
  size = "lg",
  loading,
  disabled,
  fullWidth,
  leftIcon,
  rightIcon,
  style,
  onPress,
  haptic = true,
  ...rest
}: DDButtonProps) {
  const { theme } = useDD();

  const height = size === "sm" ? 38 : size === "md" ? 46 : 54;
  const px = size === "sm" ? spacing.lg : spacing.xl;

  const baseStyle: ViewStyle = {
    height,
    borderRadius: radii.pill,
    paddingHorizontal: px,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: fullWidth ? "100%" : undefined,
    opacity: disabled ? 0.45 : 1,
  };

  const handlePress = (
    e: Parameters<NonNullable<PressableProps["onPress"]>>[0]
  ) => {
    if (haptic && !disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => undefined
      );
    }
    onPress?.(e);
  };

  const textTone =
    variant === "primary" || variant === "danger"
      ? "inverse"
      : variant === "secondary"
        ? "default"
        : "brand";

  const content = (
    <>
      {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "danger"
              ? "#fff"
              : theme.colors.brand
          }
        />
      ) : (
        <DDText
          tone={textTone}
          style={size === "sm" ? typography.buttonSm : typography.buttonLg}
        >
          {label}
        </DDText>
      )}
      {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
    </>
  );

  if (variant === "primary") {
    return (
      <Pressable
        {...rest}
        disabled={disabled || loading}
        onPress={handlePress}
        style={({ pressed }) => [
          baseStyle,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: palette.brand,
            shadowOpacity: 0.35,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 16,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={[palette.brandSoft, palette.brand, palette.brandDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill as ViewStyle}
        />
        <View style={styles.row}>{content}</View>
      </Pressable>
    );
  }

  const bg =
    variant === "secondary"
      ? theme.colors.surfaceAlt
      : variant === "danger"
        ? theme.colors.danger
        : "transparent";

  const border =
    variant === "secondary"
      ? theme.colors.strokeStrong
      : variant === "ghost"
        ? theme.colors.stroke
        : "transparent";

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        baseStyle,
        {
          backgroundColor: bg,
          borderWidth: variant === "danger" ? 0 : 1,
          borderColor: border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});
