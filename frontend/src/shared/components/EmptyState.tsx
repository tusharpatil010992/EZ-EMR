import { Button } from "./Button";

interface EmptyStateProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-4xl text-gray-300">○</div>
      <p className="text-sm font-medium text-gray-600">{message}</p>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
