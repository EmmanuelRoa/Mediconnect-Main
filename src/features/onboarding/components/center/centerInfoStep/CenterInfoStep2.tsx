import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { useAppStore } from "@/stores/useAppStore";
import { CenterLocationInfoSchema } from "@/schema/OnbordingSchema";
import MapSelectLocation from "@/shared/components/maps/MapSelectLocation";

type CenterInfoStep2Props = {
  children?: React.ReactNode;
  onValidationChange?: (isValid: boolean) => void;
  onNext?: () => void;
};

function CenterInfoStep2({
  children,
  onValidationChange,
  onNext,
}: CenterInfoStep2Props) {
  const centerOnboardingData = useAppStore(
    (state) => state.centerOnboardingData
  );
  const setCenterField = useAppStore((state) => state.setCenterField);

  const handleSubmit = (data: any) => {
    onValidationChange?.(true);
    onNext?.();
  };

  const handleLocationDetails = (details: {
    address: string;
    neighborhood: string;
    zipCode: string;
    province?: string;
    municipality?: string;
  }) => {
    setCenterField?.("address", details.address);
    if (details.province) setCenterField?.("province", details.province);
    if (details.municipality)
      setCenterField?.("municipality", details.municipality);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Ubicación del centro
        </h1>
        <p className="text-primary/60 text-sm sm:text-base">
          Complete la información de ubicación de su centro
        </p>
      </div>

      <div className="h-[350px] mb-6">
        <MapSelectLocation
          onChange={(lat, lng) =>
            setCenterField?.("coordinates", {
              latitude: lat,
              longitude: lng,
            })
          }
          onLocationDetails={handleLocationDetails}
        />
      </div>

      <MCFormWrapper
        schema={CenterLocationInfoSchema((t) => t)}
        onSubmit={handleSubmit}
        defaultValues={centerOnboardingData}
        onValidationChange={onValidationChange}
        key={`${centerOnboardingData?.address}-${centerOnboardingData?.province}-${centerOnboardingData?.municipality}`}
      >
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MCInput
              name="address"
              label="Dirección"
              placeholder="Calle, número, sector, ciudad"
              onChange={(e) => setCenterField?.("address", e.target.value)}
            />
            <MCInput
              name="province"
              label="Provincia"
              placeholder="Ej: Santo Domingo"
              onChange={(e) => setCenterField?.("province", e.target.value)}
            />
          </div>

          <MCInput
            name="municipality"
            label="Municipio"
            placeholder="Ej: Santo Domingo Este"
            onChange={(e) => setCenterField?.("municipality", e.target.value)}
          />
        </div>
        {children}
      </MCFormWrapper>
    </div>
  );
}

export default CenterInfoStep2;
