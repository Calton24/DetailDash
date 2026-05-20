import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MapPin, Navigation, Shield } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDButton } from "../ui/Button";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function LocationScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAllow = () => {
    setLoading(true);
    setTimeout(() => {
      router.replace("/(customer)/(tabs)/home");
    }, 700);
  };

  const handleSkip = () => {
    router.replace("/(customer)/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <LinearGradient
        colors={[
          theme.mode === "dark"
            ? "rgba(59,130,246,0.18)"
            : "rgba(59,130,246,0.08)",
          "transparent",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <LinearGradient
              colors={[palette.brandSoft, palette.brand]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBg}
            >
              <Navigation color="#fff" size={36} strokeWidth={2.4} />
            </LinearGradient>
          </View>

          <DDText
            variant="h1"
            align="center"
            style={{ marginTop: spacing.xxxl }}
          >
            Find detailers near you
          </DDText>
          <DDText
            variant="body"
            tone="muted"
            align="center"
            style={{ marginTop: spacing.md, paddingHorizontal: spacing.lg }}
          >
            We use your location to show trusted, top-rated mobile detailers who
            can come to you.
          </DDText>

          <View
            style={{ marginTop: spacing.xxxl, gap: spacing.md, width: "100%" }}
          >
            <Surface variant="elevated" padding="lg" style={styles.bullet}>
              <View
                style={[
                  styles.bulletIcon,
                  { backgroundColor: theme.colors.brandSoft + "33" },
                ]}
              >
                <MapPin color={theme.colors.brand} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <DDText variant="bodyStrong">Accurate distance & ETAs</DDText>
                <DDText variant="caption" tone="muted">
                  See real-time arrival estimates from each detailer.
                </DDText>
              </View>
            </Surface>
            <Surface variant="elevated" padding="lg" style={styles.bullet}>
              <View
                style={[
                  styles.bulletIcon,
                  { backgroundColor: "rgba(16,185,129,0.16)" },
                ]}
              >
                <Shield color={theme.colors.success} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <DDText variant="bodyStrong">Used only for booking</DDText>
                <DDText variant="caption" tone="muted">
                  Never shared with third parties. You can revoke any time.
                </DDText>
              </View>
            </Surface>
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ gap: spacing.sm }}>
            <DDButton
              label="Allow location"
              loading={loading}
              fullWidth
              onPress={handleAllow}
            />
            <DDButton
              label="Not now"
              variant="ghost"
              fullWidth
              onPress={handleSkip}
              haptic={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.lg,
  },
  iconWrap: { alignItems: "center" },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.brand,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 22,
  },
  bullet: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  bulletIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});
