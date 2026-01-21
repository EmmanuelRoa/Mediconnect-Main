import { Heart, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

interface MedicalInfoCardProps {
  isMobile: boolean;
  age: number | string;
  bmi: number | string;
  height: number | string;
  weight: number | string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
}

const MedicalInfoCard = ({
  isMobile,
  age,
  bmi,
  height,
  weight,
  bloodType,
  allergies,
  conditions,
}: MedicalInfoCardProps) => (
  <Card className="animate-fade-in rounded-4xl border-0 shadow-md bg-background">
    <CardContent className={isMobile ? "p-4" : "p-2"}>
      <h2
        className={`mb-6 ${isMobile ? "text-lg" : "text-2xl"} font-semibold text-foreground`}
      >
        Información Médica
      </h2>
      <div
        className={`mb-6 grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-4`}
      >
        <div>
          <p className="text-xs text-muted-foreground">Edad</p>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-foreground`}
          >
            {age}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">IMC</p>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-foreground`}
          >
            {bmi}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Altura</p>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-foreground`}
          >
            {height}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Peso</p>
          <p
            className={`${isMobile ? "text-base" : "text-lg"} font-semibold text-foreground`}
          >
            {weight}
          </p>
        </div>
      </div>
      <div className="border-t border-muted my-4"></div>
      <div className="mb-4">
        <p className="text-xs text-muted-foreground">Tipo de sangre</p>
        <p
          className={`${isMobile ? "text-base" : "text-lg"} font-bold text-foreground`}
        >
          {bloodType}
        </p>
      </div>
      <div className="border-t border-muted my-4"></div>
      <div
        className={`${isMobile ? "max-h-64" : "max-h-48"} overflow-y-auto pr-2`}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <Heart className="h-4 w-4" />
            <span className="font-medium">Alergias</span>
          </div>
          {allergies.length > 0 ? (
            allergies.map((allergy, idx) => (
              <p key={idx} className="mt-1 text-sm text-muted-foreground">
                {allergy}
              </p>
            ))
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Sin alergias registradas
            </p>
          )}
        </div>
        <div className="border-t border-muted my-4"></div>
        <div>
          <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Condiciones</span>
          </div>
          {conditions.length > 0 ? (
            conditions.map((condition, idx) => (
              <p key={idx} className="mt-1 text-sm text-muted-foreground">
                {condition}
              </p>
            ))
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Sin condiciones registradas
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MedicalInfoCard;
