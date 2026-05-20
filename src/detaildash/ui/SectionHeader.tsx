import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDText } from "./Text";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  const { theme } = useDD();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <DDText variant="h3">{title}</DDText>
        {subtitle ? (
          <DDText variant="caption" tone="muted" style={{ marginTop: 2 }}>
            {subtitle}
          </DDText>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={12}
          style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
        >
          <DDText variant="caption" tone="brand" style={{ fontWeight: "700" }}>
            {actionLabel}
          </DDText>
          <ChevronRight size={14} color={theme.colors.brand} />
        </Pressable>
      ) : null}
    </View>
  );
}
