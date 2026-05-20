import React from "react";
import { View, type ViewStyle } from "react-native";
import { spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDButton } from "./Button";
import { DDText } from "./Text";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { theme } = useDD();
  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.xxxl,
          gap: spacing.md,
        },
        style,
      ]}
    >
      {icon ? (
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.sm,
          }}
        >
          {icon}
        </View>
      ) : null}
      <DDText variant="h3" align="center">
        {title}
      </DDText>
      {message ? (
        <DDText tone="muted" align="center" style={{ maxWidth: 280 }}>
          {message}
        </DDText>
      ) : null}
      {actionLabel && onAction ? (
        <DDButton
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
          size="md"
          style={{ marginTop: spacing.md }}
        />
      ) : null}
    </View>
  );
}
