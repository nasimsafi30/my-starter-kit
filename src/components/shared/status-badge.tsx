import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "suspended" | "completed" | "failed" | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || statusStyles.inactive;

  return (
    <Badge className={cn(style, "capitalize", className)} variant="outline">
      {status}
    </Badge>
  );
}
