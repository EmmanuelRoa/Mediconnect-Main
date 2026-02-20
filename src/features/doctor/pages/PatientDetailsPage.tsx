import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import {
  SlidersHorizontal,
  FolderClock,
  Calendar,
  Clock,
  MapPin,
  User,
  Ellipsis,
} from "lucide-react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import MCAppointmentsStatus from "@/shared/components/tables/MCAppointmentsStatus";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/shared/ui/empty";
import MedicalPrescriptionDialog from "@/features/patient//components/appoiments/MedicalPrescriptionDialog";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import FilterHistoryAppointments from "@/features/patient/components/filters/FilterHistoryAppointments";
import AppointmentActions from "@/features/patient/components/appoiments/AppointmentActions";
import FilterMyAppointments from "@/features/doctor/components/filters/FilterMyAppoinments";

// Add the interface for upcoming appointment filters
interface UpcomingFilters {
  status: string;
  appointmentType: string;
  specialty: string;
  service: string;
  dateRange?: [Date, Date];
}

// Add the HistoryFilters interface
interface HistoryFilters {
  services: string[];
  dateRange?: [Date, Date];
  timeRange: string[];
  locations: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockPatient = {
  id: "p-3",
  name: "Edwin Lopez",
  since: "15 de Enero, 2025",
  age: "45 años",
  blood: "O+",
  height: "175 cm",
  weight: "80 kg",
  email: "edwin.lopez@email.com",
  phone: "809-432-9532",
  coverImage:
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&auto=format&fit=crop",
  avatar: "https://randomuser.me/api/portraits/men/13.jpg",
  allergies: ["Penicilina (produce erupción cutánea)"],
  conditions: [
    "Apendicectomía en 2010.",
    "Antecedentes familiares de diabetes tipo 2.",
  ],
};

const mockHistory = [
  {
    id: "1",
    service: "Control de Presión",
    date: "15 de Mayo, 2024",
    time: "10:00 AM",
    place: "Clínica Santo Domingo",
  },
  {
    id: "2",
    service: "Evaluación Metabólica",
    date: "20 de Marzo, 2024",
    time: "9:30 AM",
    place: "Clínica Santo Domingo",
  },
  {
    id: "3",
    service: "Consulta General",
    date: "10 de Enero, 2024",
    time: "11:00 AM",
    place: "Clínica Norte",
  },
  {
    id: "4",
    service: "Revisión de Condición",
    date: "5 de Noviembre, 2023",
    time: "3:00 PM",
    place: "Clínica Santo Domingo",
  },
];

const mockUpcoming = [
  {
    id: "1",
    service: "Control de rutina",
    specialty: "Endocrinología",
    date: "15 Mar, 2025",
    time: "10:00 AM – 10:45 AM",
    location: "Clínica Santo Domingo",
    appointmentType: "in_person" as const,
    status: "scheduled" as const,
    doctorId: "doctor-1", // Added doctorId
  },
  {
    id: "2",
    service: "Análisis de seguimiento",
    specialty: "Endocrinología",
    date: "20 Abr, 2025",
    time: "2:30 PM – 3:15 PM",
    location: "Virtual",
    appointmentType: "virtual" as const,
    status: "pending" as const,
    doctorId: "doctor-1", // Added doctorId
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <h3 className="font-medium text-primary/75 mb-1">{label}</h3>
      <p className="text-primary font-medium">{value}</p>
    </div>
  );
}

function PersonalTab() {
  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* Datos Personales */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-4">
          Datos Personales
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <InfoField label="Nombre Completo" value={mockPatient.name} />
          <InfoField label="Edad" value={mockPatient.age} />
          <InfoField label="Sangre" value={mockPatient.blood} />
          <InfoField label="Altura" value={mockPatient.height} />
          <InfoField label="Peso" value={mockPatient.weight} />
        </div>
      </section>

      {/* Contacto */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-4">
          Información de Contacto
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoField label="Email" value={mockPatient.email} />
          <InfoField label="Teléfono" value={mockPatient.phone} />
        </div>
      </section>

      {/* Médica */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-4">
          Información Médica
        </h2>
        <div className="flex flex-col gap-4">
          {/* Alergias */}
          <div>
            <h3 className="font-medium mb-1 text-red-700">Alergias</h3>
            <div className="max-h-32 overflow-y-auto">
              <ul className="list-disc ml-5">
                {mockPatient.allergies.map((al, i) => (
                  <li key={i} className="font-medium text-primary">
                    {al}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Condiciones */}
          <div>
            <h3 className="font-medium mb-1 text-orange-500">Condiciones</h3>
            <div className="max-h-32 overflow-y-auto">
              <ul className="list-disc ml-5">
                {mockPatient.conditions.map((cond, i) => (
                  <li key={i} className="font-medium text-primary">
                    {cond}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HistoryCard({
  historyItem,
  index,
  active,
  onClick,
}: {
  historyItem: (typeof mockHistory)[0];
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <MedicalPrescriptionDialog
      appointmentId={historyItem.id}
      historyId={historyItem.id}
    >
      <div
        className={`flex flex-col md:flex-row bg-accent/30 dark:bg-primary/50 rounded-2xl w-full gap-4 justify-starts p-4 items-center cursor-pointer transition
          hover:bg-accent/50 dark:hover:bg-primary/30 
          ${active ? "ring-2 ring-primary/60 bg-accent/60 dark:bg-primary/50" : "opacity-40 hover:opacity-100"}
        `}
        onClick={onClick}
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <FolderClock className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-primary">
            {historyItem.service}
          </p>
          <p className="text-xs text-primary/70 mt-0.5">
            {historyItem.date} · {historyItem.time} · {historyItem.place}
          </p>
        </div>
      </div>
    </MedicalPrescriptionDialog>
  );
}

function HistoryTab() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState<HistoryFilters>({
    services: [],
    timeRange: [],
    locations: [],
    dateRange: undefined,
  });

  const handleFiltersChange = (newFilters: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const activeFiltersCount =
    filters.services.length +
    filters.timeRange.length +
    filters.locations.length +
    (filters.dateRange ? 1 : 0);

  const handleClearFilters = () => {
    setFilters({
      services: [],
      timeRange: [],
      locations: [],
      dateRange: undefined,
    });
  };

  // Filter the history based on active filters
  const filteredHistory = mockHistory.filter((histItem) => {
    // Filter by services
    if (
      filters.services.length > 0 &&
      !filters.services.includes(histItem.service)
    ) {
      return false;
    }

    // Filter by locations
    if (
      filters.locations.length > 0 &&
      !filters.locations.includes(histItem.place)
    ) {
      return false;
    }

    // Filter by time range
    if (filters.timeRange.length > 0) {
      const itemTime = histItem.time;
      const hour = parseInt(itemTime.split(":")[0]);
      const isPM = itemTime.toLowerCase().includes("pm");
      const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour;

      const timeMatches = filters.timeRange.some((range) => {
        if (range === "morning" && adjustedHour >= 6 && adjustedHour < 12)
          return true;
        if (range === "afternoon" && adjustedHour >= 12 && adjustedHour < 18)
          return true;
        if (range === "evening" && adjustedHour >= 18 && adjustedHour <= 24)
          return true;
        return false;
      });

      if (!timeMatches) return false;
    }

    // Filter by date range
    if (filters.dateRange) {
      // Convert Spanish date format to parseable format
      const dateStr = histItem.date.replace(" de ", " ").replace(",", "");
      const itemDate = new Date(dateStr);
      const [startDate, endDate] = filters.dateRange;

      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 mb-4 flex-wrap gap-4 md:flex md:items-center md:justify-between">
        <div className="flex flex-1 justify-between items-center gap-2">
          <h3 className="text-xl font-semibold text-primary">
            Historial de consultas
          </h3>
          {mockHistory.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredHistory.length} de {mockHistory.length} consultas
            </span>
          )}
        </div>
        <MCFilterPopover
          activeFiltersCount={activeFiltersCount}
          onClearFilters={handleClearFilters}
        >
          <FilterHistoryAppointments
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </MCFilterPopover>
      </div>

      {/* Cambios aquí: scroll y separación */}
      <div
        className={`
          flex flex-col gap-5
          ${filteredHistory.length > 5 ? "max-h-[480px] overflow-y-auto pr-2" : ""}
          transition-all
        `}
      >
        {filteredHistory.length > 0 ? (
          filteredHistory.map((h, index) => (
            <HistoryCard
              key={h.id}
              historyItem={h}
              index={index}
              active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))
        ) : mockHistory.length > 0 ? (
          <Empty className="py-12">
            <EmptyContent>
              <EmptyMedia>
                <FolderClock size={48} className="text-primary/20" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No se encontraron resultados</EmptyTitle>
                <EmptyDescription>
                  Ajusta los filtros para ver más consultas.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        ) : (
          <Empty className="py-12">
            <EmptyContent>
              <EmptyMedia>
                <FolderClock size={48} className="text-primary/20" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Sin historial disponible</EmptyTitle>
                <EmptyDescription>
                  Este paciente no tiene historial de consultas.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}

function UpcomingTab() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<UpcomingFilters>({
    status: "all",
    appointmentType: "all",
    specialty: "all",
    service: "all",
    dateRange: undefined,
  });

  const handleFiltersChange = (newFilters: Partial<UpcomingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const activeFiltersCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.appointmentType !== "all" ? 1 : 0) +
    (filters.specialty !== "all" ? 1 : 0) +
    (filters.service !== "all" ? 1 : 0) +
    (filters.dateRange ? 1 : 0);

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      appointmentType: "all",
      specialty: "all",
      service: "all",
      dateRange: undefined,
    });
  };

  // Filter the upcoming appointments
  const filteredUpcoming = mockUpcoming.filter((apt) => {
    // Filter by status
    if (filters.status !== "all" && apt.status !== filters.status) {
      return false;
    }

    // Filter by appointment type
    if (
      filters.appointmentType !== "all" &&
      apt.appointmentType !== filters.appointmentType
    ) {
      return false;
    }

    // Filter by specialty
    if (
      filters.specialty !== "all" &&
      apt.specialty.toLowerCase().replace(/\s+/g, "-") !== filters.specialty
    ) {
      return false;
    }

    // Filter by service
    if (
      filters.service !== "all" &&
      apt.service.toLowerCase().replace(/\s+/g, "-") !== filters.service
    ) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange) {
      // Convert date string to Date object for comparison
      const aptDate = new Date(
        apt.date.replace(/(\d{1,2})\s(\w{3}),?\s(\d{4})/, "$2 $1, $3"),
      );
      const [startDate, endDate] = filters.dateRange;

      if (aptDate < startDate || aptDate > endDate) {
        return false;
      }
    }

    return true;
  });

  if (mockUpcoming.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyContent>
          <EmptyMedia>
            <Calendar size={48} className="text-primary/20" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Sin citas próximas</EmptyTitle>
            <EmptyDescription>
              Este paciente no tiene citas programadas.
            </EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 mb-4 flex-wrap gap-4 md:flex md:items-center md:justify-between">
        <div className="flex flex-1 justify-between items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">Próximas Citas</h2>
          {mockUpcoming.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredUpcoming.length} de {mockUpcoming.length} citas
            </span>
          )}
        </div>
        <MCFilterPopover
          activeFiltersCount={activeFiltersCount}
          onClearFilters={handleClearFilters}
        >
          <FilterMyAppointments
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </MCFilterPopover>
      </div>

      <div
        className={`
          flex flex-col gap-4
          ${filteredUpcoming.length > 4 ? "max-h-[480px] overflow-y-auto pr-2" : ""}
          transition-all
        `}
      >
        {filteredUpcoming.length > 0 ? (
          filteredUpcoming.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col md:flex-row bg-accent/30 dark:bg-primary/5 border border-primary/15 rounded-2xl w-full gap-4 justify-starts p-4 items-center cursor-pointer transition
              hover:bg-accent/50 dark:hover:bg-primary/8"
            >
              {/* Icono */}
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {apt.service}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {apt.specialty}
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {apt.date} · {apt.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {apt.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    {apt.appointmentType === "virtual"
                      ? "Virtual"
                      : "Presencial"}
                  </span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <MCAppointmentsStatus status={apt.status} />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-bg-btn-secondary rounded-full transition-colors hover:bg-primary/10 active:bg-primary/20 group"
                    >
                      <Ellipsis className="h-4 w-4 text-primary group-hover:text-primary/80 group-active:text-primary/60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent isTablet placement="left">
                    <AppointmentActions
                      appointment={{
                        id: apt.id,
                        doctorId: apt.doctorId,
                        appointmentType: apt.appointmentType,
                        status: apt.status,
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))
        ) : mockUpcoming.length > 0 ? (
          <Empty className="py-12">
            <EmptyContent>
              <EmptyMedia>
                <Calendar size={48} className="text-primary/20" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No se encontraron resultados</EmptyTitle>
                <EmptyDescription>
                  Ajusta los filtros para ver más citas.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        ) : (
          <Empty className="py-12">
            <EmptyContent>
              <EmptyMedia>
                <Calendar size={48} className="text-primary/20" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Sin citas próximas</EmptyTitle>
                <EmptyDescription>
                  Este paciente no tiene citas programadas.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function PatientDetailsPage() {
  const { patientId } = useParams();
  const isMobile = useIsMobile();

  // In real usage: fetch patient by patientId
  const patient = mockPatient;

  return (
    <MCDashboardContent mainWidth="w-[100%]">
      <div className="bg-background border border-primary/15 rounded-4xl overflow-hidden shadow-sm w-full mx-auto">
        {/* Cover */}
        <div className="relative h-36 sm:h-44 w-full">
          <img
            src={patient.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Avatar */}
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <Avatar className="w-32 h-32 border-4 border-card shadow-lg">
              <AvatarImage
                src={patient.avatar}
                alt={patient.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Header */}
        <div className="pt-18 pb-4 text-center px-4">
          <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paciente desde: {patient.since}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-8 pb-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList variant="line" className="w-full justify-center ">
              <TabsTrigger value="personal" className="text-base px-6 py-3">
                Información Personal
              </TabsTrigger>
              <TabsTrigger value="history" className="text-base px-6 py-3">
                Historial
              </TabsTrigger>
              <TabsTrigger value="appointments" className="text-base px-6 py-3">
                Próximas Citas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalTab />
            </TabsContent>
            <TabsContent value="history">
              <HistoryTab />
            </TabsContent>
            <TabsContent value="appointments">
              <UpcomingTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default PatientDetailsPage;
