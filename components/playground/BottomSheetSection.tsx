import {
    BottomSheet,
    Button,
    Section,
    Slider,
    Text,
    Toggle,
    VStack,
} from "@expo/ui/swift-ui";
import { useState } from "react";

export function BottomSheetSection() {
  const [isOpened, setIsOpened] = useState(false);
  const [isLargeOpened, setIsLargeOpened] = useState(false);
  const [isCustomOpened, setIsCustomOpened] = useState(false);
  const [sheetValue, setSheetValue] = useState(0.5);
  const [sheetToggle, setSheetToggle] = useState(true);

  return (
    <Section title="📋 Bottom Sheets">
      <VStack spacing={12}>
        <Text size={14} color="gray">
          Sheet Sizes
        </Text>

        <Button label="Open Medium Sheet" onPress={() => setIsOpened(true)} />

        <Button
          label="Open Large Sheet"
          onPress={() => setIsLargeOpened(true)}
        />

        <Button
          label="Open Custom Height (40%)"
          onPress={() => setIsCustomOpened(true)}
        />

        {/* Medium Sheet */}
        <BottomSheet
          isPresented={isOpened}
          onIsPresentedChange={setIsOpened}
          presentationDetents={["medium"]}
          presentationDragIndicator="visible"
        >
          <VStack spacing={16}>
            <Text>Medium Sheet</Text>
            <Text>
              This is a medium-sized bottom sheet. You can add any content here.
            </Text>
            <Toggle
              isOn={sheetToggle}
              label="Toggle Option"
              onIsOnChange={setSheetToggle}
            />
            <Slider value={sheetValue} onValueChange={setSheetValue} />
            <Text>{`Slider value: ${sheetValue.toFixed(2)}`}</Text>
            <Button
              label="Close Sheet"
              variant="borderedProminent"
              onPress={() => setIsOpened(false)}
            />
          </VStack>
        </BottomSheet>

        {/* Large Sheet */}
        <BottomSheet
          isPresented={isLargeOpened}
          onIsPresentedChange={setIsLargeOpened}
          presentationDetents={["large"]}
          presentationDragIndicator="visible"
        >
          <VStack spacing={16}>
            <Text>Large Sheet</Text>
            <Text>
              This sheet takes up most of the screen. Great for complex forms or
              content.
            </Text>
            <Text>You can scroll down for more content...</Text>
            <Button
              label="Dismiss"
              variant="bordered"
              onPress={() => setIsLargeOpened(false)}
            />
          </VStack>
        </BottomSheet>

        {/* Custom Height Sheet */}
        <BottomSheet
          isPresented={isCustomOpened}
          onIsPresentedChange={setIsCustomOpened}
          presentationDetents={[0.4, "medium", "large"]}
          presentationDragIndicator="automatic"
        >
          <VStack spacing={16}>
            <Text>Custom Sheet</Text>
            <Text>
              This sheet starts at 40% height but can be dragged to medium or
              large.
            </Text>
            <Button
              label="Close"
              role="destructive"
              onPress={() => setIsCustomOpened(false)}
            />
          </VStack>
        </BottomSheet>
      </VStack>
    </Section>
  );
}
