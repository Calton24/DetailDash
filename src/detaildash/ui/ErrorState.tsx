import { AlertTriangle } from "lucide-react-native";
import React from "react";
import { useDD } from "../theme/useDD";
import { EmptyState } from "./EmptyState";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this just now. Pull to refresh or try again.",
  onRetry,
}: ErrorStateProps) {
  const { theme } = useDD();
  return (
    <EmptyState
      icon={<AlertTriangle color={theme.colors.danger} size={32} />}
      title={title}
      message={message}
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}
