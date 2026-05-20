import * as Haptics from "expo-haptics";
import {
    Droplets,
    Shield,
    Sparkles,
    SprayCan,
    Wrench,
    Zap,
} from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { ServiceCategory } from "../types";
import { DDText } from "../ui/Text";

const ICON_MAP = {
  sparkle: Sparkles,
  spray: SprayCan,
  shield: Shield,
  droplet: Droplets,
  wrench: Wrench,
  zap: Zap,
} as const;

export interface ServiceCategoryTileProps {
  category: ServiceCategory;
  selected?: boolean;
  onPress?: (id: ServiceCategory["id"]) => void;
}

export function ServiceCategoryTile({
  category,
  selected,
  onPress,
}: ServiceCategoryTileProps) {
  const { theme } = useDD();
  const Icon = ICON_MAP[category.icon];

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => undefined);
    onPress?.(category.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          width: 96,
          alignItems: "center",
          gap: spacing.sm,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: radii.lg,
          backgroundColor: selected ? theme.colors.brand : theme.colors.surface,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: selected ? theme.colors.brand : theme.colors.stroke,
        }}
      >
        <Icon
          size={26}
          color={
            selected
              ? theme.mode === "dark"
                ? "#0A0A0B"
                : "#FFFFFF"
              : theme.colors.text
          }
          strokeWidth={2}
        />
      </View>
      <DDText variant="micro" align="center" numberOfLines={1}>
        {category.name}
      </DDText>
    </Pressable>
  );
}
