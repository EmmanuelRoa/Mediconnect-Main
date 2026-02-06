import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";

interface ChatAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 md:h-10 md:w-10",
  md: "h-10 w-10 md:h-12 md:w-12",
  lg: "h-12 w-12 md:h-14 md:w-14",
};

const mcUserAvatarSizes = {
  sm: { mobile: 32, desktop: 40 },
  md: { mobile: 40, desktop: 48 },
  lg: { mobile: 48, desktop: 56 },
};

export function ChatAvatar({ name, avatar, size = "md" }: ChatAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Si no hay avatar, usa MCUserAvatar
  if (!avatar) {
    return (
      <MCUserAvatar
        name={name}
        square={false}
        size={mcUserAvatarSizes[size].desktop}
        className={`${sizeClasses[size]} object-cover transition-transform duration-500 hover:scale-110`}
      />
    );
  }

  return (
    <Avatar className={`${sizeClasses[size]} bg-muted flex-shrink-0`}>
      <AvatarImage src={avatar} alt={name} className="object-cover" />
      <AvatarFallback className="bg-muted text-muted-foreground font-medium text-xs md:text-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
