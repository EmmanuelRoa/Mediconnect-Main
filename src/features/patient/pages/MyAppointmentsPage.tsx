import React, { useState, useMemo } from "react";
import { MyAppointmentsCards } from "../components/appoiments/MyAppointmentsCards";
import { MyAppointmentsTable } from "../components/appoiments/MyAppointmentsTable";
import MCTablesLayouts from "@/shared/components/tables/MCTablesLayouts";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/ui/pagination";

// Interfaz de cita
export interface Appointment {
  id: string;
  doctorName: string;
  doctorAvatar: string;
  doctorSpecialty: string;
  evaluationType: string;
  date: string;
  time: string;
  description?: string;
  appointmentType: "virtual" | "in_person";
  location?: string;
  status: "scheduled" | "pending" | "in_progress" | "completed" | "cancelled";
}

// Datos de ejemplo
const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Daniel Ramírez",
    doctorSpecialty: "Terapeuta",
    doctorAvatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Cardíaca Integral",
    date: "28 Oct, 2025",
    time: "10:30 AM",
    appointmentType: "in_person",
    location: "Av. Sarasota, Plaza Médica Sarasota",
    status: "scheduled",
  },
  {
    id: "2",
    doctorName: "Mariana López",
    doctorSpecialty: "Terapeuta",
    doctorAvatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Cardíaca Integral",
    date: "28 Oct, 2025",
    time: "10:30 AM",
    appointmentType: "in_person",
    location: "Av. Sarasota, Plaza Médica Sarasota",
    status: "pending",
  },
  {
    id: "3",
    doctorName: "Santiago Pérez",
    doctorSpecialty: "Terapeuta",
    doctorAvatar:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Cardíaca Integral",
    date: "28 Oct, 2025",
    time: "10:30 AM",
    appointmentType: "virtual",
    status: "in_progress",
  },
  {
    id: "4",
    doctorName: "Dr. Cristoforo Criparni",
    doctorSpecialty: "Ginecología",
    doctorAvatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Cardíaca Integral",
    description:
      "Consulta virtual para diagnóstico de hipertensión y control de ritmo cardíaco.",
    date: "28 Oct, 2025",
    time: "10:30 AM",
    appointmentType: "in_person",
    location: "Av. Sarasota, Plaza Médica Sarasota",
    status: "scheduled",
  },
  {
    id: "5",
    doctorName: "Sofía Torres",
    doctorSpecialty: "Terapeuta",
    doctorAvatar:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Cardíaca Integral",
    date: "28 Oct, 2025",
    time: "10:30 AM",
    appointmentType: "in_person",
    location: "Av. Sarasota, Plaza Médica Sarasota",
    status: "cancelled",
  },
  {
    id: "6",
    doctorName: "Alejandro Díaz",
    doctorSpecialty: "Terapeuta",
    doctorAvatar:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Cardíaca Integral",
    date: "28 Oct, 2025",
    time: "10:30 AM",
    appointmentType: "in_person",
    location: "Av. Sarasota, Plaza Médica Sarasota",
    status: "completed",
  },
  {
    id: "7",
    doctorName: "Dra. Laura Méndez",
    doctorSpecialty: "Cardiología",
    doctorAvatar:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Chequeo Cardiovascular",
    description: "Control rutinario de presión arterial y electrocardiograma.",
    date: "25 Oct, 2025",
    time: "09:00 AM",
    appointmentType: "in_person",
    location: "Centro Médico Nacional, Piso 3",
    status: "completed",
  },
  {
    id: "8",
    doctorName: "Dr. Roberto García",
    doctorSpecialty: "Medicina General",
    doctorAvatar:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Consulta General",
    date: "20 Oct, 2025",
    time: "14:00 PM",
    appointmentType: "virtual",
    status: "cancelled",
  },
  {
    id: "9",
    doctorName: "Dr. Pablo Herrera",
    doctorSpecialty: "Dermatología",
    doctorAvatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Consulta Dermatológica",
    date: "30 Oct, 2025",
    time: "11:00 AM",
    appointmentType: "in_person",
    location: "Clínica Central, Piso 2",
    status: "scheduled",
  },
  {
    id: "10",
    doctorName: "Dra. Carla Jiménez",
    doctorSpecialty: "Pediatría",
    doctorAvatar:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Chequeo Pediátrico",
    date: "31 Oct, 2025",
    time: "09:30 AM",
    appointmentType: "virtual",
    status: "pending",
  },
  {
    id: "11",
    doctorName: "Dr. Luis Martínez",
    doctorSpecialty: "Oftalmología",
    doctorAvatar:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Evaluación Visual",
    date: "01 Nov, 2025",
    time: "13:00 PM",
    appointmentType: "in_person",
    location: "Centro Óptico, Sala 5",
    status: "completed",
  },
  {
    id: "12",
    doctorName: "Dra. Patricia Gómez",
    doctorSpecialty: "Endocrinología",
    doctorAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Control de Diabetes",
    date: "02 Nov, 2025",
    time: "15:00 PM",
    appointmentType: "virtual",
    status: "cancelled",
  },
  {
    id: "13",
    doctorName: "Dr. Andrés Castro",
    doctorSpecialty: "Neurología",
    doctorAvatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    evaluationType: "Consulta Neurológica",
    date: "03 Nov, 2025",
    time: "16:30 PM",
    appointmentType: "in_person",
    location: "Hospital General, Consultorio 12",
    status: "in_progress",
  },
];

const ITEMS_PER_PAGE = 6;

function MyAppointmentsPage() {
  const [showCards, setShowCards] = useState(true);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historicalPage, setHistoricalPage] = useState(1);

  // Separar citas próximas e historial
  const { upcomingAppointments, historicalAppointments } = useMemo(() => {
    const upcoming = mockAppointments.filter((apt) =>
      ["scheduled", "pending", "in_progress"].includes(apt.status),
    );
    const historical = mockAppointments.filter((apt) =>
      ["completed", "cancelled"].includes(apt.status),
    );
    return {
      upcomingAppointments: upcoming,
      historicalAppointments: historical,
    };
  }, []);

  // Calcular paginación para citas próximas
  const upcomingPagination = useMemo(() => {
    const totalPages = Math.ceil(upcomingAppointments.length / ITEMS_PER_PAGE);
    const startIndex = (upcomingPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = upcomingAppointments.slice(startIndex, endIndex);

    return { totalPages, currentItems };
  }, [upcomingAppointments, upcomingPage]);

  // Calcular paginación para historial
  const historicalPagination = useMemo(() => {
    const totalPages = Math.ceil(
      historicalAppointments.length / ITEMS_PER_PAGE,
    );
    const startIndex = (historicalPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = historicalAppointments.slice(startIndex, endIndex);

    return { totalPages, currentItems };
  }, [historicalAppointments, historicalPage]);

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
  };

  const handleReschedule = (id: string) => {
    console.log("Reschedule:", id);
  };

  const handleCancel = (id: string) => {
    console.log("Cancel:", id);
  };

  const handleJoin = (id: string) => {
    console.log("Join:", id);
  };

  // Componente de paginación reutilizable
  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
  ) => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Función para renderizar una lista de citas
  const renderAppointments = (
    appointments: Appointment[],
    section: "upcoming" | "historical",
  ) => {
    const isUpcoming = section === "upcoming";
    const currentPage = isUpcoming ? upcomingPage : historicalPage;
    const pagination = isUpcoming ? upcomingPagination : historicalPagination;
    const setPage = isUpcoming ? setUpcomingPage : setHistoricalPage;

    if (appointments.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No hay citas en esta sección
        </p>
      );
    }

    if (showCards) {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pagination.currentItems.map((appointment) => (
              <MyAppointmentsCards
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onJoin={handleJoin}
              />
            ))}
          </div>
          {renderPagination(currentPage, pagination.totalPages, setPage)}
        </div>
      );
    }

    return <MyAppointmentsTable key={section} data={appointments} />;
  };

  // Botón para cambiar la vista
  const toggleView = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowCards((prev) => !prev)}
      className="gap-2"
    >
      {showCards ? (
        <>
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Tabla</span>
        </>
      ) : (
        <>
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Tarjetas</span>
        </>
      )}
    </Button>
  );

  const searchComponent = (
    <input
      placeholder="Buscar cita"
      className="border rounded-full px-4 py-2 w-full max-w-sm"
    />
  );

  const filterComponent = (
    <Button variant="outline" size="sm">
      Filtros
    </Button>
  );

  const pdfGeneratorComponent = (
    <Button variant="outline" size="sm">
      Descargar PDF
    </Button>
  );

  // Componente principal con ambas secciones
  const tableComponent = (
    <div className="space-y-8 bg-background">
      {/* Sección: Próximas Citas */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          Próximas Citas
        </h2>
        {renderAppointments(upcomingAppointments, "upcoming")}
      </section>

      {/* Sección: Historial de Citas */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          Historial de Citas
        </h2>
        {renderAppointments(historicalAppointments, "historical")}
      </section>
    </div>
  );

  return (
    <MCTablesLayouts
      title="Mis Citas"
      tableComponent={tableComponent}
      toogleView={toggleView}
      searchComponent={searchComponent}
      filterComponent={filterComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
    />
  );
}

export default MyAppointmentsPage;
