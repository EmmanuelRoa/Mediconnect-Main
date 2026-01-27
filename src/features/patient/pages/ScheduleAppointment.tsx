import { useTranslation } from "react-i18next";
import MCBackButton from "@/shared/components/forms/MCBackButton";
import MCButton from "@/shared/components/forms/MCButton";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import {
  Calendar,
  Clock,
  PersonStanding,
  Stethoscope,
  ShieldCheck,
  MapPinCheck,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapScheduleLocation from "@/shared/components/maps/MapScheduleLocation";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

function ScheduleAppointment() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);
  const appointmentDetails = useAppointmentStore((state) => state.appointment);
  const setAppointmentInProgress = useAppointmentStore(
    (state) => state.setIsAppointmentInProgress,
  );

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const isPatient = user?.role === "PATIENT";
  const hasAppointmentData =
    appointmentDetails?.date &&
    appointmentDetails?.time &&
    appointmentDetails?.selectedModality &&
    appointmentDetails?.numberOfSessions &&
    appointmentDetails?.reason &&
    appointmentDetails?.insuranceProvider;

  useEffect(() => {
    if (!isPatient || !hasAppointmentData) {
      navigate("/search", { replace: true });
    }
  }, [isPatient, hasAppointmentData, navigate]);

  // <-- NUEVO: Agregar este useEffect para asegurar que el scroll esté habilitado
  useEffect(() => {
    // Remover cualquier clase que bloquee el scroll
    document.body.style.overflow = "unset";
    document.body.style.paddingRight = "0px";
    document.documentElement.style.overflow = "unset";

    // Scroll al tope de la página
    window.scrollTo(0, 0);

    return () => {
      // Cleanup si es necesario
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, []);

  if (!isPatient || !hasAppointmentData) {
    return null;
  }

  // Handler para confirmar la cita
  const handleConfirmAppointment = () => {
    if (setAppointmentInProgress) {
      setAppointmentInProgress(true);
    }
  };

  return (
    <div
      className={`bg-background min-h-screen ${isMobile ? "py-4 px-4" : "py-10"} flex gap-4 rounded-4xl`}
    >
      <div
        className={`w-full ${isMobile ? "flex flex-col" : "grid grid-cols-[1fr_7fr_1fr]"} justify-items-center`}
      >
        <aside className={isMobile ? "w-full mb-4" : ""}>
          <MCBackButton onClick={() => navigate(-1)} />
        </aside>
        <main
          className={`${isMobile ? "w-full" : "max-w-2xl"} flex flex-col gap-4`}
        >
          <h1
            className={`${isMobile ? "text-2xl" : "text-3xl"} font-semibold text-primary`}
          >
            Confirmar Cita
          </h1>
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-[4.5fr_5.5fr]"} gap-4 items-start`}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=400&q=80"
                alt="Consulta médica"
                className={`w-full ${isMobile ? "h-48" : "h-60"} object-cover rounded-xl transition-transform duration-500 hover:scale-110`}
              />
            </div>
            <div>
              <h2
                className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-primary`}
              >
                Consulta dermatológica general
              </h2>
              <p className="text-primary opacity-75 mb-4">
                Evaluación completa de la piel para detectar y tratar manchas,
                acné, lunares u otras afecciones. Incluye diagnóstico inicial y
                recomendaciones personalizadas.
              </p>
            </div>
          </div>
          <div>
            <h4
              className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-primary`}
            >
              Política de cancelación y reprogramación flexible
            </h4>
            <p
              className={`text-primary opacity-75 ${isMobile ? "text-sm" : ""}`}
            >
              Puedes cancelar o reprogramar tu cita sin costo adicional si lo
              haces con al menos 4 horas de antelación. Nuestro objetivo es
              ofrecerte la mayor comodidad y flexibilidad en tu atención médica.
            </p>
          </div>
          <hr className="border-t border-primary opacity-15" />
          <div
            className={`flex ${isMobile ? "flex-flex gap-2 justify-between items-center" : "justify-between"}`}
          >
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-secondary" />
                <h5 className="font-semibold text-primary">Fecha</h5>
              </div>
              <div>
                <span className="text-primary opacity-75">
                  {appointmentDetails.date}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-secondary" />
                <h5 className="font-semibold text-primary">Horario</h5>
              </div>
              <div>
                <span className="text-primary opacity-75">
                  {appointmentDetails.time}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <PersonStanding size={20} className="text-secondary" />
                <h5 className="font-semibold text-primary">Pacientes</h5>
              </div>
              <div>
                <span className="text-primary opacity-75">
                  {appointmentDetails.numberOfSessions} Paciente(s)
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4
              className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-primary`}
            >
              Motivo de la consulta
            </h4>
            <p
              className={`text-primary opacity-75 ${isMobile ? "text-sm" : ""}`}
            >
              {appointmentDetails.reason}
            </p>
          </div>
          <hr className="border-t border-primary opacity-15" />
          <section>
            {appointmentDetails.selectedModality === "presencial" ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <MapPinCheck size={20} className="text-secondary mb-2" />
                  <h4
                    className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-primary mb-1`}
                  >
                    Ubicación
                  </h4>
                </div>
                <MapScheduleLocation
                  initialLocation={{
                    lat: 18.47267,
                    lng: -69.94101,
                  }}
                />
              </div>
            ) : (
              <div>
                <h4
                  className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-primary mb-1`}
                >
                  Plataforma para la consulta virtual
                </h4>
                <p
                  className={`text-primary opacity-75 ${isMobile ? "text-sm" : ""}`}
                >
                  La consulta se realizará a través de nuestra plataforma segura
                  de telemedicina. Recibirás un enlace por correo electrónico
                  antes de la cita.
                </p>
              </div>
            )}
          </section>
          <hr className="border-t border-primary opacity-15" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Stethoscope size={20} className="text-secondary" />
              <h4 className="text-primary font-semibold">Médico tratante</h4>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`relative overflow-hidden rounded-full border border-primary/5 ${isMobile ? "w-16 h-16" : "w-24 h-24"} mb-2`}
              >
                {!user.avatar ? (
                  <img
                    src="https://i.pinimg.com/736x/28/c4/8d/28c48d2fbae708baff8261b51e30627b.jpg"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    alt="Doctor"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full rounded-full">
                    <MCUserAvatar
                      name={user.name || "Médico"}
                      size={isMobile ? 64 : 128}
                      className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h3
                  className={`font-semibold text-primary ${isMobile ? "text-base" : "text-lg"}`}
                >
                  {user.name || "DR. CRISTIANO RONALDO"}
                </h3>
                <p
                  className={`text-primary opacity-75 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  Especialista en Medicina Interna
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={20} className="text-secondary" />
              <span
                className={`flex items-center text-primary ${isMobile ? "text-sm" : ""}`}
              >
                <p className="mr-2 font-semibold">Seguro médico:</p>
                {appointmentDetails.insuranceProvider}
              </span>
            </div>
          </div>
          <hr className="border-t border-primary opacity-15" />
          <div
            className={`w-full flex ${isMobile ? "flex-flex gap-2 justify-between items-center" : "justify-between items-center"}`}
          >
            <h1
              className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-primary`}
            >
              Total:
            </h1>
            <span
              className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-primary`}
            >
              RD$ 2,500.00
            </span>
          </div>
          <MCButton
            className="w-full"
            size={isMobile ? "xl" : "l"}
            variant="primary"
            onClick={handleConfirmAppointment} // <-- Añade el handler aquí
          >
            Confirmar cita
          </MCButton>
        </main>
        {!isMobile && <div />}
      </div>
    </div>
  );
}

export default ScheduleAppointment;
