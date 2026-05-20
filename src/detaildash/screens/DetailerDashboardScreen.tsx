import { useRouter } from "expo-router";
import {
    ArrowRight,
    Calendar,
    Check,
    ChevronRight,
    MapPin,
    X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    Switch,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { requireTestDetailer } from "../../config/dev";
import { bookingsApi } from "../../utils/api";
import { mapBookingRequests, mapBookings } from "../data/mappers";
import { formatCents } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Booking, BookingRequest } from "../types";
import { Avatar } from "../ui/Avatar";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton } from "../ui/Skeleton";
import { StatBlock } from "../ui/StatBlock";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function DetailerDashboardScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [available, setAvailable] = useState(true);

  const load = useCallback(async () => {
    try {
      // TODO: Replace with real auth detailer profile once Supabase Auth is wired up
      // This uses a test detailer (Apex Mobile Detail) for MVP development only
      const detailerId = requireTestDetailer();

      const [requestsData, upcomingData] = await Promise.all([
        bookingsApi.getBookingRequests(detailerId),
        bookingsApi.getUpcomingJobs(detailerId),
      ]);

      const mappedRequests = mapBookingRequests(requestsData);
      const mappedUpcoming = mapBookings(upcomingData);

      setRequests(mappedRequests);
      setUpcoming(mappedUpcoming);
      setState("ready");
    } catch (error) {
      console.error("Failed to load detailer bookings:", error);
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: spacing.huge,
          paddingHorizontal: spacing.lg,
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
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: spacing.sm,
          }}
        >
          <View>
            <DDText variant="caption" tone="muted">
              Good morning,
            </DDText>
            <DDText variant="h1">Mike</DDText>
          </View>
          <Pressable onPress={() => router.push("/(detailer)/profile")}>
            <Avatar initials="MK" size={44} />
          </Pressable>
        </View>

        {/* Availability toggle */}
        <Surface
          variant="elevated"
          padding="lg"
          radius="lg"
          style={{
            marginTop: spacing.xl,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            borderWidth: 1,
            borderColor: available ? theme.colors.success : theme.colors.stroke,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: available
                ? theme.colors.success
                : theme.colors.textSubtle,
            }}
          />
          <View style={{ flex: 1 }}>
            <DDText variant="bodyStrong">
              {available ? "Accepting jobs" : "Paused"}
            </DDText>
            <DDText variant="caption" tone="muted">
              {available
                ? "Customers can book you right now"
                : "You won't appear in search results"}
            </DDText>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{
              true: theme.colors.success,
              false: theme.colors.surfaceMuted,
            }}
          />
        </Surface>

        {/* Stats - hidden for MVP */}
        {FeatureFlags.SHOW_EARNINGS_ANALYTICS && (
          <>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginTop: spacing.xl,
              }}
            >
              <StatBlock label="Today" value="$489" delta="+12% vs Mon" />
              <StatBlock label="This week" value="$2,184" delta="+8%" />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginTop: spacing.md,
              }}
            >
              <StatBlock label="Jobs done" value="14" delta="this week" />
              <StatBlock label="Rating" value="4.96" delta="312 reviews" />
            </View>
          </>
        )}

        {/* New requests */}
        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader
            title="New requests"
            subtitle={
              state === "ready"
                ? `${requests.length} waiting on you`
                : undefined
            }
          />
          {state === "loading" ? (
            <View style={{ gap: spacing.md }}>
              <Skeleton height={160} radius="lg" />
              <Skeleton height={160} radius="lg" />
            </View>
          ) : state === "error" ? (
            <ErrorState onRetry={load} />
          ) : requests.length === 0 ? (
            <EmptyState
              title="No pending requests"
              message="When customers book you, they'll show up here."
            />
          ) : (
            <View style={{ gap: spacing.md }}>
              {requests.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onAccept={async () => {
                    try {
                      const detailerId = requireTestDetailer();
                      await bookingsApi.acceptBooking(r.id, detailerId);
                      await load(); // Reload to update UI
                    } catch (error) {
                      console.error("Failed to accept booking:", error);
                      Alert.alert(
                        "Error",
                        "Failed to accept booking. Please try again."
                      );
                    }
                  }}
                  onDecline={async () => {
                    try {
                      const detailerId = requireTestDetailer();
                      await bookingsApi.declineBooking(r.id, detailerId);
                      await load(); // Reload to update UI
                    } catch (error) {
                      console.error("Failed to decline booking:", error);
                      Alert.alert(
                        "Error",
                        "Failed to decline booking. Please try again."
                      );
                    }
                  }}
                  onView={() => router.push(`/(detailer)/request/${r.id}`)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Upcoming jobs */}
        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader
            title="Today's schedule"
            actionLabel="All jobs"
            onAction={() => router.push("/(detailer)/jobs")}
          />
          {state === "loading" ? (
            <Skeleton height={100} radius="lg" />
          ) : upcoming.length === 0 ? (
            <EmptyState
              title="No jobs scheduled"
              message="Accept a request to fill your schedule."
            />
          ) : (
            <View style={{ gap: spacing.md }}>
              {upcoming.slice(0, 3).map((b) => (
                <UpcomingRow
                  key={b.id}
                  booking={b}
                  onPress={() => router.push(`/(detailer)/job/${b.id}`)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RequestCard({
  request,
  onAccept,
  onDecline,
  onView,
}: {
  request: BookingRequest;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
  onView: () => void;
}) {
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { theme } = useDD();
  const d = new Date(request.scheduledFor);
  const when = d.toLocaleString("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Pressable onPress={onView}>
      <Surface variant="elevated" radius="lg" padding="lg" shadow="sm">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Avatar initials={request.customerInitials} size={42} />
          <View style={{ flex: 1 }}>
            <DDText variant="bodyStrong">{request.customerName}</DDText>
            <DDText variant="caption" tone="muted">
              {request.serviceName}
            </DDText>
          </View>
          <Chip
            label={request.paymentStatus === "authorized" ? "Auth" : "Deposit"}
            tone="brand"
            size="sm"
          />
        </View>
        <View
          style={{
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.stroke,
            gap: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Calendar size={12} color={theme.colors.textSubtle} />
            <DDText variant="caption" tone="muted">
              {when}
            </DDText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <MapPin size={12} color={theme.colors.textSubtle} />
            <DDText variant="caption" tone="muted" numberOfLines={1}>
              {request.address}
            </DDText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: spacing.md,
          }}
        >
          <DDText variant="h3">{formatCents(request.priceCents)}</DDText>
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <DDButton
              label="Decline"
              size="sm"
              variant="ghost"
              loading={declining}
              disabled={accepting || declining}
              onPress={async () => {
                setDeclining(true);
                await onDecline();
                setDeclining(false);
              }}
              leftIcon={<X size={14} color={theme.colors.brand} />}
            />
            <DDButton
              label="Accept"
              size="sm"
              loading={accepting}
              disabled={accepting || declining}
              onPress={async () => {
                setAccepting(true);
                await onAccept();
                setAccepting(false);
              }}
              leftIcon={<Check size={14} color="#fff" />}
            />
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

function UpcomingRow({
  booking,
  onPress,
}: {
  booking: Booking;
  onPress: () => void;
}) {
  const { theme } = useDD();
  const d = new Date(booking.scheduledFor);
  const time = d.toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <Pressable onPress={onPress}>
      <Surface variant="elevated" radius="lg" padding="md">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: radii.md,
              backgroundColor: theme.colors.surfaceAlt,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DDText variant="bodyStrong" tone="brand">
              {time.split(" ")[0]}
            </DDText>
            <DDText variant="micro" tone="subtle">
              {time.split(" ")[1] ?? ""}
            </DDText>
          </View>
          <View style={{ flex: 1 }}>
            <DDText variant="bodyStrong">{booking.serviceName}</DDText>
            <DDText variant="caption" tone="muted" numberOfLines={1}>
              {booking.address}
            </DDText>
          </View>
          <ChevronRight size={18} color={theme.colors.textMuted} />
        </View>
      </Surface>
    </Pressable>
  );
}

// Help ts-prune find the imported icon
void ArrowRight;
