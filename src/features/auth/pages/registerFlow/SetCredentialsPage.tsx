import React, { useState } from "react";
import AuthContentContainer from "@/features/auth/components/AuthContentContainer";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCInput from "@/shared/components/forms/MCInput";
import MCButton from "@/shared/components/forms/MCButton";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAppStore } from "@/stores/useAppStore";
import { useNavigate } from "react-router-dom";
import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
const credentialsSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

function SetCredentialsPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const selectedRole = useAppStore((state) => state.selectedRole);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (selectedRole === "Patient") {
      navigate("/auth/patient-onboarding/profile-photo");
    }
  };

  return (
    <AuthContentContainer
      title={t("Establece tus credenciales")}
      subtitle={t(
        "Crea una contraseña segura para proteger tu información médica."
      )}
    >
      <MCFormWrapper
        onSubmit={handleSubmit}
        schema={credentialsSchema}
        className="flex flex-col items-center w-full"
      >
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <MCInput
            label={t("Contraseña")}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <MCInput
            label={t("Confirmar contraseña")}
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />{" "}
        </div>
      </MCFormWrapper>
      <AuthFooterContainer
        backButtonProps={{
          onClick() {
            navigate("/auth/patient-onboarding/basic-info");
          },
        }}
      ></AuthFooterContainer>
    </AuthContentContainer>
  );
}

export default SetCredentialsPage;
