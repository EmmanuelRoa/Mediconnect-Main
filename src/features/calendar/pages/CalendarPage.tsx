import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { CalendarView, Appointment } from "@/types/CalendarTypes";
import { mockAppointments } from "@/data/mockAppointments";

import { ViewSelector } from "../components/ViewSelector";
import { MonthView } from "../components/MonthView";
import { WeekView } from "../components/WeekView";
import { DayView } from "../components/DayView";
import { ListView } from "../components/ListView";
import { AppointmentDetails } from "../components/AppointmentDetails";
import MCButton from "@/shared/components/forms/MCButton";

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [view, setView] = useState<CalendarView>("month");

  const navigatePrevious = () => {
    switch (view) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (view === "month") {
      setCurrentDate(date);
      setView("day");
    }
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const getTitle = () => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM 'de' yyyy", { locale: es });
      case "week":
        return `Semana del ${format(currentDate, "d 'de' MMMM", { locale: es })}`;
      case "day":
        return format(currentDate, "EEEE, d 'de' MMMM", { locale: es });
      default:
        return "Próximas citas";
    }
  };

  return (
    <div className="min-h-100vh bg-background rounded-4xl h-screen">
      <div className="flex h-[calc(100vh-40px)]">
        {/* Main content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold capitalize ">{getTitle()}</h1>
              {view !== "list" && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={navigatePrevious}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={navigateNext}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <MCButton variant="outline" size="s" onClick={goToToday}>
                Hoy
              </MCButton>
              <ViewSelector currentView={view} onViewChange={setView} />
            </div>
          </div>

          {/* Calendar y detalles juntos */}
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 flex flex-col">
              {/* Calendar views */}
              {view === "month" && (
                <MonthView
                  currentDate={currentDate}
                  appointments={mockAppointments}
                  onSelectDate={handleSelectDate}
                  onSelectAppointment={handleSelectAppointment}
                  selectedDate={selectedDate}
                />
              )}
              {view === "week" && (
                <WeekView
                  currentDate={currentDate}
                  appointments={mockAppointments}
                  onSelectDate={handleSelectDate}
                  onSelectAppointment={handleSelectAppointment}
                  selectedDate={selectedDate}
                />
              )}
              {view === "day" && (
                <DayView
                  currentDate={currentDate}
                  appointments={mockAppointments}
                  onSelectAppointment={handleSelectAppointment}
                />
              )}
              {view === "list" && (
                <ListView
                  appointments={mockAppointments}
                  onSelectAppointment={handleSelectAppointment}
                />
              )}
            </div>
            {/* Details panel */}
            <div className="w-[380px] rounded-4xl h-full overflow-y-auto ml-4">
              <AppointmentDetails
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
