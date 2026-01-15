import { useState } from "react";
import MCButton from "@/shared/components/forms/MCButton";
import MCInput from "@/shared/components/forms/MCInput";
import MCFormWrapper from "@/shared/components/forms/MCFormWrapper";
import MCSelect from "@/shared/components/forms/MCSelect";
import MCTextArea from "@/shared/components/forms/MCTextArea";
import { X, BookHeart, Heart } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const ClinicalHistorySchema = z.object({});

const ALLERGY_OPTIONS = [
  { value: "pollen", label: "Polen" },
  { value: "penicillin", label: "Penicilina" },
  { value: "nuts", label: "Nueces" },
  { value: "latex", label: "Látex" },
  { value: "aspirin", label: "Aspirina" },
];

function ClinicalHistory() {
  const { t } = useTranslation("patient");

  // Estado de alergias
  const [allergies, setAllergies] = useState<string[]>([
    "pollen",
    "penicillin",
  ]);
  const [selectedAllergy, setSelectedAllergy] = useState<string | undefined>();

  // Estado de condiciones
  const [conditions, setConditions] = useState<string[]>([
    t(
      "clinicalHistory.defaultCondition1",
      "Tengo la presión alta desde hace 5 años"
    ),
    t(
      "clinicalHistory.defaultCondition2",
      "Soy diabético y me controlo con pastillas"
    ),
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  // Handlers de alergias
  const handleAddAllergy = (value: string) => {
    if (!allergies.includes(value)) setAllergies([...allergies, value]);
    setSelectedAllergy(undefined);
  };
  const handleRemoveAllergy = (value: string) =>
    setAllergies(allergies.filter((a) => a !== value));

  // Handlers de condiciones
  const handleRemoveCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditingValue("");
    }
  };
  const handleAddCondition = () => {
    setEditingIndex(conditions.length);
    setEditingValue("");
    setConditions([...conditions, ""]);
  };
  const handleEditCondition = (idx: number) => {
    setEditingIndex(idx);
    setEditingValue(conditions[idx]);
  };
  const handleConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditingValue(e.target.value);
  const handleConditionBlur = (e?: React.FocusEvent<HTMLTextAreaElement>) => {
    if (editingIndex !== null) {
      const updated = [...conditions];
      updated[editingIndex] = editingValue.trim();
      if (!editingValue.trim()) updated.splice(editingIndex, 1);
      setConditions(updated);
      setEditingIndex(null);
      setEditingValue("");
      if (e) e.target.blur();
    }
  };

  // Submit (puedes conectar con tu store aquí)
  const handleSubmit = () => {
    // Aquí puedes guardar los datos en tu store o backend
  };

  return (
    <MCFormWrapper
      schema={ClinicalHistorySchema}
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 flex flex-col gap-6"
    >
      {/* Alerta */}
      <div className="border rounded-xl bg-red-100 p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-red-700 font-semibold text-lg">
          <BookHeart className="text-xl" />
          {t("clinicalHistory.importantTitle", "Historial Clínico Importante")}
        </div>
        <div className="text-red-700 text-base">
          {t(
            "clinicalHistory.importantDescription",
            "Mantén actualizada tu información médica para recibir una atención más segura y personalizada."
          )}
        </div>
      </div>
      {/* Alergias */}
      <div>
        <h2 className="text-2xl font-semibold text-red-700 mb-2">
          {t("clinicalHistory.allergies", "Alergias")}
        </h2>
        <div className="border-2 border-dotted border-red-300 rounded-xl p-4 mb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {allergies.map((a) => {
              const label =
                ALLERGY_OPTIONS.find((opt) => opt.value === a)?.label || a;
              return (
                <div
                  key={a}
                  className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white rounded-full text-base font-medium"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Heart className="w-4 h-4 mb-0.5"></Heart> <p>{label}</p>
                  </div>

                  <MCButton
                    variant="delete"
                    size="s"
                    onClick={() => handleRemoveAllergy(a)}
                    className="ml-1 rounded-full p-0.5"
                    aria-label={t(
                      "clinicalHistory.removeAllergy",
                      "Eliminar alergia"
                    )}
                  >
                    <X size={18} />
                  </MCButton>
                </div>
              );
            })}
          </div>
        </div>
        {/* Selector de agregar alergias fuera del recuadro */}
        <div className="mb-1 text-lg font-medium text-primary">
          {t("clinicalHistory.addAllergy", "Agregar Alergias")}
        </div>
        <MCSelect
          key={allergies.length}
          name="allergy"
          searchable={true}
          className="mb-4"
          placeholder={t("clinicalHistory.selectAllergy")}
          options={ALLERGY_OPTIONS.filter(
            (opt) => !allergies.includes(opt.value)
          )}
          onChange={(value) => {
            if (typeof value === "string") handleAddAllergy(value);
          }}
        />
      </div>
      {/* Condiciones */}
      <div>
        <h2 className="text-2xl font-semibold text-orange-500 mb-2">
          {t("clinicalHistory.conditions", "Condiciones")}
        </h2>
        <div className="border-2 border-dotted border-orange-300 rounded-xl p-4 flex flex-col gap-3 mb-4">
          {conditions.map((cond, idx) =>
            editingIndex === idx ? (
              <div key={idx} className="flex items-center gap-2">
                <MCTextArea
                  name={`condition_${idx}`}
                  className="border-2 border-orange-400 rounded-xl px-4 py-2 text-base transition-all focus:border-orange-500"
                  value={editingValue}
                  onBlur={handleConditionBlur}
                  onChange={handleConditionChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConditionBlur();
                    }
                  }}
                  placeholder={t(
                    "clinicalHistory.conditionPlaceholder",
                    "Describe tu condición"
                  )}
                />
                <MCButton
                  size="s"
                  onClick={() => handleRemoveCondition(idx)}
                  className="ml-1 rounded-full p-0.5 bg-transparent hover:bg-accent/70"
                  aria-label={t(
                    "clinicalHistory.removeCondition",
                    "Eliminar condición"
                  )}
                >
                  <X size={18} className="text-white" />
                </MCButton>
              </div>
            ) : cond ? (
              <div
                key={idx}
                className="flex items-center gap-2 bg-accent-xl px-4 py-2 text-base cursor-pointer border-2 border-orange-200 rounded-xl hover:border-orange-300 transition-all"
                onClick={() => handleEditCondition(idx)}
              >
                <span className="flex-1">{cond}</span>
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleRemoveCondition(idx);
                  }}
                  className="rounded-full p-1"
                  aria-label={t(
                    "clinicalHistory.removeCondition",
                    "Eliminar condición"
                  )}
                >
                  <X size={18} />
                </button>
              </div>
            ) : null
          )}
        </div>
        <MCButton
          variant="secondary"
          className="w-full rounded-4xl h-12 sm:h-[60px] px-3 sm:px-5 text-lg border-primary/50 text-primary font-medium focus:ring-0 focus:outline-none"
          size="l"
          onClick={handleAddCondition}
        >
          {t("clinicalHistory.addCondition", "Agregar Condición")}
        </MCButton>
      </div>
    </MCFormWrapper>
  );
}

export default ClinicalHistory;
