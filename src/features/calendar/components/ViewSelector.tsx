import { CalendarDays, Calendar, List, LayoutGrid } from "lucide-react";
import type { CalendarView } from "@/types/CalendarTypes";

interface ViewSelectorProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const views: { id: CalendarView; label: string; icon: React.ReactNode }[] = [
  { id: "month", label: "Mes", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "week", label: "Semana", icon: <CalendarDays className="w-4 h-4" /> },
  { id: "day", label: "Día", icon: <Calendar className="w-4 h-4" /> },
  { id: "list", label: "Lista", icon: <List className="w-4 h-4" /> },
];

export const ViewSelector = ({
  currentView,
  onViewChange,
}: ViewSelectorProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentView === view.id
              ? "bg-primary  text-background shadow-sm"
              : "bg-primary/5 text-primary/70 hover:text-foreground"
          }`}
        >
          {view.icon}
          {view.label}
        </button>
      ))}
    </div>
  );
};
