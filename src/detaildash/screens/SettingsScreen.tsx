import { useRouter } from "expo-router";
import {
    Bell,
    ChevronRight,
    CreditCard,
    HelpCircle,
    Lock,
    LogOut,
    MapPin,
    Moon,
    Sparkles,
    Star,
    User,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { palette, radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { Avatar } from "../ui/Avatar";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function SettingsScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(theme.mode === "dark");

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
          Settings
        </DDText>

        {/* Profile card */}
        <Surface
          variant="elevated"
          padding="lg"
          radius="lg"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            marginTop: spacing.xl,
          }}
        >
          <Avatar initials="AY" size={56} />
          <View style={{ flex: 1 }}>
            <DDText variant="h3">Alex Yen</DDText>
            <DDText variant="caption" tone="muted">
              alex@detaildash.app
            </DDText>
          </View>
          <Pressable
            onPress={() => router.push("/(customer)/profile")}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: 6,
              borderRadius: radii.pill,
              borderWidth: 1,
              borderColor: theme.colors.stroke,
            }}
          >
            <DDText variant="micro" tone="brand">
              EDIT
            </DDText>
          </Pressable>
        </Surface>

        {/* Switch to detailer */}
        <Pressable onPress={() => router.replace("/(detailer)/dashboard")}>
          <Surface
            variant="elevated"
            radius="lg"
            padding="lg"
            style={{
              marginTop: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.brand,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "rgba(59,130,246,0.16)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} color={palette.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <DDText variant="bodyStrong">Switch to Pro mode</DDText>
              <DDText variant="caption" tone="muted">
                Manage your detailing business
              </DDText>
            </View>
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </Surface>
        </Pressable>

        {/* Sections */}
        <Section title="Account">
          <Row
            icon={<User size={18} color={theme.colors.text} />}
            label="Personal info"
          />
          {FeatureFlags.SHOW_PAYMENT_METHODS && (
            <Row
              icon={<CreditCard size={18} color={theme.colors.text} />}
              label="Payment methods"
              hint="Visa · 4242"
            />
          )}
          {FeatureFlags.SHOW_SAVED_ADDRESSES && (
            <Row
              icon={<MapPin size={18} color={theme.colors.text} />}
              label="Saved addresses"
              hint="2 saved"
            />
          )}
        </Section>

        <Section title="Preferences">
          <Row
            icon={<Bell size={18} color={theme.colors.text} />}
            label="Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  true: theme.colors.brand,
                  false: theme.colors.surfaceMuted,
                }}
              />
            }
          />
          {FeatureFlags.SHOW_DARK_MODE_TOGGLE && (
            <Row
              icon={<Moon size={18} color={theme.colors.text} />}
              label="Dark mode"
              right={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{
                    true: theme.colors.brand,
                    false: theme.colors.surfaceMuted,
                  }}
                />
              }
            />
          )}
        </Section>

        <Section title="Support">
          {FeatureFlags.SHOW_RATE_APP && (
            <Row
              icon={<Star size={18} color={theme.colors.text} />}
              label="Rate DetailDash"
            />
          )}
          <Row
            icon={<HelpCircle size={18} color={theme.colors.text} />}
            label="Help center"
          />
          <Row
            icon={<Lock size={18} color={theme.colors.text} />}
            label="Privacy & terms"
          />
        </Section>

        <View style={{ marginTop: spacing.xxl }}>
          <Surface variant="muted" padding="lg" radius="lg">
            <Pressable
              hitSlop={8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                justifyContent: "center",
              }}
            >
              <LogOut size={16} color={theme.colors.danger} />
              <DDText tone="danger" weight="700">
                Sign out
              </DDText>
            </Pressable>
          </Surface>
          <DDText
            variant="micro"
            tone="subtle"
            align="center"
            style={{ marginTop: spacing.md }}
          >
            DetailDash · v1.0.0
          </DDText>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  right,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  right?: React.ReactNode;
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
      {right ?? <ChevronRight size={16} color={theme.colors.textSubtle} />}
    </Pressable>
  );
}
