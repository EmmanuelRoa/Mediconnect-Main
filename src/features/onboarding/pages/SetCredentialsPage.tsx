import { useEffect } from "react";
import AuthContentContainer from "@/features/auth/components/AuthContentContainer";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import { CreatePasswordSchema } from "@/schema/OnbordingSchema";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
import { useNavigate } from "react-router-dom";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import type { PatientCreatePasswordSchemaType } from "@/types/OnbordingTypes";
import { useGlobalUIStore } from "@/stores/useGlobalUIStore";

function SetCredentialsPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const selectedRole = useAppStore((state) => state.selectedRole);
  const basicInfo = useAppStore((state) => state.patientOnboardingData);
  const setPatientOnboardingData = useAppStore(
    (state) => state.setPatientOnboardingData
  );
  const doctorBasicInfo = useAppStore((state) => state.doctorOnboardingData);
  const setDoctorOnboardingData = useAppStore(
    (state) => state.setDoctorOnboardingData
  );
  const centerBasicInfo = useAppStore((state) => state.centerOnboardingData);
  const setCenterOnboardingData = useAppStore(
    (state) => state.setCenterOnboardingData
  );
  const verifyEmail = useAppStore((state) => state.verifyEmail);
  const setAccessPage = useGlobalUIStore((state) => state.setAccessPage);

  useEffect(() => {
    // Validar verificación de email
    if (!verifyEmail?.verified) {
      navigate("/auth/email-verification", { replace: true });
      return;
    }

    if (selectedRole === "Patient") {
      if (
        !basicInfo?.name ||
        !basicInfo?.lastName ||
        !basicInfo?.identityDocument ||
        !basicInfo?.email
      ) {
        navigate("/auth/patient-onboarding/basic-info", { replace: true });
        return;
      }
    }

    if (selectedRole === "Doctor") {
      if (
        !doctorBasicInfo?.name ||
        !doctorBasicInfo?.lastName ||
        !doctorBasicInfo?.identityDocument ||
        !doctorBasicInfo?.email
      ) {
        navigate("/auth/doctor-onboarding/basic-info", { replace: true });
        return;
      }
    }

    if (selectedRole === "Center") {
      if (
        !centerBasicInfo?.name ||
        !centerBasicInfo?.address ||
        !centerBasicInfo?.rnc ||
        !centerBasicInfo?.email
      ) {
        navigate("/auth/center-onboarding/basic-info", { replace: true });
        return;
      }
    }

    if (!selectedRole) {
      navigate("/auth/register", { replace: true });
    }
  }, [
    verifyEmail,
    basicInfo,
    doctorBasicInfo,
    centerBasicInfo,
    selectedRole,
    navigate,
  ]);

  const handleSubmit = (data: PatientCreatePasswordSchemaType) => {
    if (selectedRole === "Patient" && setPatientOnboardingData && basicInfo) {
      setPatientOnboardingData({
        ...basicInfo,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: "Patient",
        name: basicInfo.name,
        lastName: basicInfo.lastName,
        identityDocument: basicInfo.identityDocument,
        email: basicInfo.email,
        urlImg: basicInfo.urlImg ?? undefined,
      });
      navigate("/auth/patient-onboarding/profile-photo", { replace: true });
    }

    if (
      selectedRole === "Doctor" &&
      setDoctorOnboardingData &&
      doctorBasicInfo
    ) {
      setDoctorOnboardingData({
        ...doctorBasicInfo,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: "Doctor",
        name: doctorBasicInfo.name,
        lastName: doctorBasicInfo.lastName,
        identityDocument: doctorBasicInfo.identityDocument,
        email: doctorBasicInfo.email,
        urlImg: doctorBasicInfo.urlImg ?? undefined,
      });
      setAccessPage(
        true,
        [{ page: "/auth/register-success", reason: "register" }],
        "register"
      );
      navigate("/auth/register-success", { replace: true });
    }

    if (
      selectedRole === "Center" &&
      setCenterOnboardingData &&
      centerBasicInfo
    ) {
      setCenterOnboardingData({
        ...centerBasicInfo,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: "Center",
        name: centerBasicInfo.name,
        address: centerBasicInfo.address,
        rnc: centerBasicInfo.rnc,
        email: centerBasicInfo.email,
        urlImg: centerBasicInfo.urlImg ?? undefined,
      });
      setAccessPage(
        true,
        [{ page: "/auth/register-success", reason: "register" }],
        "register"
      );
      navigate("/auth/register-success", { replace: true });
    }
  };

  // Obtener los datos y default values según el rol
  let defaultValues = { password: "", confirmPassword: "" };
  let backPath = "/auth/patient-onboarding/basic-info";

  if (selectedRole === "Doctor" && doctorBasicInfo) {
    defaultValues = {
      password: doctorBasicInfo.password || "",
      confirmPassword: doctorBasicInfo.confirmPassword || "",
    };
    backPath = "/auth/doctor-onboarding";
  } else if (selectedRole === "Center" && centerBasicInfo) {
    defaultValues = {
      password: centerBasicInfo.password || "",
      confirmPassword: centerBasicInfo.confirmPassword || "",
    };
    backPath = "/auth/center-onboarding";
  } else if (selectedRole === "Patient" && basicInfo) {
    defaultValues = {
      password: basicInfo.password || "",
      confirmPassword: basicInfo.confirmPassword || "",
    };
    backPath = "/auth/patient-onboarding/basic-info";
  }

  return (
    <AuthContentContainer
      title={t("setCredentialsPage.title")}
      subtitle={t("setCredentialsPage.subtitle")}
    >
      <MCFormWrapper
        onSubmit={handleSubmit}
        schema={CreatePasswordSchema((key) => t(key))}
        defaultValues={defaultValues}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            label={t("setCredentialsPage.passwordLabel")}
            name="password"
            type="password"
            placeholder={t("setCredentialsPage.passwordPlaceholder")}
          />
          <MCInput
            label={t("setCredentialsPage.confirmPasswordLabel")}
            name="confirmPassword"
            type="password"
            placeholder={t("setCredentialsPage.confirmPasswordPlaceholder")}
          />
        </div>
        <AuthFooterContainer
          backButtonProps={{
            onClick() {
              navigate(backPath, { replace: true });
            },
          }}
        />
      </MCFormWrapper>
    </AuthContentContainer>
  );
}

export default SetCredentialsPage;
