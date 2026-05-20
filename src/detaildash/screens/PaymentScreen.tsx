import { useRouter } from "expo-router";
import { Apple, CreditCard, Lock, ShieldCheck } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { requireTestDetailer } from "../../config/dev";
import { bookingsApi } from "../../utils/api";
import { getCurrentUser, signInWithApple } from "../../utils/auth";
import { PriceRow } from "../components/PriceRow";
import { ScreenHeader } from "../components/ScreenHeader";
import {
    bookingDraftStore,
    formatCents,
    getEstimatedTotalCents,
    useBookingDraft,
} from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDButton } from "../ui/Button";
import { ErrorState } from "../ui/ErrorState";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

type PayMethod = "apple" | "card";

export default function PaymentScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const draft = useBookingDraft();
  const [method, setMethod] = useState<PayMethod>(
    Platform.OS === "ios" ? "apple" : "card"
  );
  const [submitting, setSubmitting] = useState(false);

  if (!draft.detailer || !draft.service || !draft.vehicleType) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <ScreenHeader title="Payment" />
        <ErrorState
          title="Booking incomplete"
          message="Please complete the previous steps to continue."
          onRetry={() => router.replace("/(customer)/(tabs)/home")}
        />
      </SafeAreaView>
    );
  }

  const totals = getEstimatedTotalCents(draft);

  const handleConfirm = async () => {
    if (!draft.detailer || !draft.service || !draft.vehicleType) return;
    setSubmitting(true);
    try {
      // Check if user is authenticated
      let user = await getCurrentUser();

      // If not authenticated, trigger Apple Sign In
      if (!user) {
        console.log("No authenticated user, triggering Apple Sign In...");
        try {
          user = await signInWithApple();
          console.log("Apple Sign In successful, user:", user.id);
        } catch (signInError) {
          console.error("Apple Sign In failed:", signInError);
          setSubmitting(false);
          // User cancelled or error occurred
          if (
            signInError instanceof Error &&
            signInError.message.includes("cancelled")
          ) {
            // User cancelled - silent return, no alert needed
            return;
          }
          // Other sign in errors
          Alert.alert(
            "Sign In Required",
            "Please sign in with Apple to create a booking.",
            [{ text: "OK" }]
          );
          return;
        }
      }

      // Now we have an authenticated user
      const customerId = user.id;
      // TODO: For MVP, all bookings go to test detailer. In production, use draft.detailer.id
      const detailerId = requireTestDetailer();

      console.log("Creating booking with customer:", customerId);

      // Create booking in Supabase
      const booking = await bookingsApi.createBookingFromDraft({
        customerId,
        detailerId,
        serviceId: draft.service.id,
        vehicleType: draft.vehicleType,
        vehicleRegistration: draft.vehicleRegistration,
        address: draft.address,
        city: draft.detailer.city, // Use detailer's city for now
        scheduledDate: draft.scheduledDate,
        scheduledTime: draft.scheduledTime,
        notes: draft.notes,
        totalPence: totals.totalCents,
        depositPence: totals.depositCents,
      });

      console.log("Booking created successfully:", booking.id);

      // Success: clear draft and navigate to success page
      bookingDraftStore.reset();
      router.replace(`/booking/success?id=${booking.id}`);
    } catch (error) {
      console.error("Failed to create booking:", error);
      setSubmitting(false);
      Alert.alert(
        "Booking Failed",
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader title="Payment" subtitle="Secure checkout" />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140,
          paddingHorizontal: spacing.lg,
          gap: spacing.xl,
        }}
      >
        {/* Summary */}
        <Surface variant="elevated" padding="lg" radius="lg">
          <DDText variant="micro" tone="subtle" style={{ marginBottom: 6 }}>
            BOOKING SUMMARY
          </DDText>
          <DDText variant="h3">{draft.service.name}</DDText>
          <DDText variant="caption" tone="muted" style={{ marginTop: 2 }}>
            with {draft.detailer.name}
          </DDText>
          <View
            style={{
              marginTop: spacing.md,
              paddingTop: spacing.md,
              borderTopWidth: 1,
              borderTopColor: theme.colors.stroke,
              gap: 2,
            }}
          >
            <PriceRow
              label="Vehicle"
              value={`${draft.vehicleType} · ${draft.vehicleRegistration}`}
            />
            <PriceRow label="Address" value={draft.address.slice(0, 32)} />
            <PriceRow
              label="When"
              value={`${draft.scheduledDate} · ${draft.scheduledTime}`}
            />
          </View>
        </Surface>

        {/* Pricing */}
        <View>
          <DDText variant="bodyStrong" style={{ marginBottom: spacing.sm }}>
            Pricing breakdown
          </DDText>
          <Surface variant="elevated" padding="lg" radius="lg">
            <PriceRow
              label="Service"
              value={formatCents(totals.subtotalCents)}
            />
            <PriceRow
              label="Travel fee"
              value={formatCents(totals.travelCents)}
            />
            <PriceRow
              label="Service fee"
              value={formatCents(totals.serviceFeeCents)}
            />
            <View
              style={{
                marginTop: spacing.sm,
                paddingTop: spacing.sm,
                borderTopWidth: 1,
                borderTopColor: theme.colors.stroke,
              }}
            >
              <PriceRow
                label="Total"
                value={formatCents(totals.totalCents)}
                emphasis
              />
              <PriceRow
                label="Deposit due today"
                value={formatCents(totals.depositCents)}
                tone="success"
              />
            </View>
          </Surface>
        </View>

        {/* Payment method */}
        <View>
          <DDText variant="bodyStrong" style={{ marginBottom: spacing.sm }}>
            Payment method
          </DDText>
          <View style={{ gap: spacing.sm }}>
            {Platform.OS === "ios" && (
              <PayOption
                selected={method === "apple"}
                onPress={() => setMethod("apple")}
                icon={<Apple size={20} color={theme.colors.text} />}
                title="Apple Pay"
                subtitle="Use Face ID to pay securely"
              />
            )}
            <PayOption
              selected={method === "card"}
              onPress={() => setMethod("card")}
              icon={<CreditCard size={20} color={theme.colors.text} />}
              title="Card ending 4242"
              subtitle="Visa · Default"
            />
          </View>
        </View>

        {/* Trust */}
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
          <ShieldCheck size={22} color={theme.colors.success} />
          <View style={{ flex: 1 }}>
            <DDText variant="bodyStrong">Protected checkout</DDText>
            <DDText variant="caption" tone="muted">
              Card details encrypted by Stripe. Deposit held until job complete.
            </DDText>
          </View>
        </Surface>
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView
        edges={["bottom"]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          {method === "apple" && Platform.OS === "ios" ? (
            <Pressable
              onPress={handleConfirm}
              disabled={submitting}
              style={({ pressed }) => ({
                height: 54,
                borderRadius: radii.pill,
                backgroundColor: "#000",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: pressed || submitting ? 0.85 : 1,
              })}
            >
              <Apple size={20} color="#fff" />
              <DDText variant="bodyStrong" style={{ color: "#fff" }}>
                Create booking request
              </DDText>
            </Pressable>
          ) : (
            <DDButton
              label="Create booking request"
              fullWidth
              loading={submitting}
              onPress={handleConfirm}
              leftIcon={<Lock size={16} color="#fff" />}
            />
          )}
          <DDText variant="micro" tone="subtle" align="center">
            Creates a pending booking. Payment integration coming next.
          </DDText>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function PayOption({
  selected,
  onPress,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const { theme } = useDD();
  return (
    <Pressable onPress={onPress}>
      <Surface
        variant="elevated"
        radius="lg"
        padding="lg"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          borderWidth: 1.5,
          borderColor: selected ? theme.colors.brand : theme.colors.stroke,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radii.md,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <DDText variant="bodyStrong">{title}</DDText>
          <DDText variant="caption" tone="muted">
            {subtitle}
          </DDText>
        </View>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 1.5,
            borderColor: selected
              ? theme.colors.brand
              : theme.colors.strokeStrong,
            backgroundColor: selected ? theme.colors.brand : "transparent",
          }}
        />
      </Surface>
    </Pressable>
  );
}
