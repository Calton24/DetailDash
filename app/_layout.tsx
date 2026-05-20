import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0A0A0B" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="permissions" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(detailer)" />
          <Stack.Screen
            name="detailer/[id]"
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen name="booking/service" />
          <Stack.Screen name="booking/details" />
          <Stack.Screen name="booking/payment" />
          <Stack.Screen
            name="booking/success"
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="booking/[id]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
