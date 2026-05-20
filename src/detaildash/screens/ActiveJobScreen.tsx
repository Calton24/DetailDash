import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Camera,
    Car,
    CheckCircle2,
    ChevronRight,
    MapPin,
    MessageSquare,
    Navigation,
    Phone,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { bookingsApi } from "../../utils/api";
import { ScreenHeader } from "../components/ScreenHeader";
import { mapBooking, mapBookingRequest } from "../data/mappers";
import { formatCents } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Booking, BookingRequest } from "../types";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ErrorState } from "../ui/ErrorState";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

type Step = "enRoute" | "arrived" | "inProgress" | "complete";
const STEPS: { id: Step; label: string }[] = [
  { id: "enRoute", label: "On the way" },
  { id: "arrived", label: "Arrived" },
  { id: "inProgress", label: "Detailing" },
  { id: "complete", label: "Complete" },
];

export default function ActiveJobScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Booking | BookingRequest | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [step, setStep] = useState<Step>("enRoute");

  const load = useCallback(async () => {
    try {
      const data = await bookingsApi.getBooking(params.id);
      if (!data) {
        setState("error");
        return;
      }
      // Map based on booking status
      const mapped =
        data.status === "pending"
          ? mapBookingRequest(data, data.detailer, data.service)
          : mapBooking(data, data.detailer, data.service);
      setJob(mapped);
      setState("ready");
    } catch (error) {
      console.error("Failed to load active job:", error);
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
        <ScreenHeader title="Active job" />
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Skeleton height={160} radius="lg" />
          <Skeleton height={200} radius="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (state === "error" || !job) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Active job" />
        <ErrorState title="Job not found" onRetry={load} />
      </SafeAreaView>
    );
  }

  const customerName = "customerName" in job ? job.customerName : "Customer";
  const customerInitials =
    "customerInitials" in job ? job.customerInitials : "C";

  const advance = () => {
    if (step === "enRoute") setStep("arrived");
    else if (step === "arrived") setStep("inProgress");
    else if (step === "inProgress") setStep("complete");
    else router.replace("/(detailer)/dashboard");
  };

  const ctaLabel = {
    enRoute: "Mark arrived",
    arrived: "Start job",
    inProgress: "Complete job",
    complete: "Finish & return",
  }[step];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader
        title="Active job"
        subtitle={`#${(job.id ?? "").toUpperCase()}`}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 180,
          gap: spacing.xl,
        }}
      >
        {/* Map placeholder */}
        <Surface
          variant="muted"
          radius="lg"
          padding="none"
          style={{
            height: 180,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.colors.stroke,
          }}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1581090700227-1e8a3a6c8b34?w=1200&q=80",
            }}
            style={{ flex: 1, opacity: 0.55 }}
            contentFit="cover"
          />
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          >
            <Navigation size={18} color="#fff" />
            <DDText style={{ color: "#fff", flex: 1 }} numberOfLines={1}>
              {job.address}
            </DDText>
            <Chip label="12 min" tone="brand" size="sm" />
          </View>
        </Surface>

        {/* Progress stepper */}
        <View>
          <DDText
            variant="micro"
            tone="subtle"
            style={{ marginBottom: spacing.sm }}
          >
            JOB PROGRESS
          </DDText>
          <Surface
            variant="elevated"
            padding="lg"
            radius="lg"
            style={{ gap: spacing.md }}
          >
            {STEPS.map((s, idx) => {
              const currentIdx = STEPS.findIndex((x) => x.id === step);
              const done = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <View
                  key={s.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: done
                        ? theme.colors.success
                        : isCurrent
                          ? theme.colors.brand
                          : theme.colors.surfaceAlt,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={16} color="#fff" />
                    ) : (
                      <DDText
                        variant="micro"
                        style={{
                          color: isCurrent
                            ? theme.mode === "dark"
                              ? "#000"
                              : "#fff"
                            : theme.colors.textSubtle,
                        }}
                      >
                        {idx + 1}
                      </DDText>
                    )}
                  </View>
                  <DDText
                    variant={isCurrent ? "bodyStrong" : "body"}
                    tone={isCurrent ? "default" : done ? "default" : "muted"}
                  >
                    {s.label}
                  </DDText>
                </View>
              );
            })}
          </Surface>
        </View>

        {/* Customer card */}
        <Surface variant="elevated" padding="lg" radius="lg">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.surfaceAlt,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DDText variant="bodyStrong">{customerInitials}</DDText>
            </View>
            <View style={{ flex: 1 }}>
              <DDText variant="bodyStrong">{customerName}</DDText>
              <DDText variant="caption" tone="muted">
                {job.serviceName}
              </DDText>
            </View>
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
              size="sm"
              variant="secondary"
              style={FeatureFlags.SHOW_MESSAGING ? { flex: 1 } : undefined}
              leftIcon={<Phone size={14} color={theme.colors.text} />}
            />
            {FeatureFlags.SHOW_MESSAGING && (
              <DDButton
                label="Message"
                size="sm"
                variant="secondary"
                style={{ flex: 1 }}
                leftIcon={<MessageSquare size={14} color={theme.colors.text} />}
              />
            )}
          </View>
        </Surface>

        {/* Job actions - hidden for MVP */}
        {FeatureFlags.SHOW_BEFORE_AFTER_PHOTOS && (
          <View>
            <Pressable>
              <Surface
                variant="muted"
                padding="lg"
                radius="lg"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Camera size={18} color={theme.colors.brand} />
                <View style={{ flex: 1 }}>
                  <DDText variant="bodyStrong">Add before/after photos</DDText>
                  <DDText variant="caption" tone="muted">
                    Customers love seeing the result
                  </DDText>
                </View>
                <ChevronRight size={16} color={theme.colors.textMuted} />
              </Surface>
            </Pressable>
          </View>
        )}

        {/* Vehicle & payout */}
        <Surface
          variant="elevated"
          padding="lg"
          radius="lg"
          style={{ gap: spacing.sm }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Car size={16} color={theme.colors.brand} />
            <DDText variant="bodyStrong">
              {(job.vehicleType ?? "Vehicle").toUpperCase()} ·{" "}
              {job.vehicleRegistration ?? "Reg not provided"}
            </DDText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <MapPin size={16} color={theme.colors.brand} />
            <DDText style={{ flex: 1 }} numberOfLines={1}>
              {job.address}
            </DDText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: theme.colors.stroke,
            }}
          >
            <DDText tone="muted">Payout</DDText>
            <DDText variant="h3" tone="success">
              {formatCents(Math.round(job.priceCents * 0.92))}
            </DDText>
          </View>
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
        <View style={{ padding: spacing.lg, backgroundColor: theme.colors.bg }}>
          <DDButton label={ctaLabel} fullWidth onPress={advance} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Keep radii import used
void radii;
