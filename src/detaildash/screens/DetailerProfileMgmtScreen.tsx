import { useRouter } from "expo-router";
import {
    Camera,
    ChevronRight,
    CreditCard,
    Image as ImageIcon,
    LogOut,
    Settings as SettingsIcon,
    TrendingUp
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { Avatar } from "../ui/Avatar";
import { SectionHeader } from "../ui/SectionHeader";
import { StatBlock } from "../ui/StatBlock";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function DetailerProfileMgmtScreen() {
  const { theme } = useDD();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.huge,
        }}
      >
        <DDText variant="h1" style={{ marginTop: spacing.sm }}>
          Pro profile
        </DDText>

        {/* Profile card */}
        <Surface
          variant="elevated"
          padding="lg"
          radius="lg"
          style={{ marginTop: spacing.xl }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Avatar initials="MK" size={72} />
            <View style={{ flex: 1 }}>
              <DDText variant="h2">Mike K.</DDText>
              <DDText variant="caption" tone="muted">
                Apex Mobile Detail
              </DDText>
            </View>
          </View>
        </Surface>

        {/* Earnings - hidden for MVP */}
        {FeatureFlags.SHOW_EARNINGS_ANALYTICS && (
          <View style={{ marginTop: spacing.xxl }}>
            <SectionHeader title="This month" />
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <StatBlock label="Revenue" value="$8,402" delta="+18% vs last" />
              {FeatureFlags.SHOW_TIPS_ANALYTICS && (
                <StatBlock label="Avg tip" value="$14" delta="86% tipped" />
              )}
            </View>
          </View>
        )}

        {/* Business */}
        <Section title="Business">
          <Row
            icon={<ImageIcon size={18} color={theme.colors.text} />}
            label="Services & pricing"
            hint="Manage your services"
            onPress={() => router.push("/(detailer)/services")}
          />
          <Row
            icon={<Camera size={18} color={theme.colors.text} />}
            label="Gallery & before/after"
            hint="24 photos"
          />
          {FeatureFlags.SHOW_AVAILABILITY_CALENDAR && (
            <Row
              icon={<TrendingUp size={18} color={theme.colors.text} />}
              label="Availability calendar"
            />
          )}
          {FeatureFlags.SHOW_DETAILER_PAYOUTS && (
            <Row
              icon={<CreditCard size={18} color={theme.colors.text} />}
              label="Payouts"
              hint="Daily · Stripe"
            />
          )}
        </Section>

        <Section title="Account">
          <Row
            icon={<SettingsIcon size={18} color={theme.colors.text} />}
            label="Settings"
            onPress={() => router.replace("/(customer)/(tabs)/settings")}
          />
        </Section>

        <View style={{ marginTop: spacing.xxl }}>
          <Pressable onPress={() => router.replace("/(customer)/(tabs)/home")}>
            <Surface
              variant="muted"
              padding="lg"
              radius="lg"
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: spacing.sm,
                alignItems: "center",
              }}
            >
              <LogOut size={16} color={theme.colors.text} />
              <DDText weight="700">Switch to customer mode</DDText>
            </Surface>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        {icon}
        <DDText variant="h3">{value}</DDText>
      </View>
      <DDText variant="micro" tone="subtle">
        {label.toUpperCase()}
      </DDText>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: spacing.xxl }}>
      <DDText
        variant="micro"
        tone="subtle"
        style={{ marginBottom: spacing.sm, paddingHorizontal: spacing.xs }}
      >
        {(title ?? "").toUpperCase()}
      </DDText>
      <Surface variant="elevated" radius="lg" padding="none">
        {children}
      </Surface>
    </View>
  );
}

function Row({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onPress?: () => void;
}) {
  const { theme } = useDD();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          gap: spacing.md,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {icon}
      <DDText style={{ flex: 1 }}>{label}</DDText>
      {hint ? (
        <DDText variant="caption" tone="muted">
          {hint}
        </DDText>
      ) : null}
      <ChevronRight size={16} color={theme.colors.textSubtle} />
    </Pressable>
  );
}

// Keep import alive
void radii;
