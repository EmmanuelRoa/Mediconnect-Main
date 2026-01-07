import GoogleSVG from "@/assets/google-2.svg";
import { useTranslation } from "react-i18next";

function OAuthProvider() {
  const { t } = useTranslation("auth");
  const bubbles = [
    {
      id: "google",
      src: GoogleSVG,
      alt: "Auth bubble 3",
      text: t("login.googleSignUp", "Registrarse con Google"),
      provider: "google",
    },
  ];

  const handleSignIn = (provider: string) => {
    console.log(`Iniciar sesión con ${provider}`);
  };

  return (
    <div>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="auth-bubble bg-[var(--theme-color-surface)] border border-[var(--theme-border)] 
                     h-[50px] rounded-full flex items-center justify-center hover:opacity-50 
                     transition-opacity duration-300 ease-in-out gap-2 cursor-pointer"
          onClick={() => handleSignIn(bubble.provider)}
        >
          <img
            src={bubble.src}
            alt={bubble.alt}
            className="pointer-events-none"
            width={20}
            height={20}
          />
          <span className="ml-2 text-[var(--theme-text)] text-lg font-medium">
            {bubble.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export default OAuthProvider;
