import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Hospital } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Center {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Props {
  centers: Center[];
}

const DoctorHealthCentersSection = ({ centers }: Props) => {
  const { t } = useTranslation("doctor");
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="inline-flex items-center gap-2">
            <Hospital className="w-5 h-5" />
            {t("profile.centers.title", "Centros de Salud")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {centers.map((center) => (
            <li key={center.id}>
              <div className="font-semibold">{center.name}</div>
              <div className="text-sm">{center.address}</div>
              <div className="text-xs text-muted-foreground">
                {center.phone}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DoctorHealthCentersSection;
