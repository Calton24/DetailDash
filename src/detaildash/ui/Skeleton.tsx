import React, { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { radii } from "../theme/tokens";
import { useDD } from "../theme/useDD";

export interface SkeletonProps {
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  radius?: keyof typeof radii;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  radius = "sm",
  style,
}: SkeletonProps) {
  const { theme } = useDD();
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.skeleton,
          borderRadius: radii[radius],
        },
        animated,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const { theme } = useDD();
  return (
    <View
      style={{
        padding: 16,
        borderRadius: radii.lg,
        backgroundColor: theme.colors.surface,
        gap: 12,
      }}
    >
      <Skeleton height={140} radius="md" />
      <Skeleton height={18} width="65%" />
      <Skeleton height={14} width="40%" />
    </View>
  );
}
