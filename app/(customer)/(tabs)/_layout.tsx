import { useDD } from "@/src/detaildash/theme/useDD";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import {
    Calendar,
    Compass,
    Settings as SettingsIcon,
} from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function CustomerTabsLayout() {
  const { theme } = useDD();
  const isDark = theme.mode === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : theme.colors.bgElevated,
          height: 88,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2,
        },
        tabBarBackground:
          Platform.OS === "ios"
            ? () => (
                <BlurView
                  intensity={70}
                  tint={isDark ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
              )
            : undefined,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size - 2} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size - 2} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size - 2} strokeWidth={2.2} />
          ),
        }}
      />
    </Tabs>
  );
}

// keep View import used
void View;
