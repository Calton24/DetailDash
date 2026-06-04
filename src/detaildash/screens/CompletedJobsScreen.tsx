import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Calendar, ChevronRight, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeatureFlags } from "../../../config/features";
import { requireTestDetailer } from "../../config/dev";
import { bookingsApi } from "../../utils/api";
import { mapBooking, mapBookingRequest } from "../data/mappers";
import { formatCents } from "../state/bookingDraft";
import { radii, spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import type { Booking, BookingRequest } from "../types";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton } from "../ui/Skeleton";
import { StatBlock } from "../ui/StatBlock";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

type Filter = "upcoming" | "completed" | "requests";

export default function CompletedJobsScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [completed, setCompleted] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      // TODO: Replace with real auth detailer profile once Supabase Auth is wired up
      const detailerId = requireTestDetailer();
      const [upcomingData, requestsData] = await Promise.all([
        bookingsApi.getUpcomingJobs(detailerId),
        bookingsApi.getBookingRequests(detailerId),
      ]);

      // Map upcoming jobs (accepted/on_the_way/arrived/detailing)
      const mappedUpcoming = upcomingData.map((b) =>
        mapBooking(b, b.detailer, b.service)
      );

      // Map requests (pending)
      const mappedRequests = requestsData.map((b) =>
        mapBookingRequest(b, b.detailer, b.service)
      );

      // Completed jobs - filter from upcoming data where status='completed'
      const completedData = upcomingData.filter(
        (b) => b.status === "completed"
      );
      const mappedCompleted = completedData.map((b) =>
        mapBooking(b, b.detailer, b.service)
      );

      setUpcoming(mappedUpcoming.filter((b) => b.status !== "completed"));
      setCompleted(mappedCompleted);
      setRequests(mappedRequests);
      setState("ready");
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setState("error");
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

  const totalEarned = completed.reduce(
    (sum, b) => sum + Math.round(b.priceCents * 0.92),
    0
  );

  const list: (Booking | BookingRequest)[] =
    filter === "upcoming"
      ? upcoming
      : filter === "completed"
        ? completed
        : requests;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <DDText variant="h1">Jobs</DDText>
      </View>

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
        {/* Earnings - hidden for MVP */}
        {FeatureFlags.SHOW_EARNINGS_ANALYTICS && (
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              paddingHorizontal: spacing.lg,
              marginTop: spacing.lg,
            }}
          >
            <StatBlock
              label="Lifetime"
              value={formatCents(totalEarned)}
              delta={`${completed.length} jobs`}
            />
            <StatBlock
              label="Pending"
              value={`${requests.length}`}
              delta="awaiting accept"
            />
          </View>
        )}

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
            marginTop: spacing.lg,
          }}
        >
          <Chip
            label={`Upcoming · ${upcoming.length}`}
            selected={filter === "upcoming"}
            onPress={() => setFilter("upcoming")}
          />
          <Chip
            label={`Completed · ${completed.length}`}
            selected={filter === "completed"}
            onPress={() => setFilter("completed")}
          />
          <Chip
            label={`Requests · ${requests.length}`}
            selected={filter === "requests"}
            onPress={() => setFilter("requests")}
          />
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <SectionHeader
            title={
              filter === "upcoming"
                ? "Upcoming jobs"
                : filter === "completed"
                  ? "Completed jobs"
                  : "Job requests"
            }
          />
          {state === "loading" ? (
            <View style={{ gap: spacing.md }}>
              <Skeleton height={100} radius="lg" />
              <Skeleton height={100} radius="lg" />
            </View>
          ) : state === "error" ? (
            <ErrorState onRetry={load} />
          ) : list.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={28} color={theme.colors.brand} />}
              title="Nothing here yet"
              message="As you accept jobs they'll appear here."
            />
          ) : (
            <View style={{ gap: spacing.md }}>
              {list.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  onPress={() => {
                    if (filter === "requests")
                      router.push(`/(detailer)/request/${job.id}`);
                    else router.push(`/(detailer)/job/${job.id}`);
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function JobRow({
  job,
  onPress,
}: {
  job: Booking | BookingRequest;
  onPress: () => void;
}) {
  const { theme } = useDD();
  const d = new Date(job.scheduledFor);
  const when = d.toLocaleDateString("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  });
  const customer = "customerName" in job ? job.customerName : "Customer";
  return (
    <Pressable onPress={onPress}>
      <Surface variant="elevated" radius="lg" padding="md">
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Image
            source={{ uri: job.detailerImage }}
            style={{ width: 56, height: 56, borderRadius: radii.md }}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <DDText variant="bodyStrong">{job.serviceName}</DDText>
            <DDText variant="caption" tone="muted">
              {customer}
            </DDText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
              }}
            >
              <Calendar size={11} color={theme.colors.textSubtle} />
              <DDText variant="micro" tone="subtle">
                {when} · {time}
              </DDText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <DDText variant="bodyStrong" tone="success">
              {formatCents(Math.round(job.priceCents * 0.92))}
            </DDText>
            <ChevronRight size={14} color={theme.colors.textSubtle} />
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}
