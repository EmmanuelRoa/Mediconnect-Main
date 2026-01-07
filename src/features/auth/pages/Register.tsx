import { useState } from "react";
import { useTranslation } from "react-i18next";
import PacienteIMG from "@/assets/Register-Patient.png";
import DoctorIMG from "@/assets/Register-Doctor.png";
import CenterIMG from "@/assets/Register-Center.png";
import AuthFooterContainer from "../components/AuthFooterContainer";
import AuthContentContainer from "../components/AuthContentContainer";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    key: "paciente",
    img: PacienteIMG,
    title: "Paciente",
    subtitle: "Tu salud, en un solo lugar.",
    desc: "Accede a consultas médicas y gestiona tu salud de forma digital",
    details: [
      "Consultas virtuales",
      "Historial médico",
      "Recordatorios de citas",
      "Recetas digitales",
    ],
  },
  {
    key: "doctor",
    img: DoctorIMG,
    title: "Doctor",
    subtitle: "Conecta con más pacientes.",
    desc: "Gestiona pacientes y consultas de manera eficiente y segura",
    details: [],
  },
  {
    key: "centro",
    img: CenterIMG,
    title: "Centro",
    subtitle: "Haz crecer tu centro de salud.",
    desc: "Administra recursos hospitalarios y personal médico integralmente",
    details: [],
  },
];

function Register() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  return (
    <AuthContentContainer
      title="Tu salud, tu rol, tu conexión."
      subtitle="Selecciona cómo quieres formar parte de MediConnect y empieza a transformar tu experiencia médica."
      containerClassName="max-w-6xl "
    >
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-5xl">
        {roles.map((role) => (
          <div
            key={role.key}
            className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300
              w-full sm:w-1/3 cursor-pointer group`}
            onMouseEnter={() => setHovered(role.key)}
            onMouseLeave={() => setHovered(null)}
            style={{ minWidth: 320, maxWidth: 400, height: 560 }}
          >
            <img
              src={role.img}
              alt={role.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay degradado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
            {/* Título y subtítulo */}
            <div className="absolute top-6 left-0 w-full px-6">
              <p className="text-white text-base font-medium mb-2 drop-shadow">
                {role.subtitle}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
              <h2 className="text-white text-2xl font-bold mb-2 drop-shadow">
                {role.title}
              </h2>
              <p className="text-white text-base mb-2 drop-shadow">
                {role.desc}
              </p>
              {hovered === role.key && role.details.length > 0 && (
                <ul className="text-white text-sm mb-2 list-disc pl-5">
                  {role.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="w-[75%]">
        <AuthFooterContainer
          continueButtonProps={{
            children: t("footer.continue"),
          }}
          backButtonProps={{
            onClick: () => navigate("/auth/verify-email", { replace: true }),
          }}
        />
      </div>
    </AuthContentContainer>
  );
}

export default Register;
