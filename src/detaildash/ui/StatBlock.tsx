import React from "react";
import { View } from "react-native";
import { spacing } from "../theme/tokens";
import { Surface } from "./Surface";
import { DDText } from "./Text";

export interface StatBlockProps {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "success" | "danger";
}

export function StatBlock({
  label,
  value,
  delta,
  tone = "default",
}: StatBlockProps) {
  return (
    <Surface variant="elevated" radius="lg" padding="lg" style={{ flex: 1 }}>
      <DDText variant="micro" tone="subtle">
        {label.toUpperCase()}
      </DDText>
      <View style={{ height: spacing.xs }} />
      <DDText variant="h2">{value}</DDText>
      {delta ? (
        <DDText
          variant="caption"
          tone={tone === "danger" ? "danger" : "success"}
          style={{ marginTop: 4 }}
        >
          {delta}
        </DDText>
      ) : null}
    </Surface>
  );
}
