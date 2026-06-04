import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Calendar,
    Check,
    Clock,
    Info,
    MapPin,
    Phone,
    X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { bookingsApi } from "../../utils/api";
import { PriceRow } from "../components/PriceRow";
import { ScreenHeader } from "../components/ScreenHeader";
import { mapBookingRequest } from "../data/mappers";
import { formatCents } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { BookingRequest } from "../types";
import { Avatar } from "../ui/Avatar";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ErrorState } from "../ui/ErrorState";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function BookingRequestScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const [req, setReq] = useState<BookingRequest | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const load = useCallback(async () => {
    try {
      const data = await bookingsApi.getBooking(params.id);
      if (!data) {
        setState("error");
        return;
      }
      const mapped = mapBookingRequest(data, data.detailer, data.service);
      setReq(mapped);
      setState("ready");
    } catch (error) {
      console.error("Failed to load booking request:", error);
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
        <ScreenHeader title="Request" />
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Skeleton height={120} radius="lg" />
          <Skeleton height={180} radius="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (state === "error" || !req) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Request" />
        <ErrorState title="Request not found" onRetry={load} />
      </SafeAreaView>
    );
  }

  const d = new Date(req.scheduledFor);
  const when = d.toLocaleString("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader
        title="Booking request"
        subtitle={`#${(req.id ?? "").toUpperCase()}`}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 180,
          gap: spacing.xl,
        }}
      >
        {/* Customer */}
        <Surface variant="elevated" padding="lg" radius="lg">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Avatar initials={req.customerInitials} size={56} />
            <View style={{ flex: 1 }}>
              <DDText variant="h3">{req.customerName}</DDText>
              <DDText variant="caption" tone="muted">
                New customer
              </DDText>
            </View>
            <Chip
              label={
                req.paymentStatus === "authorized"
                  ? "Authorized"
                  : "Deposit held"
              }
              tone="success"
              size="sm"
            />
          </View>
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
              style={{ flex: 1 }}
              leftIcon={<Phone size={14} color={theme.colors.text} />}
            />
          </View>
        </Surface>

        {/* Job details */}
        <Surface
          variant="elevated"
          padding="lg"
          radius="lg"
          style={{ gap: spacing.md }}
        >
          <DDText variant="bodyStrong">{req.serviceName}</DDText>
          <Row
            icon={<Calendar size={16} color={theme.colors.brand} />}
            label="When"
            value={when}
          />
          <Row
            icon={<MapPin size={16} color={theme.colors.brand} />}
            label="Where"
            value={req.address ?? "Address not provided"}
          />
          <Row
            icon={<Clock size={16} color={theme.colors.brand} />}
            label="Vehicle"
            value={`${(req.vehicleType ?? "Vehicle").toUpperCase()} · ${req.vehicleRegistration ?? "Reg not provided"}`}
          />
        </Surface>

        {req.notes ? (
          <Surface
            variant="muted"
            padding="lg"
            radius="lg"
            style={{ flexDirection: "row", gap: spacing.md }}
          >
            <Info size={18} color={theme.colors.brand} />
            <View style={{ flex: 1 }}>
              <DDText variant="bodyStrong">Customer notes</DDText>
              <DDText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                {req.notes}
              </DDText>
            </View>
          </Surface>
        ) : null}

        {/* Payout */}
        <Surface variant="elevated" padding="lg" radius="lg">
          <DDText
            variant="micro"
            tone="subtle"
            style={{ marginBottom: spacing.xs }}
          >
            YOUR PAYOUT
          </DDText>
          <PriceRow
            label="Total"
            value={formatCents(req.priceCents)}
            emphasis
          />
          <PriceRow
            label="Service fee (8%)"
            value={`-${formatCents(Math.round(req.priceCents * 0.08))}`}
            tone="muted"
          />
          <PriceRow
            label="You receive"
            value={formatCents(Math.round(req.priceCents * 0.92))}
            tone="success"
            emphasis
          />
        </Surface>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 88 + insets.bottom,
        }}
      >
        <View
          style={{
            padding: spacing.lg,
            flexDirection: "row",
            gap: spacing.sm,
            backgroundColor: theme.colors.bg,
          }}
        >
          <DDButton
            label="Decline"
            variant="ghost"
            style={{ flex: 1 }}
            leftIcon={<X size={16} color={theme.colors.brand} />}
            onPress={() => router.back()}
          />
          <DDButton
            label="Accept job"
            style={{ flex: 1.4 }}
            leftIcon={<Check size={16} color="#fff" />}
            onPress={() => router.replace(`/(detailer)/job/${req.id}`)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({
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
          width: 34,
          height: 34,
          borderRadius: radii.sm,
          backgroundColor: theme.colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <DDText variant="micro" tone="subtle">
          {(label ?? "").toUpperCase()}
        </DDText>
        <DDText variant="bodyStrong">{value ?? ""}</DDText>
      </View>
    </View>
  );
}
