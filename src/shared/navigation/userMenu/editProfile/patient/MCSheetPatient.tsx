import { X, User, FileText, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useMemo, useState } from "react";
import { patientProfileSchema } from "@/schema/profile.schema";
import { useTranslation } from "react-i18next";
import PersonalInformation from "./personalInformation";
import ClinicalHistory from "./clinicalHistory";
import Insurance from "./insurance";

interface MCSheetPatientProps {
  onOpenChange: (open: boolean) => void;
}

const TAB_TITLES: Record<string, string> = {
  general: "Información General",
  historial: "Historial Clínico",
  seguros: "Seguros Médicos",
};

function MCSheetPatient({ onOpenChange }: MCSheetPatientProps) {
  const { t } = useTranslation("patient");
  const [activeTab, setActiveTab] = useState("general");

  // Generar el schema con la función de traducción
  const schema = useMemo(() => patientProfileSchema(t), [t]);

  return (
    <Tabs
      defaultValue="general"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full grid grid-cols-[35%_65%] min-h-full min-w-full"
    >
      <aside className="w-full h-full rounded-l-4xl bg-accent/30 border-r-3 border-accent py-6 m-0 flex flex-col gap-4">
        <div className="w-full px-10 mt-6 flex flex-col gap-2">
          <h1 className="text-xl font-medium">Editar Perfil</h1>
          <p className="text-base max-w-50 text-left">
            Modifica tu información personal y médica
          </p>
        </div>

        <TabsList className="flex flex-col gap-2 w-full justify-center items-center px-6 h-fit">
          <TabsTrigger value="general" className="text-md rounded-full w-full">
            <div className="flex items-center gap-2 p-2 rounded-full">
              <User className="h-6 w-6 stroke-2" />
              <span className="text-sm font-medium">Información General</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="historial"
            className="text-md rounded-full w-full"
          >
            <div className="flex items-center gap-2 p-2 rounded-full">
              <FileText className="h-6 w-6 stroke-2" />
              <span className="text-sm font-medium">Historial Clínico</span>
            </div>
          </TabsTrigger>

          <TabsTrigger value="seguros" className="text-md rounded-full w-full">
            <div className="flex items-center gap-2 p-2 rounded-full">
              <Shield className="h-6 w-6 stroke-2" />
              <span className="text-sm font-medium">Seguros</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </aside>

      <main className="w-full h-full overflow-y-auto">
        <div className="flex items-center justify-end p-2">
          <button
            className="rounded-full h-8 w-8 flex items-center border-none outline-none ring-none justify-center hover:bg-accent/70 focus:bg-accent active:scale-95 transition-all duration-200"
            aria-label="Cerrar"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-10 py-6">
          <div className="flex items-center border-b-2 border-border mb-6">
            <h2 className="text-2xl font-medium pb-2">
              {TAB_TITLES[activeTab]}
            </h2>
          </div>

          <TabsContent value="general" className="m-0 p-0">
            <PersonalInformation schema={schema} onOpenChange={onOpenChange} />
          </TabsContent>

          <TabsContent value="historial" className="m-0 p-0">
            <ClinicalHistory />
          </TabsContent>

          <TabsContent value="seguros" className="m-0 p-0">
            <Insurance />
          </TabsContent>
        </div>
      </main>
    </Tabs>
  );
}

export default MCSheetPatient;
