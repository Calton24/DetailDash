import { useRouter } from "expo-router";
import { Check, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookingProtectionBadge } from "../components/BookingProtectionBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import { bookingDraftStore, useBookingDraft } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { DetailerService } from "../types";
import { DDButton } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function ServiceSelectScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const draft = useBookingDraft();
  const [selectedId, setSelectedId] = useState<string | null>(
    draft.service?.id ?? null
  );

  if (!draft.detailer) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Choose a service" />
        <EmptyState
          title="No detailer selected"
          message="Pick a detailer first to see their services."
          actionLabel="Back to home"
          onAction={() => router.replace("/(customer)/(tabs)/home")}
        />
      </SafeAreaView>
    );
  }

  const services = draft.detailer.services;
  const selected = services.find((s) => s.id === selectedId);

  const handleContinue = () => {
    if (!selected) return;
    bookingDraftStore.set({ service: selected });
    router.push("/booking/details");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader title="Choose a service" subtitle={draft.detailer.name} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* Booking Protection Info */}
        <Surface
          variant="muted"
          padding="md"
          radius="lg"
          style={{ marginBottom: spacing.lg }}
        >
          <BookingProtectionBadge
            protectionType={draft.detailer.bookingProtectionType}
            protectionValue={draft.detailer.bookingProtectionValue}
            size="sm"
          />
        </Surface>

        <View style={{ gap: spacing.md }}>
          {services.map((s) => {
            const isSel = selectedId === s.id;
            return (
              <Pressable key={s.id} onPress={() => setSelectedId(s.id)}>
                <Surface
                  variant={isSel ? "elevated" : "flat"}
                  radius="lg"
                  padding="lg"
                  style={{
                    borderWidth: 1.5,
                    borderColor: isSel
                      ? theme.colors.brand
                      : theme.colors.stroke,
                  }}
                >
                  <ServiceRow service={s} selected={isSel} />
                </Surface>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <SafeAreaView
        edges={["bottom"]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ padding: spacing.lg }}>
          <DDButton
            label={
              selected
                ? `Continue · $${selected.priceFrom}`
                : "Select a service"
            }
            disabled={!selected}
            fullWidth
            onPress={handleContinue}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function ServiceRow({
  service,
  selected,
}: {
  service: DetailerService;
  selected: boolean;
}) {
  const { theme } = useDD();
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: selected
            ? theme.colors.brand
            : theme.colors.strokeStrong,
          backgroundColor: selected ? theme.colors.brand : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <Check size={14} color={theme.mode === "dark" ? "#000" : "#fff"} />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <DDText variant="bodyStrong">{service.name}</DDText>
        <DDText variant="caption" tone="muted" style={{ marginTop: 2 }}>
          {service.description}
        </DDText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: spacing.sm,
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: radii.pill,
            alignSelf: "flex-start",
          }}
        >
          <Clock size={11} color={theme.colors.textSubtle} />
          <DDText variant="micro" tone="muted">
            {Math.floor(service.estimatedMinutes / 60)}h{" "}
            {service.estimatedMinutes % 60}m
          </DDText>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <DDText variant="caption" tone="subtle">
          From
        </DDText>
        <DDText variant="h3" tone="brand">
          ${service.priceFrom}
        </DDText>
      </View>
    </View>
  );
}
