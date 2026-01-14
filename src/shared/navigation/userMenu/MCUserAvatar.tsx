import Avatar from "boring-avatars";

const AVATAR_COLORS = ["#0b2c12", "#8bb1ca", "#d7e3c9", "#eff2d7", "#ffffff"];

type MCUserAvatarProps = {
  name: string;
  size?: number;
  square?: boolean;
};

export function MCUserAvatar({
  name,
  size = 40,
  square = false,
}: MCUserAvatarProps) {
  return (
    <Avatar
      name={name}
      size={size}
      variant="beam"
      colors={AVATAR_COLORS}
      square={square}
    />
  );
}
