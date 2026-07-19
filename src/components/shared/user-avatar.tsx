import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/cn";
import { cn } from "@/lib/utils/cn";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
}

export function UserAvatar({ src, name, email, className }: UserAvatarProps) {
  const displayName = name || email || "User";
  const initials = getInitials(displayName);

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage src={src || ""} alt={displayName} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
