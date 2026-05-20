import { useRouter } from "expo-router";
import {
    AlertCircle,
    Check,
    Clock,
    DollarSign,
    Edit2,
    Plus,
    X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    Switch,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { requireTestDetailer } from "../../config/dev";
import { detailersApi } from "../../utils/api";
import type { Service } from "../../utils/supabase";
import { ScreenHeader } from "../components/ScreenHeader";
import { spacing } from "../theme/tokens";
import { useDD } from "../theme/useDD";
import { DDButton } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { ErrorState } from "../ui/ErrorState";
import { SectionHeader } from "../ui/SectionHeader";
import { Skeleton } from "../ui/Skeleton";
import { Surface } from "../ui/Surface";
import { DDText } from "../ui/Text";

const SERVICE_TEMPLATES = [
  {
    name: "Maintenance Wash",
    description: "Exterior wash, wheels, tires, and windows cleaned",
    price_pence: 3500,
    deposit_pence: 1000,
    duration_minutes: 45,
    category: "express",
  },
  {
    name: "Interior Detail",
    description: "Deep vacuum, seats shampooed, dashboard & trim cleaned",
    price_pence: 7500,
    deposit_pence: 2500,
    duration_minutes: 120,
    category: "interior",
  },
  {
    name: "Exterior Detail",
    description: "Hand wash, clay bar, polish, wax, and tire dressing",
    price_pence: 9500,
    deposit_pence: 3000,
    duration_minutes: 150,
    category: "exterior",
  },
  {
    name: "Full Detail",
    description: "Complete interior and exterior deep clean and protection",
    price_pence: 15000,
    deposit_pence: 5000,
    duration_minutes: 240,
    category: "full",
  },
  {
    name: "Ceramic Coating",
    description: "Professional ceramic coating with 3-year protection",
    price_pence: 45000,
    deposit_pence: 15000,
    duration_minutes: 360,
    category: "ceramic",
  },
];

export default function ServiceManagementScreen() {
  const { theme } = useDD();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [services, setServices] = useState<Service[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const load = useCallback(async () => {
    try {
      // TODO: Replace with real auth detailer profile once Supabase Auth is wired up
      const detailerId = requireTestDetailer();
      const data = await detailersApi.getAllServices(detailerId);
      setServices(data);
      setState("ready");
    } catch (error) {
      console.error("Failed to load services:", error);
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

  const handleToggleActive = async (
    serviceId: string,
    currentActive: boolean
  ) => {
    try {
      const detailerId = requireTestDetailer();
      await detailersApi.toggleServiceActive(
        serviceId,
        detailerId,
        !currentActive
      );
      await load();
    } catch (error) {
      console.error("Failed to toggle service:", error);
      Alert.alert("Error", "Failed to update service status");
    }
  };

  const handleAddService = async (template: (typeof SERVICE_TEMPLATES)[0]) => {
    try {
      const detailerId = requireTestDetailer();
      await detailersApi.createService({
        detailer_id: detailerId,
        ...template,
      });
      setShowAddModal(false);
      await load();
    } catch (error) {
      console.error("Failed to create service:", error);
      Alert.alert("Error", "Failed to create service");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={["top"]}
    >
      <ScreenHeader
        title="Services & pricing"
        subtitle="Manage what customers can book"
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.huge,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand}
          />
        }
      >
        {state === "loading" ? (
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <Skeleton height={140} radius="lg" />
            <Skeleton height={140} radius="lg" />
          </View>
        ) : state === "error" ? (
          <ErrorState onRetry={load} />
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: spacing.lg,
                gap: spacing.md,
              }}
            >
              <View style={{ flex: 1 }}>
                <SectionHeader
                  title="Your services"
                  subtitle={`${services.filter((s) => s.is_active).length} active`}
                />
              </View>
              <Pressable onPress={() => setShowAddModal(true)}>
                <Surface
                  variant="elevated"
                  padding="sm"
                  radius="md"
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Plus size={16} color={theme.colors.brand} />
                  <DDText variant="caption" tone="brand">
                    Add
                  </DDText>
                </Surface>
              </Pressable>
            </View>

            {services.length === 0 ? (
              <EmptyState
                icon={<AlertCircle size={28} color={theme.colors.textMuted} />}
                title="No services yet"
                message="Add your first service to start accepting bookings"
                actionLabel="Add service"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <View style={{ gap: spacing.md, marginTop: spacing.md }}>
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={() => setEditingService(service)}
                    onToggle={() =>
                      handleToggleActive(service.id, service.is_active)
                    }
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Service Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.bg }}
          edges={["top"]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <DDText variant="h2">Add service</DDText>
            <Pressable onPress={() => setShowAddModal(false)}>
              <X size={24} color={theme.colors.text} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.huge,
            }}
          >
            <DDText
              variant="caption"
              tone="muted"
              style={{ marginTop: spacing.md }}
            >
              Choose a template to get started
            </DDText>
            <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
              {SERVICE_TEMPLATES.map((template, idx) => (
                <Pressable key={idx} onPress={() => handleAddService(template)}>
                  <Surface variant="elevated" padding="lg" radius="lg">
                    <DDText variant="bodyStrong">{template.name}</DDText>
                    <DDText
                      variant="caption"
                      tone="muted"
                      style={{ marginTop: 4 }}
                    >
                      {template.description}
                    </DDText>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: spacing.md,
                        marginTop: spacing.md,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <DollarSign size={12} color={theme.colors.textSubtle} />
                        <DDText variant="caption" tone="subtle">
                          £{(template.price_pence / 100).toFixed(0)}
                        </DDText>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={12} color={theme.colors.textSubtle} />
                        <DDText variant="caption" tone="subtle">
                          {template.duration_minutes}min
                        </DDText>
                      </View>
                    </View>
                  </Surface>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={async () => {
            setEditingService(null);
            await load();
          }}
        />
      )}
    </SafeAreaView>
  );
}

function ServiceCard({
  service,
  onEdit,
  onToggle,
}: {
  service: Service;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const { theme } = useDD();

  return (
    <Surface
      variant="elevated"
      padding="lg"
      radius="lg"
      style={{
        opacity: service.is_active ? 1 : 0.6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <DDText variant="bodyStrong">{service.name}</DDText>
            {service.is_active ? (
              <Chip label="Active" tone="success" size="sm" />
            ) : (
              <Chip label="Inactive" tone="default" size="sm" />
            )}
          </View>
          <DDText variant="caption" tone="muted" style={{ marginTop: 4 }}>
            {service.description}
          </DDText>
        </View>
        <Pressable onPress={onEdit}>
          <Surface variant="muted" padding="sm" radius="md">
            <Edit2 size={14} color={theme.colors.text} />
          </Surface>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: spacing.md,
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.stroke,
        }}
      >
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <DollarSign size={12} color={theme.colors.textSubtle} />
            <DDText variant="caption" tone="subtle">
              £{(service.price_pence / 100).toFixed(2)} (£
              {(service.deposit_pence / 100).toFixed(2)} deposit)
            </DDText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Clock size={12} color={theme.colors.textSubtle} />
            <DDText variant="caption" tone="subtle">
              {service.duration_minutes} minutes
            </DDText>
          </View>
        </View>
        <Switch
          value={service.is_active}
          onValueChange={onToggle}
          trackColor={{
            true: theme.colors.success,
            false: theme.colors.surfaceMuted,
          }}
        />
      </View>
    </Surface>
  );
}

function EditServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: Service;
  onClose: () => void;
  onSave: () => void;
}) {
  const { theme } = useDD();
  const [description, setDescription] = useState(service.description || "");
  const [pricePounds, setPricePounds] = useState(
    (service.price_pence / 100).toString()
  );
  const [depositPounds, setDepositPounds] = useState(
    (service.deposit_pence / 100).toString()
  );
  const [duration, setDuration] = useState(service.duration_minutes.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const detailerId = requireTestDetailer();
      await detailersApi.updateService(service.id, detailerId, {
        description,
        price_pence: Math.round(parseFloat(pricePounds) * 100),
        deposit_pence: Math.round(parseFloat(depositPounds) * 100),
        duration_minutes: parseInt(duration, 10),
      });
      onSave();
    } catch (error) {
      console.error("Failed to update service:", error);
      Alert.alert("Error", "Failed to update service");
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        edges={["top"]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          <DDText variant="h2">Edit service</DDText>
          <Pressable onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.huge,
          }}
        >
          <DDText variant="bodyStrong" style={{ marginTop: spacing.lg }}>
            {service.name}
          </DDText>

          <DDText
            variant="caption"
            tone="subtle"
            style={{ marginTop: spacing.lg }}
          >
            DESCRIPTION
          </DDText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Service description..."
            multiline
            numberOfLines={3}
            style={{
              marginTop: spacing.sm,
              padding: spacing.md,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.stroke,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontSize: 15,
              minHeight: 80,
            }}
            placeholderTextColor={theme.colors.textMuted}
          />

          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginTop: spacing.lg,
            }}
          >
            <View style={{ flex: 1 }}>
              <DDText variant="caption" tone="subtle">
                PRICE (£)
              </DDText>
              <TextInput
                value={pricePounds}
                onChangeText={setPricePounds}
                keyboardType="decimal-pad"
                placeholder="0.00"
                style={{
                  marginTop: spacing.sm,
                  padding: spacing.md,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.stroke,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  fontSize: 15,
                }}
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DDText variant="caption" tone="subtle">
                DEPOSIT (£)
              </DDText>
              <TextInput
                value={depositPounds}
                onChangeText={setDepositPounds}
                keyboardType="decimal-pad"
                placeholder="0.00"
                style={{
                  marginTop: spacing.sm,
                  padding: spacing.md,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.stroke,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  fontSize: 15,
                }}
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>

          <DDText
            variant="caption"
            tone="subtle"
            style={{ marginTop: spacing.lg }}
          >
            DURATION (MINUTES)
          </DDText>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            placeholder="60"
            style={{
              marginTop: spacing.sm,
              padding: spacing.md,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.stroke,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontSize: 15,
            }}
            placeholderTextColor={theme.colors.textMuted}
          />

          <DDButton
            label="Save changes"
            fullWidth
            loading={saving}
            onPress={handleSave}
            style={{ marginTop: spacing.xxl }}
            leftIcon={<Check size={16} color="#fff" />}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
