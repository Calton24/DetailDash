import { ScreenHeader } from "@/src/detaildash/components/ScreenHeader";
import { spacing } from "@/src/detaildash/theme/tokens";
import { useDD } from "@/src/detaildash/theme/useDD";
import { Avatar } from "@/src/detaildash/ui/Avatar";
import { Surface } from "@/src/detaildash/ui/Surface";
import { DDText } from "@/src/detaildash/ui/Text";
import { User } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerProfileScreen() {
  const { theme } = useDD();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader title="Edit profile" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.huge,
          gap: spacing.lg,
        }}
      >
        <View style={{ alignItems: "center", gap: spacing.md }}>
          <Avatar initials="AY" size={96} />
          <DDText variant="h3">Alex Yen</DDText>
          <DDText variant="caption" tone="muted">
            Member since May 2026
          </DDText>
        </View>

        <Surface
          variant="muted"
          padding="md"
          radius="lg"
          style={{ marginTop: spacing.md }}
        >
          <DDText
            variant="caption"
            tone="muted"
            style={{ textAlign: "center" }}
          >
            Profile details are managed by DetailDash during early access.
          </DDText>
        </Surface>

        <Surface
          variant="elevated"
          padding="lg"
          radius="lg"
          style={{ gap: spacing.sm, marginTop: spacing.lg }}
        >
          <Field
            icon={<User size={16} color={theme.colors.text} />}
            label="Full name"
            value="Alex Yen"
          />
          <Field
            icon={<User size={16} color={theme.colors.text} />}
            label="Email"
            value="alex@detaildash.app"
          />
          <Field
            icon={<User size={16} color={theme.colors.text} />}
            label="Phone"
            value="+61 4xx xxx xxx"
          />
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <DDText variant="micro" tone="subtle">
          {label.toUpperCase()}
        </DDText>
        <DDText variant="bodyStrong">{value}</DDText>
      </View>
    </View>
  );
}
