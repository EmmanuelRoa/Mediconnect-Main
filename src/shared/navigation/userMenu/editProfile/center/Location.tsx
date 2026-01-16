import MCButton from "@/shared/components/forms/MCButton";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MapSelectLocation from "@/shared/components/maps/MapSelectLocation";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useState, useEffect } from "react";
import { centerLocationSchema } from "@/schema/profile.schema";

interface LocationProps {
  onOpenChange?: (open: boolean) => void;
}

function Location({ onOpenChange }: LocationProps) {
  const { t } = useTranslation("center");
  const isMobile = useIsMobile();
  const centerLocation = useProfileStore((s) => s.centerLocation);
  const setCenterLocation = useProfileStore((s) => s.setCenterLocation);

  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setFormKey((prev) => prev + 1);
  }, [centerLocation]);

  const handleLocationDetails = (details: {
    address: string;
    neighborhood?: string;
    zipCode?: string;
    province?: string;
    municipality?: string;
  }) => {
    setCenterLocation({
      ...centerLocation,
      address: details.address,
      province: details.province || "",
      municipality: details.municipality || "",
      coordinates: centerLocation?.coordinates || { latitude: 0, longitude: 0 },
    });
  };

  const handleMapChange = (lat: number, lng: number) => {
    setCenterLocation({
      ...centerLocation,
      address: centerLocation?.address || "",
      province: centerLocation?.province || "",
      municipality: centerLocation?.municipality || "",
      coordinates: { latitude: lat, longitude: lng },
    });
  };

  const handleSubmit = (data: any) => {
    setCenterLocation({
      ...centerLocation,
      ...data,
      coordinates: centerLocation?.coordinates,
    });
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          {t("locationForm.title", "Location of the Health Center")}
        </h1>
        <p className="text-primary/60 text-sm sm:text-base">
          {t(
            "locationForm.subtitle",
            "Select the exact location and fill in the address details."
          )}
        </p>
      </div>

      <div className="h-[350px] mb-6">
        <MapSelectLocation
          value={{
            lat: centerLocation?.coordinates?.latitude || 0,
            lng: centerLocation?.coordinates?.longitude || 0,
          }}
          onChange={handleMapChange}
          onLocationDetails={handleLocationDetails}
        />
      </div>

      <MCFormWrapper
        schema={centerLocationSchema(t)}
        onSubmit={handleSubmit}
        defaultValues={centerLocation || undefined}
        key={formKey}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MCInput
            name="address"
            label={t("locationForm.addressLabel", "Address")}
            placeholder={t(
              "locationForm.addressPlaceholder",
              "Street, number, etc."
            )}
          />
          <MCInput
            name="province"
            label={t("locationForm.provinceLabel", "Province")}
            placeholder={t("locationForm.provincePlaceholder", "Province")}
          />
        </div>
        <MCInput
          name="municipality"
          label={t("locationForm.municipalityLabel", "Municipality")}
          placeholder={t(
            "locationForm.municipalityPlaceholder",
            "Municipality"
          )}
        />

        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-3 mt-4`}
        >
          <MCButton
            variant="primary"
            size="m"
            type="submit"
            className={isMobile ? "w-full" : ""}
          >
            {t("profileForm.saveChanges", "Save Changes")}
          </MCButton>
          {onOpenChange && (
            <MCButton
              variant="secondary"
              size="m"
              onClick={() => onOpenChange(false)}
              className={isMobile ? "w-full" : ""}
            >
              {t("profileForm.cancel", "Cancel")}
            </MCButton>
          )}
        </div>
      </MCFormWrapper>
    </div>
  );
}

export default Location;
