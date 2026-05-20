import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    CheckCircle2,
    ChevronLeft,
    Clock,
    Leaf,
    MapPin,
    Share2,
    Shield,
    Star,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { detailersApi } from "../../utils/api";
import { PriceRow } from "../components/PriceRow";
import { mapDetailer } from "../data/mappers";
import { bookingDraftStore } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Detailer, DetailerService } from "../types";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

export default function DetailerProfileScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;

  const [detailer, setDetailer] = useState<Detailer | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const load = useCallback(async () => {
    if (!id) {
      setLoadState("error");
      setErrorMessage("No detailer ID provided");
      return;
    }
    try {
      setLoadState("loading");
      const supabaseDetailer = await detailersApi.getDetailer(id);
      if (!supabaseDetailer) {
        setLoadState("error");
        setErrorMessage("Detailer not found");
        return;
      }
      const mappedDetailer = mapDetailer(supabaseDetailer);
      setDetailer(mappedDetailer);
      setLoadState("ready");
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to load detailer:", error);
      setLoadState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load detailer"
      );
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleBook = (service?: DetailerService) => {
    if (!detailer) return;
    bookingDraftStore.set({
      detailer,
      service: service ?? detailer.services[0],
    });
    router.push("/booking/service");
  };

  if (loadState === "loading") {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <Skeleton height={320} radius="none" />
        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          <Skeleton height={28} width="70%" />
          <Skeleton height={16} width="40%" />
          <Skeleton height={120} radius="lg" />
        </View>
      </View>
    );
  }

  if (loadState === "error" || !detailer) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <ErrorState
          title="Detailer not found"
          message={errorMessage || "This detailer may no longer be available."}
          onRetry={load}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ height: 340 }}>
          <Image
            source={{ uri: detailer.heroImage }}
            style={{ flex: 1 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.7)"]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={["top"]} style={styles.heroNav}>
            <Pressable
              hitSlop={12}
              onPress={() => router.back()}
              style={styles.heroIconBtn}
            >
              <ChevronLeft color="#fff" size={22} />
            </Pressable>
            <Pressable hitSlop={12} style={styles.heroIconBtn}>
              <Share2 color="#fff" size={20} />
            </Pressable>
          </SafeAreaView>
          <View style={styles.heroFooter}>
            <View
              style={{ flexDirection: "row", gap: 6, marginBottom: spacing.sm }}
            >
              {detailer.badges.includes("verified") && (
                <Chip
                  label="Verified"
                  tone="brand"
                  size="sm"
                  icon={<CheckCircle2 size={12} color={theme.colors.brand} />}
                />
              )}
              {detailer.badges.includes("topRated") && (
                <Chip label="Top rated" tone="warning" size="sm" />
              )}
              {detailer.badges.includes("ecoFriendly") && (
                <Chip
                  label="Eco"
                  tone="success"
                  size="sm"
                  icon={<Leaf size={12} color={theme.colors.success} />}
                />
              )}
            </View>
            <DDText variant="h1" style={{ color: "#fff" }}>
              {detailer.name}
            </DDText>
            <DDText
              variant="body"
              style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}
            >
              {detailer.tagline}
            </DDText>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginTop: spacing.md,
              }}
            >
              <View style={styles.metaRow}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
                <DDText
                  variant="caption"
                  style={{ color: "#fff", fontWeight: "700" }}
                >
                  {detailer.rating.toFixed(2)}
                </DDText>
                {FeatureFlags.SHOW_REVIEWS_COUNT && (
                  <DDText
                    variant="caption"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    ({detailer.reviewsCount})
                  </DDText>
                )}
              </View>
              <View style={styles.metaRow}>
                <MapPin size={13} color="#fff" />
                <DDText variant="caption" style={{ color: "#fff" }}>
                  {detailer.distanceKm} km · {detailer.city}
                </DDText>
              </View>
            </View>
          </View>
        </View>

        {/* Gallery */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader title="Gallery" />
          </View>
          <FlatList
            horizontal
            data={detailer.gallery}
            keyExtractor={(uri, idx) => `${uri}-${idx}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              gap: spacing.sm,
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: 160,
                  height: 120,
                  borderRadius: radii.lg,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ flex: 1 }}
                  contentFit="cover"
                />
              </View>
            )}
          />
        </View>

        {/* Services */}
        <View style={{ marginTop: spacing.xxl, paddingHorizontal: spacing.lg }}>
          <SectionHeader title="Services & pricing" />
          <View style={{ gap: spacing.sm }}>
            {detailer.services.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => handleBook(s)}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              >
                <Surface variant="elevated" radius="lg" padding="lg">
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <DDText variant="bodyStrong">{s.name}</DDText>
                      <DDText
                        variant="caption"
                        tone="muted"
                        style={{ marginTop: 2 }}
                      >
                        {s.description}
                      </DDText>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 4,
                          alignItems: "center",
                          marginTop: spacing.sm,
                        }}
                      >
                        <Clock size={12} color={theme.colors.textSubtle} />
                        <DDText variant="caption" tone="subtle">
                          {Math.floor(s.estimatedMinutes / 60)}h{" "}
                          {s.estimatedMinutes % 60}m
                        </DDText>
                      </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <DDText variant="caption" tone="subtle">
                        From
                      </DDText>
                      <DDText variant="h3" tone="brand">
                        ${s.priceFrom}
                      </DDText>
                    </View>
                  </View>
                </Surface>
              </Pressable>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={{ marginTop: spacing.xxl, paddingHorizontal: spacing.lg }}>
          <SectionHeader title="About" />
          <Surface variant="elevated" padding="lg" radius="lg">
            <DDText style={{ lineHeight: 22 }}>{detailer.about}</DDText>
            <View style={styles.aboutStats}>
              <PriceRow
                label="Experience"
                value={`${detailer.yearsExperience} years`}
              />
              <PriceRow label="Next available" value={detailer.nextSlot} />
              <PriceRow label="City" value={detailer.city} />
            </View>
          </Surface>
        </View>

        {/* Trust */}
        <View style={{ marginTop: spacing.xl, paddingHorizontal: spacing.lg }}>
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
            <Shield size={22} color={theme.colors.brand} />
            <View style={{ flex: 1 }}>
              <DDText variant="bodyStrong">Booking protection</DDText>
              <DDText variant="caption" tone="muted">
                100% satisfaction guarantee. Secure payment hold until job is
                complete.
              </DDText>
            </View>
          </Surface>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView edges={["bottom"]} style={styles.stickyWrap}>
        <Surface
          variant="elevated"
          radius="xxl"
          style={[styles.stickyBar, { borderColor: theme.colors.stroke }]}
          shadow="lg"
        >
          <View style={{ flex: 1 }}>
            <DDText variant="caption" tone="subtle">
              From
            </DDText>
            <DDText variant="h2" tone="brand">
              ${detailer.priceFrom}
            </DDText>
          </View>
          <DDButton
            label="Book now"
            onPress={() => handleBook()}
            style={{ minWidth: 160 }}
          />
        </Surface>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  heroIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroFooter: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  aboutStats: { marginTop: spacing.md, gap: 2 },
  stickyWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  stickyBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingLeft: spacing.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
});
