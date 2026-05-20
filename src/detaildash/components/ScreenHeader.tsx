import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDText } from "../ui/Text";

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  right,
  onBack,
}: ScreenHeaderProps) {
  const router = useRouter();
  const { theme } = useDD();

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        gap: spacing.md,
      }}
    >
      {showBack ? (
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.surfaceAlt,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <ChevronLeft size={22} color={theme.colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        {title ? <DDText variant="h3">{title}</DDText> : null}
        {subtitle ? (
          <DDText variant="caption" tone="muted">
            {subtitle}
          </DDText>
        ) : null}
      </View>
      {right}
    </View>
  );
}
