import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CheckCircle2, MapPin, Star } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { FeatureFlags } from "../../../config/features";
import { radii, shadows, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Detailer } from "../types";
import { Chip } from "../ui/Chip";
import { DDText } from "../ui/Text";

export interface DetailerCardProps {
  detailer: Detailer;
  variant?: "feature" | "list";
}

export function DetailerCard({
  detailer,
  variant = "list",
}: DetailerCardProps) {
  const { theme } = useDD();
  const router = useRouter();

  const onPress = () => {
    Haptics.selectionAsync().catch(() => undefined);
    router.push(`/detailer/${detailer.id}`);
  };

  if (variant === "feature") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            width: 280,
            borderRadius: radii.xl,
            overflow: "hidden",
            backgroundColor: theme.colors.surface,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          shadows.md,
        ]}
      >
        <View style={{ height: 180 }}>
          <Image
            source={{ uri: detailer.heroImage }}
            style={{ flex: 1 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 100,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              flexDirection: "row",
              gap: 6,
            }}
          >
            {detailer.badges.includes("topRated") && (
              <Chip label="Top rated" tone="brand" size="sm" />
            )}
            {detailer.badges.includes("ecoFriendly") && (
              <Chip label="Eco" tone="success" size="sm" />
            )}
          </View>
          <View
            style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}
          >
            <DDText variant="h3" style={{ color: "#fff" }}>
              {detailer.name}
            </DDText>
            <DDText
              variant="caption"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {detailer.tagline}
            </DDText>
          </View>
        </View>
        <View
          style={{
            padding: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Star
              size={14}
              color={theme.colors.warning}
              fill={theme.colors.warning}
            />
            <DDText variant="bodyStrong">{detailer.rating.toFixed(2)}</DDText>
            {FeatureFlags.SHOW_REVIEWS_COUNT && (
              <DDText variant="caption" tone="muted">
                · {detailer.reviewsCount}
              </DDText>
            )}
          </View>
          <DDText variant="bodyStrong">
            From{" "}
            <DDText tone="brand" weight="700">
              ${detailer.priceFrom}
            </DDText>
          </DDText>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          backgroundColor: theme.colors.surface,
          borderRadius: radii.lg,
          padding: spacing.md,
          gap: spacing.md,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          borderWidth: 1,
          borderColor: theme.colors.stroke,
        },
      ]}
    >
      <View
        style={{
          width: 92,
          height: 92,
          borderRadius: radii.md,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: detailer.heroImage }}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <DDText variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
              {detailer.name}
            </DDText>
            {detailer.badges.includes("verified") && (
              <CheckCircle2 size={14} color={theme.colors.brand} />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 2,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <Star
                size={12}
                color={theme.colors.warning}
                fill={theme.colors.warning}
              />
              <DDText variant="caption" tone="muted">
                {detailer.rating.toFixed(2)}
                {FeatureFlags.SHOW_REVIEWS_COUNT &&
                  ` (${detailer.reviewsCount})`}
              </DDText>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <MapPin size={12} color={theme.colors.textSubtle} />
              <DDText variant="caption" tone="muted">
                {detailer.distanceKm} km
              </DDText>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <DDText variant="caption" tone="subtle">
              From
            </DDText>
            <DDText variant="bodyStrong" tone="brand">
              ${detailer.priceFrom}
            </DDText>
          </View>
          <Chip
            label={detailer.available ? detailer.nextSlot : "Booked"}
            tone={detailer.available ? "success" : "warning"}
            size="sm"
          />
        </View>
      </View>
    </Pressable>
  );
}
