import { ScreenHeader } from "@/src/detaildash/components/ScreenHeader";
import { spacing } from "@/src/detaildash/theme/tokens";
import { useDD } from "@/src/detaildash/theme/useDD";
import { Avatar } from "@/src/detaildash/ui/Avatar";
import { Surface } from "@/src/detaildash/ui/Surface";
import { DDText } from "@/src/detaildash/ui/Text";
import { supabase } from "@/src/utils/supabase";
import { Mail, Phone, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getInitials(fullName?: string | null, email?: string | null): string {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

function formatMemberSince(createdAt?: string | null): string {
  if (!createdAt) return "Member since 2026";
  const date = new Date(createdAt);
  return `Member since ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default function CustomerProfileScreen() {
  const { theme } = useDD();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email ?? null);

      // Load profile data from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, created_at")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFullName(profile.full_name ?? null);
        setPhone(profile.phone ?? null);
        setCreatedAt(profile.created_at ?? null);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  }

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
        {!loading && (
          <View style={{ alignItems: "center", gap: spacing.md }}>
            <Avatar initials={getInitials(fullName, userEmail)} size={96} />
            <DDText variant="h3">{fullName || "Customer"}</DDText>
            <DDText variant="caption" tone="muted">
              {formatMemberSince(createdAt)}
            </DDText>
          </View>
        )}

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

        {!loading && (
          <Surface
            variant="elevated"
            padding="lg"
            radius="lg"
            style={{ gap: spacing.sm, marginTop: spacing.lg }}
          >
            <Field
              icon={<User size={16} color={theme.colors.text} />}
              label="Full name"
              value={fullName || "Customer"}
            />
            <Field
              icon={<Mail size={16} color={theme.colors.text} />}
              label="Email"
              value={userEmail || "Not provided"}
            />
            <Field
              icon={<Phone size={16} color={theme.colors.text} />}
              label="Phone"
              value={phone || "Not provided"}
            />
          </Surface>
        )}
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
