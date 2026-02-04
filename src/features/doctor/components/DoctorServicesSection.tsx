import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import MCButton from "@/shared/components/forms/MCButton";
import { useTranslation } from "react-i18next";
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  type: "presencial" | "virtual";
  image: string;
}

interface Props {
  services: Service[];
}

function DoctorServicesSection({ services }: Props) {
  const { t } = useTranslation("doctor");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "presencial" | "virtual"
  >("all");

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || service.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {t("profile.services.title")}
        </CardTitle>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("profile.services.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {t("profile.services.filter.all")}
            </Button>
            <Button
              variant={filterType === "presencial" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("presencial")}
            >
              {t("profile.services.filter.inPerson")}
            </Button>
            <Button
              variant={filterType === "virtual" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("virtual")}
            >
              {t("profile.services.filter.virtual")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    service.type === "virtual"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {service.type === "virtual" ? "Virtual" : "Presencial"}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {service.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {service.price}
                    </span>
                  </div>
                  {service.type === "presencial" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{t("profile.services.inPerson")}</span>
                    </div>
                  )}
                </div>

                <MCButton
                  variant="primary"
                  size="sm"
                  className="w-full rounded-full"
                >
                  {t("profile.services.bookAppointment")}
                </MCButton>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("profile.services.noResults")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DoctorServicesSection;
