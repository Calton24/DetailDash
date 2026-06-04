import { DatePicker, Picker, Section, Text, VStack } from "@expo/ui/swift-ui";
import React, { useState } from "react";

export function DateTimeSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [variantIndex, setVariantIndex] = useState<number | null>(0);
  const [componentIndex, setComponentIndex] = useState<number | null>(0);

  const variants = ["automatic", "compact", "graphical", "wheel"];
  const components = ["date", "hourAndMinute", "dateAndTime"];

  const currentVariant =
    variantIndex !== null ? variants[variantIndex] : "automatic";
  const currentComponent =
    componentIndex !== null ? components[componentIndex] : "date";

  return (
    <Section title="📅 Date & Time">
      <VStack spacing={12}>
        <Text size={14} color="gray">
          Display Style
        </Text>
        <Picker
          options={variants}
          selectedIndex={variantIndex}
          variant="segmented"
          onOptionSelected={(e) => setVariantIndex(e.nativeEvent.index)}
        />

        <Text size={14} color="gray">
          Components
        </Text>
        <Picker
          options={["Date", "Time", "Both"]}
          selectedIndex={componentIndex}
          variant="segmented"
          onOptionSelected={(e) => setComponentIndex(e.nativeEvent.index)}
        />

        <Text size={14} color="gray">
          Date Picker
        </Text>
        <DatePicker
          title="Select Date"
          selection={selectedDate || new Date()}
          displayedComponents={
            currentComponent === "dateAndTime"
              ? ["date", "hourAndMinute"]
              : [currentComponent as "date" | "hourAndMinute"]
          }
          onDateChange={(date) => setSelectedDate(date)}
        />

        <Text size={12} color="gray">
          {selectedDate
            ? `Selected: ${selectedDate.toLocaleString()}`
            : "No date selected"}
        </Text>
      </VStack>
    </Section>
  );
}
