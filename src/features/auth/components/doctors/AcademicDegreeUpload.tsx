import { MCModalBase } from "@/shared/components/MCModalBase";

type AcademicDegreeUploadProps = {
  children?: React.ReactNode;
};

export function AcademicDegreeUploadTrigger({
  children,
  ...modalProps
}: AcademicDegreeUploadProps) {
  return (
    <MCModalBase
      id="academic-degree"
      title="Sube tu título académico"
      {...modalProps}
      trigger={children}
      size="full"
    >
      <div className="bg-red-300 overflow-y-auto ">
        <div className="flex flex-col items-center py-8 ">
          <div className="border rounded-lg p-4 w-full text-center">
            📄 Arrastra o selecciona tu archivo aquí
          </div>
        </div>{" "}
      </div>
    </MCModalBase>
  );
}
export default AcademicDegreeUploadTrigger;
