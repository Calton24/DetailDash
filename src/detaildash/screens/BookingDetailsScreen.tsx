import { useRouter } from "expo-router";
import {
    Calendar,
    Car,
    Clock,
    MapPin,
    MessageSquare,
    Star,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../components/ScreenHeader";
import { VEHICLE_TYPES } from "../data/mock";
import { bookingDraftStore, useBookingDraft } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { VehicleType } from "../types";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

const TIME_SLOTS = [
  "08:00",
  "09:30",
  "11:00",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
];

function nextDays(count: number) {
  const out: { iso: string; label: string; sub: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString("en", { weekday: "short" }),
      sub: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
    });
  }
  return out;
}

export default function BookingDetailsScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const draft = useBookingDraft();

  const [vehicleType, setVehicleType] = useState<VehicleType | null>(
    draft.vehicleType
  );
  const [reg, setReg] = useState(draft.vehicleRegistration);
  const [address, setAddress] = useState(draft.address);
  const [scheduledDate, setScheduledDate] = useState(draft.scheduledDate);
  const [scheduledTime, setScheduledTime] = useState(draft.scheduledTime);
  const [notes, setNotes] = useState(draft.notes);

  const days = nextDays(7);

  // Safety check: require detailer and service
  if (!draft.detailer || !draft.service) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Booking details" />
        <EmptyState
          title="No service selected"
          message="Please select a detailer and service first."
          actionLabel="Back to home"
          onAction={() => router.replace("/(customer)/(tabs)/home")}
        />
      </SafeAreaView>
    );
  }

  const canContinue =
    !!vehicleType &&
    (reg ?? "").trim().length > 1 &&
    (address ?? "").trim().length > 4 &&
    !!scheduledDate &&
    !!scheduledTime;

  const onContinue = () => {
    if (!vehicleType) return;
    bookingDraftStore.set({
      vehicleType,
      vehicleRegistration: (reg ?? "").trim().toUpperCase(),
      address: (address ?? "").trim(),
      scheduledDate,
      scheduledTime,
      notes: (notes ?? "").trim(),
    });
    router.push("/booking/payment");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader title="Booking details" subtitle={draft.service.name} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
          paddingHorizontal: spacing.lg,
          gap: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Booking Summary */}
        <Surface variant="elevated" padding="lg" radius="lg">
          <DDText variant="caption" tone="subtle">
            YOU'RE BOOKING
          </DDText>
          <DDText variant="h3" style={{ marginTop: 4 }}>
            {draft.detailer.name}
          </DDText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <DDText variant="caption" tone="muted">
              {draft.detailer.rating.toFixed(2)} · {draft.detailer.city}
            </DDText>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.stroke,
              marginVertical: spacing.md,
            }}
          />
          <DDText variant="bodyStrong">{draft.service.name}</DDText>
          <DDText variant="caption" tone="muted" style={{ marginTop: 2 }}>
            {draft.service.description}
          </DDText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: spacing.md,
            }}
          >
            <DDText variant="caption" tone="subtle">
              Est. {Math.floor(draft.service.estimatedMinutes / 60)}h{" "}
              {draft.service.estimatedMinutes % 60}m
            </DDText>
            <DDText variant="h3" tone="brand">
              ${draft.service.priceFrom}+
            </DDText>
          </View>
        </Surface>

        {/* Vehicle */}
        <Section
          icon={<Car size={16} color={theme.colors.brand} />}
          title="Vehicle"
        >
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
          >
            {VEHICLE_TYPES.map((v) => (
              <Chip
                key={v.id}
                label={v.label}
                selected={vehicleType === v.id}
                onPress={() => setVehicleType(v.id)}
              />
            ))}
          </View>
          <Input
            placeholder="Registration (e.g. ABC-123)"
            value={reg}
            onChangeText={(t) => setReg(t.toUpperCase())}
            autoCapitalize="characters"
            maxLength={10}
          />
        </Section>

        {/* Address */}
        <Section
          icon={<MapPin size={16} color={theme.colors.brand} />}
          title="Service address"
        >
          <Input
            placeholder="Street address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </Section>

        {/* Date */}
        <Section
          icon={<Calendar size={16} color={theme.colors.brand} />}
          title="Date"
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {days.map((d) => {
              const isSel = d.iso === scheduledDate;
              return (
                <Surface
                  key={d.iso}
                  variant={isSel ? "elevated" : "flat"}
                  radius="lg"
                  padding="md"
                  style={{
                    minWidth: 76,
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderColor: isSel
                      ? theme.colors.brand
                      : theme.colors.stroke,
                  }}
                >
                  <DDText
                    variant="micro"
                    tone={isSel ? "brand" : "muted"}
                    onPress={() => setScheduledDate(d.iso)}
                  >
                    {(d.label ?? "").toUpperCase()}
                  </DDText>
                  <DDText
                    variant="bodyStrong"
                    style={{ marginTop: 4 }}
                    onPress={() => setScheduledDate(d.iso)}
                  >
                    {d.sub}
                  </DDText>
                </Surface>
              );
            })}
          </ScrollView>
        </Section>

        {/* Time */}
        <Section
          icon={<Clock size={16} color={theme.colors.brand} />}
          title="Time"
        >
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
          >
            {TIME_SLOTS.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={scheduledTime === t}
                onPress={() => setScheduledTime(t)}
              />
            ))}
          </View>
        </Section>

        {/* Notes */}
        <Section
          icon={<MessageSquare size={16} color={theme.colors.brand} />}
          title="Notes (optional)"
        >
          <Input
            placeholder="Anything the detailer should know? Gate codes, problem spots, parking…"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ minHeight: 88, textAlignVertical: "top" }}
          />
        </Section>
      </ScrollView>

      <SafeAreaView
        edges={["bottom"]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ padding: spacing.lg }}>
          <DDButton
            label="Continue to payment"
            disabled={!canContinue}
            fullWidth
            onPress={onContinue}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: spacing.md }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}
      >
        {icon}
        <DDText variant="bodyStrong">{title}</DDText>
      </View>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  const { theme } = useDD();
  return (
    <TextInput
      placeholderTextColor={theme.colors.textSubtle}
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderRadius: radii.md,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          fontSize: 15,
          borderWidth: 1,
          borderColor: theme.colors.stroke,
        },
        props.style,
      ]}
    />
  );
}
