import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { MCModalBase } from "@/shared/components/MCModalBase";
import PersonalIdentificationStep1 from "./PersonalIdentificationStep1";
import PersonalIdentificationStep2 from "./PersonalIdentificationStep2";

type PersonalIdentificationDialogProps = {
  children?: React.ReactNode;
};

export function PersonalIdentificationDialogTrigger({
  children,
}: PersonalIdentificationDialogProps) {
  return <>{children}</>;
}

function PersonalIdentificationDialog({
  children,
}: PersonalIdentificationDialogProps) {
  return (
    <MCModalBase
      id="personal-identification-dialog"
      size="lg"
      trigger={children}
      typeclose="Arrow"
      
    >
      <Tabs defaultValue="identityDocument" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="identityDocument"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Datos personales
          </TabsTrigger>
          <TabsTrigger
            value="professionalInfo"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Información profesional
          </TabsTrigger>
        </TabsList>
        <TabsContent value="identityDocument">
          <PersonalIdentificationStep1 />
        </TabsContent>
        <TabsContent value="professionalInfo">
          <PersonalIdentificationStep2 />
        </TabsContent>
      </Tabs>
    </MCModalBase>
  );
}

export default PersonalIdentificationDialog;
