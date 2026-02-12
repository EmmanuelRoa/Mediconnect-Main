import AuthFooterContainer from "@/features/auth/components/AuthFooterContainer";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCStepper from "@/shared/components/MCStepper";
import { useTranslation } from "react-i18next";
import ServiceTittleStep from "../components/healthService/createService/ServiceTittleStep";
import {
  MapPin,
  Image,
  Stethoscope,
  Calendar,
  CircleCheck,
} from "lucide-react";
import type { StepStatus } from "@/shared/components/MCStepper";

function CreateServicesPage() {
  const { t } = useTranslation("doctor");
  const steps = [
    { icon: <Stethoscope />, status: "process" as StepStatus },
    { icon: <Image />, status: "wait" as StepStatus },
    { icon: <Calendar />, status: "wait" as StepStatus },
    { icon: <MapPin />, status: "wait" as StepStatus },
    { icon: <CircleCheck />, status: "wait" as StepStatus },
  ];

  return (
    <MCDashboardContent create={true}>
      <div className="w-full flex flex-col items-center justify-center ">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-lg  text-center text-primary mt-1">
            Información Basica
          </h1>
          <span className="opacity-40">Paso 1 de 5</span>
        </div>
        <div className="w-full mt-4">
          <MCStepper items={steps}></MCStepper>
        </div>
      </div>
      <div>
        <ServiceTittleStep />
      </div>
      <div className="w-full py-4">
        <div className="w-full  px-4 sm:px-6"></div>
      </div>{" "}
      <AuthFooterContainer></AuthFooterContainer>
    </MCDashboardContent>
  );
}

export default CreateServicesPage;
