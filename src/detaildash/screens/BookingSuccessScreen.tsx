import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { bookingsApi } from "../../utils/api";
import { mapBooking } from "../data/mappers";
import { palette, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Booking } from "../types";
import { DDButton } from "../ui/Button";
import { ErrorState } from "../ui/ErrorState";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function BookingSuccessScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [booking, setBooking] = useState<Booking | null>(null);

  const checkScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const bodyOpacity = useSharedValue(0);

  const load = useCallback(async () => {
    if (!params.id) {
      setState("error");
      return;
    }
    try {
      const data = await bookingsApi.getBooking(params.id);
      const mapped = mapBooking(data, data.detailer, data.service);
      setBooking(mapped);
      setState("ready");
    } catch (error) {
      console.error("Failed to load booking:", error);
      setState("error");
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (state === "ready") {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 140 });
      titleOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
      bodyOpacity.value = withDelay(
        350,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [state, bodyOpacity, checkScale, titleOpacity]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const bodyStyle = useAnimatedStyle(() => ({ opacity: bodyOpacity.value }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <LinearGradient
        colors={[
          theme.mode === "dark"
            ? "rgba(16,185,129,0.18)"
            : "rgba(16,185,129,0.08)",
          "transparent",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {state === "loading" ? (
          <View style={[styles.content, { gap: spacing.lg }]}>
            <Skeleton width={120} height={120} radius="pill" />
            <Skeleton width={200} height={32} radius="md" />
            <Skeleton width="100%" height={80} radius="lg" />
          </View>
        ) : state === "error" ? (
          <View style={styles.content}>
            <ErrorState
              message="Failed to load booking details"
              onRetry={load}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Animated.View style={[styles.checkWrap, checkStyle]}>
              <LinearGradient
                colors={[palette.success, "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkBg}
              >
                <CheckCircle2 size={48} color="#fff" strokeWidth={2.4} />
              </LinearGradient>
            </Animated.View>

            <Animated.View style={titleStyle}>
              <DDText
                variant="display"
                align="center"
                style={{ marginTop: spacing.xl }}
              >
                You're booked!
              </DDText>
            </Animated.View>

            <Animated.View style={[bodyStyle, { width: "100%" }]}>
              <DDText
                variant="body"
                tone="muted"
                align="center"
                style={{ marginTop: spacing.sm, paddingHorizontal: spacing.lg }}
              >
                Your detailer has been notified and will confirm shortly. You'll
                get a push when they're en route.
              </DDText>

              <Surface
                variant="elevated"
                padding="lg"
                radius="lg"
                style={{ marginTop: spacing.xxxl, gap: spacing.sm }}
              >
                <DDText variant="micro" tone="subtle">
                  BOOKING REFERENCE
                </DDText>
                <DDText variant="h3" tone="brand">
                  #{booking?.id.toUpperCase().slice(0, 10) ?? "---"}
                </DDText>
                <DDText variant="caption" tone="muted">
                  Show this to your detailer when they arrive.
                </DDText>
              </Surface>

              {booking && (
                <Surface
                  variant="flat"
                  padding="md"
                  radius="md"
                  style={{ marginTop: spacing.md }}
                >
                  <DDText variant="caption" tone="muted">
                    {booking.serviceName} · {booking.detailerName}
                  </DDText>
                  <DDText
                    variant="caption"
                    tone="subtle"
                    style={{ marginTop: 4 }}
                  >
                    {new Date(booking.scheduledFor).toLocaleDateString("en", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </DDText>
                </Surface>
              )}
            </Animated.View>

            <View style={{ flex: 1 }} />

            <Animated.View
              style={[bodyStyle, { width: "100%", gap: spacing.sm }]}
            >
              <DDButton
                label="View my bookings"
                fullWidth
                onPress={() => router.replace("/(customer)/(tabs)/bookings")}
              />
              <DDButton
                label="Back to home"
                variant="ghost"
                fullWidth
                onPress={() => router.replace("/(customer)/(tabs)/home")}
                haptic={false}
              />
            </Animated.View>
          </View>
        )}
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
    alignItems: "center",
  },
  checkWrap: { alignItems: "center" },
  checkBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.success,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 32,
  },
});
