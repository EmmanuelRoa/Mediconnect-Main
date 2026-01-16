import MCInput from "@/shared/components/forms/MCInput";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCButton from "@/shared/components/forms/MCButton";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import { doctorExperienceSchema } from "@/schema/profile.schema";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "@/stores/useProfileStore";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useState } from "react";
import { X, Plus } from "lucide-react";

interface ExperienceFormData {
  hospital: string;
  position: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}

interface ExperienceProps {
  onOpenChange: (open: boolean) => void;
}

function Experience({ onOpenChange }: ExperienceProps) {
  const { t } = useTranslation("doctor");
  const isMobile = useIsMobile();

  const setDoctorExperience = useProfileStore(
    (state) => state.setDoctorExperience
  );
  const doctorExperience = useProfileStore((state) => state.doctorExperience);

  const [experiences, setExperiences] = useState<ExperienceFormData[]>(
    doctorExperience?.experiences || [
      {
        hospital: "",
        position: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
      },
    ]
  );

  const months = [
    { value: "01", label: t("months.january") },
    { value: "02", label: t("months.february") },
    { value: "03", label: t("months.march") },
    { value: "04", label: t("months.april") },
    { value: "05", label: t("months.may") },
    { value: "06", label: t("months.june") },
    { value: "07", label: t("months.july") },
    { value: "08", label: t("months.august") },
    { value: "09", label: t("months.september") },
    { value: "10", label: t("months.october") },
    { value: "11", label: t("months.november") },
    { value: "12", label: t("months.december") },
  ];

  const years = Array.from({ length: 50 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        hospital: "",
        position: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceFormData,
    value: string
  ) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
  };

  const handleSubmit = () => {
    try {
      const validatedData = doctorExperienceSchema(t).parse({ experiences });
      setDoctorExperience(validatedData);
      onOpenChange(false);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold`}>
          {t("experienceForm.title")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("experienceForm.description")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {experiences.map((experience, index) => (
          <div key={index} className="relative border rounded-lg p-4 bg-card">
            {/* Header con título y botón eliminar */}
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`${isMobile ? "text-base" : "text-lg"} font-medium`}
              >
                {t("experienceForm.experienceNumber", { number: index + 1 })}
              </h3>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label={t("experienceForm.removeExperience")}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Formulario de experiencia */}
            <div className="grid grid-cols-1 gap-4">
              <MCInput
                name={`position-${index}`}
                label={t("experienceForm.position")}
                type="text"
                placeholder={t("experienceForm.positionPlaceholder")}
                value={experience.position}
                onChange={(e) =>
                  updateExperience(index, "position", e.target.value)
                }
              />

              <MCInput
                name={`hospital-${index}`}
                label={t("experienceForm.organization")}
                type="text"
                placeholder={t("experienceForm.organizationPlaceholder")}
                value={experience.hospital}
                onChange={(e) =>
                  updateExperience(index, "hospital", e.target.value)
                }
              />

              {/* Fecha de inicio */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("experienceForm.startDate")}
                </label>
                <div
                  className={`grid ${
                    isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                  }`}
                >
                  <MCSelect
                    name={`startMonth-${index}`}
                    placeholder={t("experienceForm.selectMonth")}
                    options={months}
                    value={experience.startMonth}
                    onChange={(value) =>
                      updateExperience(index, "startMonth", value)
                    }
                  />
                  <MCSelect
                    name={`startYear-${index}`}
                    placeholder={t("experienceForm.selectYear")}
                    options={years}
                    value={experience.startYear}
                    onChange={(value) =>
                      updateExperience(index, "startYear", value)
                    }
                  />
                </div>
              </div>

              {/* Fecha de finalización */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  {t("experienceForm.endDate")}
                </label>
                <div
                  className={`grid ${
                    isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                  }`}
                >
                  <MCSelect
                    name={`endMonth-${index}`}
                    placeholder={t("experienceForm.selectMonth")}
                    options={months}
                    value={experience.endMonth}
                    onChange={(value) =>
                      updateExperience(index, "endMonth", value)
                    }
                  />
                  <MCSelect
                    name={`endYear-${index}`}
                    placeholder={t("experienceForm.selectYear")}
                    options={years}
                    value={experience.endYear}
                    onChange={(value) =>
                      updateExperience(index, "endYear", value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón agregar experiencia */}
      <MCButton
        variant="outline"
        size="m"
        onClick={addExperience}
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {t("experienceForm.addExperience")}
      </MCButton>

      {/* Botones de acción */}
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-3 mt-6`}>
        <MCButton
          variant="primary"
          size="m"
          onClick={handleSubmit}
          className={isMobile ? "w-full" : ""}
        >
          {t("experienceForm.saveChanges")}
        </MCButton>
        <MCButton
          variant="secondary"
          size="m"
          onClick={() => onOpenChange(false)}
          className={isMobile ? "w-full" : ""}
        >
          {t("experienceForm.cancel")}
        </MCButton>
      </div>
    </div>
  );
}

export default Experience;
