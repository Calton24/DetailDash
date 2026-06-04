import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { useDD } from "../theme/useDD";
import { DDText } from "./Text";

export interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: number;
}

export function Avatar({ uri, initials = "?", size = 44 }: AvatarProps) {
  const { theme } = useDD();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
        />
      ) : (
        <DDText variant="bodyStrong" style={{ fontSize: size * 0.4 }}>
          {initials}
        </DDText>
      )}
    </View>
  );
}
