import Avatar from "boring-avatars";

export const BANNER_COLORS = [
  "#A8C3A0",
  "#0B2C12",
  "#8BB1CA",
  "#FFFFFF",
  "#D7E3C9",
  "#EFF2D7",
  "#6FAF9A",
  "#3A6B4F",
  "#C1D8C3",
  "#F4F7EE",
  "#9BC4BC",
  "#5E8B7E",
  "#2F5D50",
  "#BFD3C1",
  "#E6EFE3",
  "#7FA8A0",
  "#4A7C6D",
  "#1E4035",
  "#A3C9B8",
  "#DCEBE2",
  "#8FBFAE",
  "#6B9E8E",
  "#355F55",
  "#9DB7D1",
  "#6F8FAF",
  "#4A6C8A",
  "#2E4F6B",
  "#C7D6E5",
  "#E3EAF1",
  "#B3C2D1",
  "#809BB5",
  "#5C768F",
  "#F1F3F5",
  "#DADFE4",
  "#B5BCC2",
  "#8F969C",
  "#6B7176",
  "#4A4F54",
  "#2E3236",
  "#1B1E21",
  "#0F1113",
];

type MCUserBannerProps = {
  name: string;
  bannerUrl?: string | null;

  className?: string;
};

function isSafari() {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function MCUserBanner({
  name,
  bannerUrl,

  className = "",
}: MCUserBannerProps) {
  // Si el usuario tiene banner propio → úsalo
  if (bannerUrl) {
    return (
      <img
        src={bannerUrl}
        alt={`${name} banner`}
        className={`w-full object-cover rounded-xl ${className}`}
      />
    );
  }

  // Si es Safari y no hay imagen, mostrar imagen fija
  if (isSafari()) {
    return (
      <img
        src="https://i.pinimg.com/1200x/04/6a/eb/046aeb05b2396c31672bb33ba4d5fe54.jpg"
        alt="Safari default banner"
        className={`w-full  object-cover rounded-xl ${className}`}
      />
    );
  }

  // Banner generado con boring-avatars
  return (
    <div className={`w-full h-fit rounded-xl overflow-hidden ${className}`}>
      <Avatar
        className=" h-fit w-full"
        name={name}
        variant="abstract"
        colors={BANNER_COLORS}
        square
      />
    </div>
  );
}
