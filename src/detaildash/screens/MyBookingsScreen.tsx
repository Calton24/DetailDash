import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Calendar, ChevronRight, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bookingsApi } from "../../utils/api";
import { getCurrentUser } from "../../utils/auth";
import { mapBookings } from "../data/mappers";
import { formatCents } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Booking, BookingStatus } from "../types";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

const STATUS_TONE: Record<
  BookingStatus,
  "success" | "brand" | "warning" | "danger" | "default"
> = {
  pending: "warning",
  confirmed: "brand",
  enRoute: "brand",
  active: "success",
  completed: "success",
  cancelled: "danger",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  enRoute: "En route",
  active: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function MyBookingsScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const user = await getCurrentUser();

      // If no authenticated user, show empty state
      if (!user) {
        setBookings([]);
        setState("ready");
        return;
      }

      const data = await bookingsApi.getCustomerBookings(user.id);
      const mapped = mapBookings(data);
      setBookings(mapped);
      setState("ready");
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const upcoming = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <DDText variant="h1">My bookings</DDText>
        <DDText variant="caption" tone="muted" style={{ marginTop: 4 }}>
          Track upcoming details and view past jobs.
        </DDText>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.huge,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand}
          />
        }
      >
        {state === "loading" ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={120} radius="lg" />
            <Skeleton height={120} radius="lg" />
          </View>
        ) : state === "error" ? (
          <ErrorState onRetry={load} />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={28} color={theme.colors.brand} />}
            title="No bookings yet"
            message="Your first detail is one tap away."
            actionLabel="Find a detailer"
            onAction={() => router.replace("/(customer)/(tabs)/home")}
          />
        ) : (
          <>
            <SectionHeader
              title="Upcoming"
              subtitle={`${upcoming.length} booking${upcoming.length === 1 ? "" : "s"}`}
            />
            {upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming bookings"
                message="Book a detailer to see them here."
              />
            ) : (
              <View style={{ gap: spacing.md }}>
                {upcoming.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    onPress={() => router.push(`/booking/${b.id}`)}
                    statusTone={STATUS_TONE[b.status]}
                    statusLabel={STATUS_LABEL[b.status]}
                  />
                ))}
              </View>
            )}

            {past.length > 0 ? (
              <View style={{ marginTop: spacing.xxl }}>
                <SectionHeader title="History" />
                <View style={{ gap: spacing.md }}>
                  {past.map((b) => (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      onPress={() => router.push(`/booking/${b.id}`)}
                      statusTone={STATUS_TONE[b.status]}
                      statusLabel={STATUS_LABEL[b.status]}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BookingRow({
  booking,
  onPress,
  statusTone,
  statusLabel,
}: {
  booking: Booking;
  onPress: () => void;
  statusTone: "success" | "brand" | "warning" | "danger" | "default";
  statusLabel: string;
}) {
  const { theme } = useDD();
  const d = new Date(booking.scheduledFor);
  const when = d.toLocaleDateString("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Pressable onPress={onPress}>
      <Surface variant="elevated" radius="lg" padding="md">
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <Image
            source={{ uri: booking.detailerImage }}
            style={{ width: 72, height: 72, borderRadius: radii.md }}
            contentFit="cover"
          />
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              <DDText variant="bodyStrong" numberOfLines={1}>
                {booking.serviceName}
              </DDText>
              <DDText variant="caption" tone="muted">
                {booking.detailerName}
              </DDText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 6,
                }}
              >
                <Calendar size={12} color={theme.colors.textSubtle} />
                <DDText variant="caption" tone="subtle">
                  {when} · {time}
                </DDText>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip label={statusLabel} tone={statusTone} size="sm" />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <DDText variant="bodyStrong">
                  {formatCents(booking.priceCents)}
                </DDText>
                <ChevronRight size={14} color={theme.colors.textSubtle} />
              </View>
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}
