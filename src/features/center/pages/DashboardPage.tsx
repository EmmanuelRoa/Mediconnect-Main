import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/shared/ui/card";
import MCMetricCard from "@/shared/components/MCMetricCard";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";
import {
  UsersIcon,
  CalendarCheckIcon,
  StarIcon,
  StethoscopeIcon,
} from "lucide-react";
import MCTablesLayouts from "@/shared/components/tables/MCTablesLayouts";
import AreaChart from "../components/dashboard/AreaChart";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import MCFilterSelect from "@/shared/components/filters/MCFilterSelect";
import PieServices from "../components/dashboard/PieServices";
import StaffTable from "../components/dashboard/StaffTable";
import FilterStaff from "../filters/FilterStaff";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import MCGeneratePDF from "@/shared/components/MCGeneratePDF";

const especialidadesData = [
  { name: "Cardiología", value: 85, color: "hsl(var(--chart-1))" },
  { name: "Pediatría", value: 72, color: "hsl(var(--chart-2))" },
  { name: "Dermatología", value: 58, color: "hsl(var(--chart-3))" },
  { name: "Neurología", value: 45, color: "hsl(var(--chart-4))" },
  { name: "Medicina Interna", value: 68, color: "hsl(var(--chart-5))" },
  { name: "Otros", value: 84, color: "hsl(var(--chart-6))" },
];

type DateRangeType = "week" | "month" | "3months" | "year" | "all";

function DashboardPage() {
  const isMobile = useIsMobile();
  const { t } = useTranslation("center");
  const [dateRange, setDateRange] = useState<DateRangeType>("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [staffFilters, setStaffFilters] = useState({
    specialty: "",
    rating: "",
    joinDate: { from: null as Date | null, to: null as Date | null },
  });
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    availability: "",
  });

  const resetFilters = () => {
    setFilters({
      specialty: "",
      location: "",
      availability: "",
    });
  };

  const resetStaffFilters = () => {
    setStaffFilters({
      specialty: "",
      rating: "",
      joinDate: { from: null, to: null },
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) => value !== "" && value !== null && value !== undefined,
    ).length;
  };

  const getActiveStaffFiltersCount = () => {
    let count = 0;
    if (staffFilters.specialty && staffFilters.specialty !== "") count++;
    if (staffFilters.rating && staffFilters.rating !== "") count++;
    if (staffFilters.joinDate.from || staffFilters.joinDate.to) count++;
    return count;
  };

  // Search component para la tabla
  const searchComponent = (
    <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
      <MCFilterInput
        placeholder="Buscar médico..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
    </div>
  );

  // Filter component para la tabla
  const filterComponent = (
    <FilterStaff
      filters={staffFilters}
      onFiltersChange={setStaffFilters}
      onClearFilters={resetStaffFilters}
      activeFiltersCount={getActiveStaffFiltersCount()}
    />
  );

  // PDF generator component
  const pdfGeneratorComponent = (
    <MCPDFButton
      onClick={async () => {
        const medicalStaff = [
          {
            doctor: "Dra. María González",
            especialidad: "Dermatología",
            fechaConexion: "23 de oct de 2025",
            citasTotales: 130,
            calificacion: 4.8,
            estado: "Activo",
          },
          {
            doctor: "Dr. Carlos Rodríguez",
            especialidad: "Cardiología",
            fechaConexion: "15 de sep de 2025",
            citasTotales: 98,
            calificacion: 4.9,
            estado: "Activo",
          },
          {
            doctor: "Dra. Ana Martínez",
            especialidad: "Pediatría",
            fechaConexion: "10 de ago de 2025",
            citasTotales: 156,
            calificacion: 4.7,
            estado: "Inactivo",
          },
        ];

        await MCGeneratePDF({
          columns: [
            { title: "Doctor", key: "doctor" },
            { title: "Especialidad", key: "especialidad" },
            { title: "Fecha Conexión", key: "fechaConexion" },
            { title: "Citas Totales", key: "citasTotales" },
            { title: "Calificación", key: "calificacion" },
            { title: "Estado", key: "estado" },
          ],
          data: medicalStaff,
          fileName: "equipo-medico",
          title: "Equipo de Atención Médica",
          subtitle: "Centro Médico - Staff",
        });
      }}
    />
  );

  return (
    <motion.main {...fadeInUp} className="min-h-screen">
      <div className="flex flex-col gap-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
          <MCMetricCard
            title="Total de Médicos"
            icon={<StethoscopeIcon />}
            value={412}
            subtitle="Cantidad total de médicos"
            percentage="12%"
            bordered
          />
          <MCMetricCard
            title="Especialidades Cubiertas"
            icon={<UsersIcon />}
            value={12}
            subtitle="Cantidad total de especialidades"
            percentage="8%"
            bordered
          />
          <MCMetricCard
            title="Citas esta Semana"
            icon={<CalendarCheckIcon />}
            value={156}
            subtitle="Cantidad total de citas"
            percentage="15%"
            bordered
          />
          <MCMetricCard
            title="Valoración Promedio"
            icon={<StarIcon />}
            value="4.8"
            subtitle="De todos los médicos"
            percentage="5%"
            bordered
          />
        </div>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4">
          {/* Growth Chart */}
          <Card className="rounded-2xl md:rounded-4xl min-h-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-4">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Crecimiento de Médicos Afiliados
              </h2>
              <div className="w-full sm:w-auto">
                <MCFilterPopover
                  activeFiltersCount={getActiveFiltersCount()}
                  onClearFilters={resetFilters}
                  compact
                >
                  <MCFilterSelect
                    name="dateRange"
                    options={[
                      { label: "Semana", value: "week" },
                      { label: "Mes", value: "month" },
                      { label: "3 Meses", value: "3months" },
                      { label: "Año", value: "year" },
                      { label: "Todo", value: "all" },
                    ]}
                    value={dateRange}
                    onChange={(value) => setDateRange(value as DateRangeType)}
                  />
                </MCFilterPopover>
              </div>
            </div>
            <div className="h-[250px] sm:h-[325px] w-full">
              <AreaChart dateRange={dateRange} />
            </div>
          </Card>

          {/* Specialties Pie Chart */}
          <Card className="rounded-2xl md:rounded-4xl min-h-0 h-[400px] lg:h-full overflow-hidden flex">
            <PieServices
              data={especialidadesData}
              title="Distribución por Especialidad"
            />
          </Card>
        </section>

        {/* Staff Table */}
        <Card className="rounded-2xl md:rounded-4xl min-h-[400px] overflow-hidden">
          <MCTablesLayouts
            titleSize="text-2xl"
            isDashboard
            title="Tu equipo de atención"
            searchComponent={searchComponent}
            filterComponent={filterComponent}
            pdfGeneratorComponent={pdfGeneratorComponent}
            tableComponent={
              <StaffTable
                searchTerm={searchTerm}
                filters={staffFilters}
                onClearFilters={resetStaffFilters}
                onClearSearch={() => setSearchTerm("")}
              />
            }
          />
        </Card>
      </div>
    </motion.main>
  );
}

export default DashboardPage;
