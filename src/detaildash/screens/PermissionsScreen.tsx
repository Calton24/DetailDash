import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Bell, MapPin, Navigation, Shield } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDButton } from "../ui/Button";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function PermissionsScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);

    try {
      // Request notification permissions
      if (Platform.OS !== "web") {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus === "granted") {
          console.log("Notification permissions granted");
          // Configure notification handler
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
              shouldShowBanner: true,
              shouldShowList: true,
            }),
          });
        }
      }

      // TODO: Request location permissions when needed
      // For MVP, we'll just skip to home screen

      setTimeout(() => {
        router.replace("/(customer)/(tabs)/home");
      }, 700);
    } catch (error) {
      console.error("Failed to request permissions:", error);
      // Continue anyway
      router.replace("/(customer)/(tabs)/home");
    } finally {
      setLoading(false);
    }
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
            Stay connected
          </DDText>
          <DDText
            variant="body"
            tone="muted"
            align="center"
            style={{ marginTop: spacing.md, paddingHorizontal: spacing.lg }}
          >
            Get real-time updates about your bookings and find detailers near
            you.
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
                <Bell color={theme.colors.brand} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <DDText variant="bodyStrong">Instant booking updates</DDText>
                <DDText variant="caption" tone="muted">
                  Know immediately when your detailer accepts, arrives, or
                  completes your job.
                </DDText>
              </View>
            </Surface>

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
                <DDText variant="bodyStrong">Find nearby detailers</DDText>
                <DDText variant="caption" tone="muted">
                  See accurate distances and estimated arrival times.
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
                <DDText variant="bodyStrong">Privacy-first approach</DDText>
                <DDText variant="caption" tone="muted">
                  Used only for booking. Never shared with third parties. Revoke
                  anytime.
                </DDText>
              </View>
            </Surface>
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ gap: spacing.sm }}>
            <DDButton
              label="Allow notifications & location"
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
