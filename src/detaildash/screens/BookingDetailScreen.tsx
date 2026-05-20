import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Calendar,
    Car,
    Clock,
    MapPin,
    MessageSquare,
    Navigation,
    Phone,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { bookingsApi } from "../../utils/api";
import { getCurrentUser } from "../../utils/auth";
import { PriceRow } from "../components/PriceRow";
import { ScreenHeader } from "../components/ScreenHeader";
import { mapBooking } from "../data/mappers";
import { formatCents } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Booking, BookingStatus } from "../types";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

const STATUS_TONE: Record<
  BookingStatus,
  "success" | "brand" | "warning" | "danger"
> = {
  pending: "warning",
  confirmed: "brand",
  enRoute: "brand",
  active: "success",
  completed: "success",
  cancelled: "danger",
};

export default function BookingDetailScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    if (!params.id) {
      console.log("[BookingDetailScreen] No booking ID provided");
      return;
    }
    console.log("[BookingDetailScreen] Loading booking:", params.id);
    try {
      const data = await bookingsApi.getBooking(params.id);
      console.log("[BookingDetailScreen] Booking data received:", data);
      if (!data) {
        console.log("[BookingDetailScreen] No booking returned from API");
        setState("error");
        return;
      }
      // Map Supabase booking to UI booking type
      const mapped = mapBooking(data, data.detailer, data.service);
      console.log("[BookingDetailScreen] Mapped booking:", mapped);
      setBooking(mapped);
      setState("ready");
    } catch (error) {
      console.error("[BookingDetailScreen] Error loading booking:", error);
      setState("error");
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === "loading") {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Booking" />
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Skeleton height={140} radius="lg" />
          <Skeleton height={120} radius="lg" />
          <Skeleton height={180} radius="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (state === "error" || !booking) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Booking" />
        <ErrorState
          title="Booking not found"
          message="This booking may have been deleted or you don't have access."
          onRetry={load}
        />
      </SafeAreaView>
    );
  }

  const d = new Date(booking.scheduledFor);
  const dateStr = d.toLocaleDateString("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeStr = d.toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  });
  const isUpcoming =
    booking.status !== "completed" && booking.status !== "cancelled";

  const handleCancel = async () => {
    if (!booking || cancelling) return;
    try {
      setCancelling(true);

      // Get current authenticated user
      const user = await getCurrentUser();
      if (!user) {
        alert("Please sign in to cancel this booking.");
        setCancelling(false);
        return;
      }

      await bookingsApi.cancelBooking(booking.id, user.id);
      // Refresh booking data
      await load();
      // Show success feedback
      alert("Booking cancelled successfully. The detailer has been notified.");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader
        title="Booking details"
        subtitle={`#${(booking.id ?? "").toUpperCase().slice(0, 10)}`}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: 140,
          gap: spacing.xl,
        }}
      >
        {/* Detailer card */}
        <Surface variant="elevated" radius="lg" padding="lg">
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: booking.detailerImage }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <DDText variant="bodyStrong">{booking.detailerName}</DDText>
              <DDText variant="caption" tone="muted">
                {booking.serviceName}
              </DDText>
            </View>
            <Chip
              label={booking.status === "enRoute" ? "En route" : booking.status}
              tone={STATUS_TONE[booking.status]}
              size="sm"
            />
          </View>
          {isUpcoming ? (
            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                marginTop: spacing.md,
              }}
            >
              <DDButton
                label="Call"
                size="md"
                variant="secondary"
                style={FeatureFlags.SHOW_MESSAGING ? { flex: 1 } : undefined}
                leftIcon={<Phone size={14} color={theme.colors.text} />}
              />
              {FeatureFlags.SHOW_MESSAGING && (
                <DDButton
                  label="Message"
                  size="md"
                  variant="secondary"
                  style={{ flex: 1 }}
                  leftIcon={
                    <MessageSquare size={14} color={theme.colors.text} />
                  }
                />
              )}
            </View>
          ) : null}
        </Surface>

        {/* When & where */}
        <View>
          <SectionHeader title="When & where" />
          <Surface
            variant="elevated"
            padding="lg"
            radius="lg"
            style={{ gap: spacing.md }}
          >
            <DetailRow
              icon={<Calendar size={16} color={theme.colors.brand} />}
              label="Date"
              value={dateStr}
            />
            <DetailRow
              icon={<Clock size={16} color={theme.colors.brand} />}
              label="Time"
              value={timeStr}
            />
            <DetailRow
              icon={<MapPin size={16} color={theme.colors.brand} />}
              label="Address"
              value={booking.address}
            />
            <DetailRow
              icon={<Car size={16} color={theme.colors.brand} />}
              label="Vehicle"
              value={`${booking.vehicleType ?? "Vehicle"} · ${booking.vehicleRegistration ?? "Reg not provided"}`}
            />
          </Surface>
          {isUpcoming ? (
            <DDButton
              label="Get directions"
              size="md"
              variant="ghost"
              fullWidth
              style={{ marginTop: spacing.sm }}
              leftIcon={<Navigation size={14} color={theme.colors.brand} />}
            />
          ) : null}
        </View>

        {booking.notes ? (
          <View>
            <SectionHeader title="Notes" />
            <Surface variant="elevated" padding="lg" radius="lg">
              <DDText>{booking.notes}</DDText>
            </Surface>
          </View>
        ) : null}

        {/* Pricing */}
        <View>
          <SectionHeader title="Payment" />
          <Surface variant="elevated" padding="lg" radius="lg">
            <PriceRow
              label="Total"
              value={formatCents(booking.priceCents)}
              emphasis
            />
            <PriceRow
              label="Deposit paid"
              value={formatCents(booking.depositCents)}
              tone="success"
            />
            <PriceRow
              label="Balance due"
              value={formatCents(booking.priceCents - booking.depositCents)}
              tone="muted"
            />
          </Surface>
        </View>
      </ScrollView>

      {isUpcoming ? (
        <SafeAreaView
          edges={["bottom"]}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
        >
          <View style={{ padding: spacing.lg }}>
            <DDButton
              label={cancelling ? "Cancelling..." : "Cancel booking"}
              variant="ghost"
              fullWidth
              loading={cancelling}
              onPress={handleCancel}
            />
          </View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const { theme } = useDD();
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radii.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surfaceAlt,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <DDText variant="caption" tone="subtle">
          {label}
        </DDText>
        <DDText variant="bodyStrong">{value}</DDText>
      </View>
    </View>
  );
}
