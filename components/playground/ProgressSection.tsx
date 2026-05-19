import {
    Button,
    HStack,
    ProgressView,
    Section,
    Text,
    VStack,
} from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import React, { useEffect, useState } from "react";

export function ProgressSection() {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newValue = prev + 0.02;
        return newValue > 1 ? 0 : newValue;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <Section title="⏳ Progress Indicators">
      <VStack spacing={16}>
        <Text size={14} color="gray">
          Indeterminate Progress
        </Text>
        <HStack spacing={24}>
          <VStack spacing={4} alignment="center">
            <ProgressView modifiers={[frame({ width: 120 })]} />
            <Text size={10} color="gray">
              Indeterminate
            </Text>
          </VStack>
        </HStack>

        <Text size={14} color="gray">
          Determinate Progress
        </Text>
        <HStack spacing={24}>
          <VStack spacing={4} alignment="center">
            <ProgressView
              value={progress}
              modifiers={[frame({ width: 150 })]}
            />
            <Text
              size={10}
              color="gray"
            >{`${Math.round(progress * 100)}%`}</Text>
          </VStack>
        </HStack>

        <Text size={14} color="gray">
          Multiple Progress Bars
        </Text>
        <VStack spacing={12}>
          <ProgressView value={0.3} modifiers={[frame({ width: 200 })]} />
          <ProgressView value={0.5} modifiers={[frame({ width: 200 })]} />
          <ProgressView value={0.7} modifiers={[frame({ width: 200 })]} />
          <ProgressView value={0.9} modifiers={[frame({ width: 200 })]} />
        </VStack>

        <Button
          label={isAnimating ? "Pause Animation" : "Resume Animation"}
          onPress={() => setIsAnimating(!isAnimating)}
        />
      </VStack>
    </Section>
  );
}
