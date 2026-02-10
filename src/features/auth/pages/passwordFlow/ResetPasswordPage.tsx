import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import AuthContentContainer from "../../components/AuthContentContainer";
import MCInput from "@/shared/components/forms/MCInput";
import { useAppStore } from "@/stores/useAppStore";
import { useTranslation } from "react-i18next";
import AuthFooterContainer from "../../components/AuthFooterContainer";
import { useNavigate, useLocation } from "react-router-dom";
import { ResetPasswordSchema } from "@/schema/AuthSchema";
import { useEffect } from "react";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";
import { ROUTES } from "@/router/routes";
function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAppStore((state) => state.resetPassword);
  const setResetPassword = useAppStore((state) => state.setResetPassword);
  const setAccessPage = useGlobalUIStore((state) => state.setAccessPage);
  const setForgotPassword = useAppStore((state) => state.setForgotPassword);
  
  // Intentar obtener el email del estado de navegación primero, luego del store
  const emailFromNavigation = (location.state as { email?: string })?.email;
  const emailFromStore = useAppStore((state) => state.forgotPassword.email);
  const forgotPasswordEmail = emailFromNavigation || emailFromStore;
  
  const otp = useAppStore((state) => state.otp);

  useEffect(() => {
    // Si hay email de navegación pero no está en el store, guardarlo
    if (emailFromNavigation && !emailFromStore) {
      setForgotPassword({ email: emailFromNavigation });
    }
    
    // Si no hay email o OTP, redirigir
    if (!forgotPasswordEmail || !otp) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [forgotPasswordEmail, otp, emailFromNavigation, emailFromStore, setForgotPassword, navigate]);

  const handleSubmit = (data: {
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password && data.confirmPassword) {
      setResetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setAccessPage(
        true,
        [{ page: ROUTES.PASSWORD_SUCCESS, reason: "password" }],
        "password"
      );
      navigate(ROUTES.PASSWORD_SUCCESS, { replace: true });
    } else {
      alert(t("resetPassword.errorFields"));
    }
  };

  return (
    <AuthContentContainer
      title={t("resetPassword.title")}
      subtitle={t("resetPassword.subtitle")}
    >
      <MCFormWrapper
        schema={ResetPasswordSchema((key) => t(key))}
        onSubmit={handleSubmit}
        defaultValues={{
          password: resetPassword.password,
          confirmPassword: resetPassword.confirmPassword,
        }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            name="password"
            type="password"
            label={t("resetPassword.passwordLabel")}
            placeholder={t("resetPassword.passwordPlaceholder")}
          />
          <MCInput
            name="confirmPassword"
            type="password"
            label={t("resetPassword.confirmPasswordLabel")}
            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
          />
        </div>
        <AuthFooterContainer
          continueButtonProps={{
            children: t("footer.continue"),
          }}
          backButtonProps={{
            onClick: () => navigate("/auth/verify-email", { replace: true }),
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default ResetPasswordPage;
