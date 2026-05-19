import {
    Button,
    ContextMenu,
    HStack,
    Section,
    Text,
    Toggle,
    VStack,
} from "@expo/ui/swift-ui";
import {
    background,
    cornerRadius,
    frame,
    padding,
} from "@expo/ui/swift-ui/modifiers";
import React, { useState } from "react";

export function ContextMenuSection() {
  const [showCompleted, setShowCompleted] = useState(true);
  const [lastAction, setLastAction] = useState("None");

  return (
    <Section title="📌 Context Menus">
      <VStack spacing={16}>
        <Text size={14} color="gray">
          Long press or tap the boxes below
        </Text>

        <ContextMenu>
          <ContextMenu.Trigger>
            <HStack
              modifiers={[
                frame({ height: 80 }),
                background("#007AFF"),
                cornerRadius(12),
                padding({ all: 16 }),
              ]}
            >
              <Text size={16} color="white">
                Long press for options
              </Text>
            </HStack>
          </ContextMenu.Trigger>
          <ContextMenu.Items>
            <Button
              label="Add to Favorites"
              systemImage="star.fill"
              onPress={() => setLastAction("Favorite")}
            />
            <Button
              label="Share"
              systemImage="square.and.arrow.up"
              onPress={() => setLastAction("Share")}
            />
            <Button
              label="Copy"
              systemImage="doc.on.doc"
              onPress={() => setLastAction("Copy")}
            />
            <Toggle
              value={showCompleted}
              label="Show Completed"
              variant="checkbox"
              onValueChange={setShowCompleted}
            />
            <Button
              label="Delete"
              systemImage="trash"
              variant="destructive"
              onPress={() => setLastAction("Delete")}
            />
          </ContextMenu.Items>
        </ContextMenu>

        <ContextMenu>
          <ContextMenu.Trigger>
            <HStack
              modifiers={[
                frame({ height: 80 }),
                background("#34C759"),
                cornerRadius(12),
                padding({ all: 16 }),
              ]}
            >
              <Text size={16} color="white">
                Another context menu
              </Text>
            </HStack>
          </ContextMenu.Trigger>
          <ContextMenu.Items>
            <Button
              label="Edit"
              systemImage="pencil"
              onPress={() => setLastAction("Edit")}
            />
            <Button
              label="Refresh"
              systemImage="arrow.clockwise"
              onPress={() => setLastAction("Refresh")}
            />
            <Button
              label="Get Info"
              systemImage="info.circle"
              onPress={() => setLastAction("Info")}
            />
          </ContextMenu.Items>
        </ContextMenu>

        <Text size={12} color="gray">
          {`Last action: ${lastAction}`}
        </Text>
        <Text size={12} color="gray">
          {`Show completed: ${showCompleted ? "Yes" : "No"}`}
        </Text>
      </VStack>
    </Section>
  );
}
