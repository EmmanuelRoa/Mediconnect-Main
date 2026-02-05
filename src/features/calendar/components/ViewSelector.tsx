import { CalendarDays, Calendar, List, LayoutGrid } from "lucide-react";
import type { CalendarView } from "@/types/CalendarTypes";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface ViewSelectorProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export const ViewSelector = ({
  currentView,
  onViewChange,
}: ViewSelectorProps) => {
  const { t } = useTranslation("common");
  const isMobile = useIsMobile();

  const views: { id: CalendarView; label: string; icon: React.ReactNode }[] = [
    {
      id: "month",
      label: t("calendar.month"),
      icon: <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" />,
    },
    {
      id: "week",
      label: t("calendar.week"),
      icon: <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />,
    },
    {
      id: "day",
      label: t("calendar.day"),
      icon: <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />,
    },
    {
      id: "list",
      label: t("calendar.list"),
      icon: <List className="w-3 h-3 sm:w-4 sm:h-4" />,
    },
  ];

  if (isMobile) {
    return (
      <div className="grid grid-cols-4 gap-1 bg-muted p-1 rounded-xl w-full">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              currentView === view.id
                ? "bg-primary text-background shadow-sm"
                : "bg-primary/5 text-primary/70 hover:text-foreground"
            }`}
          >
            {view.icon}
            <span className="truncate">{view.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentView === view.id
              ? "bg-primary text-background shadow-sm"
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
