import { Shield } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDText } from "../ui/Text";

export interface BookingProtectionBadgeProps {
  protectionType: "none" | "fixed" | "percentage";
  protectionValue: number | null;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function BookingProtectionBadge({
  protectionType,
  protectionValue,
  size = "md",
  showIcon = true,
}: BookingProtectionBadgeProps) {
  const { theme } = useDD();

  const getDisplayText = () => {
    if (protectionType === "none") {
      return "No deposit required";
    }
    if (protectionType === "fixed" && protectionValue) {
      const pounds = (protectionValue / 100).toFixed(2);
      return `£${pounds} deposit required`;
    }
    if (protectionType === "percentage" && protectionValue) {
      return `${protectionValue}% deposit required`;
    }
    return "Deposit required";
  };

  const getTone = () => {
    return protectionType === "none" ? "success" : "brand";
  };

  const tone = getTone();
  const textVariant = size === "sm" ? "micro" : "caption";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
      }}
    >
      {showIcon && (
        <Shield
          size={iconSize}
          color={tone === "success" ? theme.colors.success : theme.colors.brand}
        />
      )}
      <DDText
        variant={textVariant}
        tone={tone === "success" ? "success" : "brand"}
        weight="600"
      >
        {getDisplayText()}
      </DDText>
    </View>
  );
}
