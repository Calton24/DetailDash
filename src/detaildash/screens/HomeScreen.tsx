import { useRouter } from "expo-router";
import {
    Bell,
    ChevronDown,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { detailersApi } from "../../utils/api";
import { DetailerCard } from "../components/DetailerCard";
import { ServiceCategoryTile } from "../components/ServiceCategoryTile";
import { mapDetailers } from "../data/mappers";
import { SERVICE_CATEGORIES } from "../data/mock";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Detailer, ServiceCategoryId } from "../types";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton, SkeletonCard } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

type LoadState = "loading" | "ready" | "error";

export default function HomeScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [detailers, setDetailers] = useState<Detailer[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ServiceCategoryId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const load = useCallback(async () => {
    try {
      setLoadState("loading");
      const supabaseDetailers = await detailersApi.listDetailers();
      const mappedDetailers = mapDetailers(supabaseDetailers);
      setDetailers(mappedDetailers);
      setLoadState("ready");
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to load detailers:", error);
      setLoadState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load detailers"
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(() => {
    return detailers.filter((d) => {
      const matchesSearch =
        !(search ?? "").trim() ||
        (d.name ?? "").toLowerCase().includes((search ?? "").toLowerCase()) ||
        (d.tagline ?? "").toLowerCase().includes((search ?? "").toLowerCase());
      const matchesCategory =
        !category || d.services.some((s) => s.category === category);
      return matchesSearch && matchesCategory;
    });
  }, [detailers, search, category]);

  const featured = useMemo(
    () =>
      detailers.filter(
        (d) => d.badges.includes("topRated") || d.badges.includes("pro")
      ),
    [detailers]
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <DDText variant="micro" tone="subtle">
              CURRENT LOCATION
            </DDText>
            <Pressable
              hitSlop={6}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 2,
              }}
            >
              <MapPin size={16} color={theme.colors.brand} />
              <DDText variant="h3">Brisbane, AU</DDText>
              <ChevronDown size={16} color={theme.colors.textMuted} />
            </Pressable>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: theme.colors.surfaceAlt,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Bell size={18} color={theme.colors.text} />
            <View
              style={[
                styles.notifDot,
                {
                  backgroundColor: theme.colors.brand,
                  borderColor: theme.colors.bg,
                },
              ]}
            />
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Surface
            variant="muted"
            radius="xl"
            style={[styles.searchBox, { borderColor: theme.colors.stroke }]}
          >
            <Search size={18} color={theme.colors.textMuted} />
            <TextInput
              placeholder="Search detailers or services"
              placeholderTextColor={theme.colors.textSubtle}
              value={search}
              onChangeText={setSearch}
              style={{
                flex: 1,
                color: theme.colors.text,
                fontSize: 15,
                paddingVertical: 0,
              }}
              returnKeyType="search"
            />
          </Surface>
          <Pressable
            style={({ pressed }) => [
              styles.filterBtn,
              {
                backgroundColor: theme.colors.brand,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <SlidersHorizontal
              size={18}
              color={theme.mode === "dark" ? "#000" : "#fff"}
            />
          </Pressable>
        </View>

        {/* Categories */}
        <View style={{ marginTop: spacing.xl }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader title="What do you need?" />
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SERVICE_CATEGORIES}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 4 }}
            renderItem={({ item }) => (
              <ServiceCategoryTile
                category={item}
                selected={category === item.id}
                onPress={(id) => setCategory(category === id ? null : id)}
              />
            )}
          />
        </View>

        {/* Featured carousel */}
        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader
              title="Featured detailers"
              subtitle="Hand-picked pros near you"
              actionLabel="See all"
              onAction={() => undefined}
            />
          </View>
          {loadState === "loading" ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                gap: spacing.md,
              }}
            >
              <Skeleton width={280} height={260} radius="xl" />
              <Skeleton width={280} height={260} radius="xl" />
            </ScrollView>
          ) : loadState === "error" ? (
            <ErrorState
              message={errorMessage || "Failed to load featured detailers"}
              onRetry={load}
            />
          ) : (
            <FlatList
              horizontal
              data={featured}
              keyExtractor={(d) => d.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                gap: spacing.md,
              }}
              renderItem={({ item }) => (
                <DetailerCard detailer={item} variant="feature" />
              )}
            />
          )}
        </View>

        {/* Nearby list */}
        <View style={{ marginTop: spacing.xxl, paddingHorizontal: spacing.lg }}>
          <SectionHeader
            title="Nearby"
            subtitle={
              category
                ? `Filtered by ${SERVICE_CATEGORIES.find((c) => c.id === category)?.name}`
                : `${filtered.length} pros within 10 km`
            }
          />
          {loadState === "loading" ? (
            <View style={{ gap: spacing.md }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No detailers match"
              message="Try clearing your filters or expanding your search radius."
              actionLabel="Clear filters"
              onAction={() => {
                setCategory(null);
                setSearch("");
              }}
            />
          ) : (
            <View style={{ gap: spacing.md }}>
              {filtered.map((d) => (
                <DetailerCard key={d.id} detailer={d} variant="list" />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      {loadState === "ready" && filtered.length > 0 ? (
        <Pressable
          onPress={() => router.push(`/detailer/${filtered[0].id}`)}
          style={({ pressed }) => [
            styles.stickyCta,
            {
              backgroundColor: theme.colors.brand,
              opacity: pressed ? 0.9 : 1,
              bottom: spacing.lg,
            },
          ]}
        >
          <DDText
            variant="bodyStrong"
            style={{ color: theme.mode === "dark" ? "#000" : "#fff" }}
          >
            Book {filtered[0].name.split(" ")[0]} now · {filtered[0].nextSlot}
          </DDText>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  searchRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: radii.pill,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  stickyCta: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    height: 54,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
});
