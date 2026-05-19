import { Button, Section, Text, VStack } from "@expo/ui/swift-ui";
import React from "react";

export function ButtonsSection() {
  const handlePress = (variant: string) => {
    console.log(`Pressed: ${variant}`);
  };

  return (
    <Section title="🔘 Buttons">
      <VStack spacing={12}>
        <Text size={14} color="gray">
          Button Variants
        </Text>

        <Button label="Default Button" onPress={() => handlePress("default")} />

        <Button
          label="Bordered Button"
          variant="bordered"
          onPress={() => handlePress("bordered")}
        />

        <Button
          label="Bordered Prominent"
          variant="borderedProminent"
          onPress={() => handlePress("borderedProminent")}
        />

        <Button
          label="Borderless Button"
          variant="borderless"
          onPress={() => handlePress("borderless")}
        />

        <Button
          label="Plain Button"
          variant="plain"
          onPress={() => handlePress("plain")}
        />

        <Text size={14} color="gray">
          Button Roles
        </Text>

        <Button
          label="Cancel Button"
          role="cancel"
          onPress={() => handlePress("cancel")}
        />

        <Button
          label="Destructive Button"
          role="destructive"
          onPress={() => handlePress("destructive")}
        />

        <Text size={14} color="gray">
          Button with Icons
        </Text>

        <Button
          label="Favorite"
          systemImage="star.fill"
          onPress={() => handlePress("icon")}
        />

        <Button
          label="Take Photo"
          systemImage="camera"
          variant="bordered"
          onPress={() => handlePress("camera")}
        />

        <Text size={14} color="gray">
          Button Sizes
        </Text>

        <Button
          label="Mini"
          controlSize="mini"
          onPress={() => handlePress("mini")}
        />

        <Button
          label="Small"
          controlSize="small"
          onPress={() => handlePress("small")}
        />

        <Button
          label="Regular"
          controlSize="regular"
          onPress={() => handlePress("regular")}
        />

        <Button
          label="Large"
          controlSize="large"
          onPress={() => handlePress("large")}
        />

        <Text size={14} color="gray">
          Custom Colors
        </Text>

        <Button
          label="Red Button"
          color="red"
          variant="bordered"
          onPress={() => handlePress("red")}
        />

        <Button
          label="Green Button"
          color="green"
          variant="bordered"
          onPress={() => handlePress("green")}
        />

        <Button
          label="Blue Button"
          color="blue"
          variant="borderedProminent"
          onPress={() => handlePress("blue")}
        />
      </VStack>
    </Section>
  );
}
