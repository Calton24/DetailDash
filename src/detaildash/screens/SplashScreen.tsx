import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import { palette } from "../theme/tokens";
import { DDText } from "../ui/Text";

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);
  const subOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, { duration: 700 });
    subOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      router.replace("/permissions");
    }, 1800);
    return () => clearTimeout(timer);
  }, [opacity, router, scale, subOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[palette.ink0, palette.ink1, palette.ink0]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <LinearGradient
          colors={[palette.brandSoft, palette.brand, palette.brandDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoBg}
        >
          <Sparkles color="#fff" size={40} strokeWidth={2.4} />
        </LinearGradient>
      </Animated.View>
      <Animated.View style={subStyle}>
        <DDText
          variant="display"
          align="center"
          style={{ color: "#fff", marginTop: 28 }}
        >
          DetailDash
        </DDText>
        <DDText
          variant="body"
          align="center"
          tone="muted"
          style={{ marginTop: 8 }}
        >
          Mobile detailing, on demand.
        </DDText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
  },
  logoBg: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.brand,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 28,
  },
});
