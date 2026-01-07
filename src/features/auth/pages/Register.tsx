import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PacienteIMG from "@/assets/Register-Patient.png";
import DoctorIMG from "@/assets/Register-Doctor.png";
import CenterIMG from "@/assets/Register-Center.png";
import AuthFooterContainer from "../components/AuthFooterContainer";
import AuthContentContainer from "../components/AuthContentContainer";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Button } from "@/shared/ui/button";

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
    details: [
      "Gestión de pacientes",
      "Consultas virtuales y presenciales",
      "Acceso a historial médico",
      "Organización de agenda",
    ],
  },
  {
    key: "centro",
    img: CenterIMG,
    title: "Centro",
    subtitle: "Haz crecer tu centro de salud.",
    desc: "Administra recursos hospitalarios y personal médico integralmente",
    details: [
      "Gestión de personal médico",
      "Administración de recursos",
      "Control de citas y salas",
      "Reportes y estadísticas",
    ],
  },
];

function Register() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const detailsRefs = useRef<Record<string, HTMLUListElement | null>>({});

  useEffect(() => {
    // Solo anima si está en hover y NO está seleccionado
    if (hovered && detailsRefs.current[hovered] && selectedRole !== hovered) {
      const items = detailsRefs.current[hovered]?.querySelectorAll("li");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.22,
            ease: "power1.out",
            stagger: 0.08,
          }
        );
      }
    }
  }, [hovered, selectedRole]);

  return (
    <AuthContentContainer
      title="Tu salud, tu rol, tu conexión."
      subtitle="Selecciona cómo quieres formar parte de MediConnect y empieza a transformar tu experiencia médica."
      containerClassName="max-w-6xl "
    >
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-5xl">
        {roles.map((role) => {
          const isHovered = hovered === role.key;
          const isSelected = selectedRole === role.key;
          return (
            <div
              key={role.key}
              className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300
        w-full sm:w-1/3 cursor-pointer group
        ${
          isSelected
            ? "outline outline-8 outline-accent shadow-[0_0_40px_10px_rgba(0,180,255,0.5)]"
            : isHovered
            ? "outline outline-4 outline-accent shadow-2xl"
            : ""
        }
      `}
              onMouseEnter={() => setHovered(role.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelectedRole(role.key)}
              style={{ minWidth: 320, maxWidth: 400, height: 560 }}
            >
              <img
                src={role.img}
                alt={role.title}
                className={`w-full h-full object-cover transition-all duration-200`}
              />
              {/* Overlay degradado */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent ${
                  isHovered || isSelected
                    ? "opacity-from-black/40 via-black/20"
                    : ""
                }`}
              />
              {/* Título y subtítulo */}
              <div className="absolute top-6 left-0 w-full px-6">
                <p
                  className={`   ${
                    isSelected ? "font-bold text-" : ""
                  } text-white text-base font-medium mb-2 drop-shadow text-center transition-all duration-200
                     ${isSelected ? "font-bold text-xl" : ""}
            ${isHovered || isSelected ? "scale-105" : ""}
       `}
                >
                  {isSelected ? "Seleccionado" : role.subtitle}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
                <h2
                  className={`text-white text-2xl font-bold mb-2 drop-shadow transition-all duration-200
            ${isHovered || isSelected ? "scale-105" : ""}
          `}
                >
                  {role.title}
                </h2>
                <p
                  className={`text-white text-base mb-2 drop-shadow transition-all duration-200
            ${isHovered || isSelected ? "scale-105" : ""}
          `}
                >
                  {role.desc}
                </p>
                {(isHovered || isSelected) && role.details.length > 0 && (
                  <ul
                    ref={(el) => {
                      detailsRefs.current[role.key] = el;
                    }}
                    className="text-white text-sm mb-2 list-disc pl-5 transition-all duration-200"
                  >
                    {role.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-[75%]">
        <AuthFooterContainer
          continueButtonProps={{
            children: t("footer.continue"),
          }}
          backButtonProps={{
            disabled: true,
          }}
        />
      </div>
    </AuthContentContainer>
  );
}

export default Register;
