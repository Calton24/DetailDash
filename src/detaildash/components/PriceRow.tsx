import React from "react";
import { View } from "react-native";
import { spacing } from "../theme/tokens";
import { DDText } from "../ui/Text";

export interface PriceRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "default" | "muted" | "success";
}

export function PriceRow({
  label,
  value,
  emphasis,
  tone = "default",
}: PriceRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.xs,
      }}
    >
      <DDText
        variant={emphasis ? "bodyStrong" : "body"}
        tone={tone === "muted" ? "muted" : "default"}
      >
        {label}
      </DDText>
      <DDText
        variant={emphasis ? "h3" : "bodyStrong"}
        tone={tone === "success" ? "success" : "default"}
      >
        {value}
      </DDText>
    </View>
  );
}
