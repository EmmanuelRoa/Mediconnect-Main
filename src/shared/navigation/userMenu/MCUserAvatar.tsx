import Avatar from "boring-avatars";

const AVATAR_COLORS = [
  "#A8C3A0",
  "#0B2C12", // agregado, más oscuro
  "#8bb1ca",
  "#ffffff",
  "#d7e3c9",
  "#eff2d7",
];

type MCUserAvatarProps = {
  name: string;
  size?: number;
  square?: boolean;
  className?: string;
};

export function MCUserAvatar({
  name,
  size = 40,
  square = false,
  className,
}: MCUserAvatarProps) {
  return (
    <Avatar
      name={name}
      size={size}
      variant="beam"
      colors={AVATAR_COLORS}
      square={square}
      className={`border-primary/2 border rounded-full ${className}`}
    />
  );
}
