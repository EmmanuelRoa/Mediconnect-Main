import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import { Video, MapPin } from "lucide-react";
import MCButton from "../forms/MCButton";

export type AppointmentStatus =
  | "scheduled"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  clientName: string;
  date: Date;
  clientImage?: string;
  service: string;
  startTime: string;
  endTime: string;
  isVirtual: boolean;
  status: AppointmentStatus;
}

interface AppointmentCardProps {
  appointment: Appointment;
  index: number;
}

export function AppointmentCard({ appointment, index }: AppointmentCardProps) {
  const initials = appointment.clientName
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Botones según estado y tipo
  const renderButtons = () => {
    const { status, isVirtual } = appointment;
    if (status === "scheduled" || status === "pending") {
      return (
        <div className="flex w-fit gap-2">
          <MCButton variant="outline" size="s" className="rounded-full">
            Reschedule
          </MCButton>
          <MCButton variant="outlineDelete" size="s" className="rounded-full">
            Cancel
          </MCButton>
        </div>
      );
    }
    if (status === "in_progress") {
      if (isVirtual) {
        return (
          <div className="flex w-fit gap-2">
            <MCButton size="s" className="rounded-full">
              Join
            </MCButton>
            <MCButton variant="outline" size="s" className="rounded-full">
              View details
            </MCButton>
          </div>
        );
      }
      // presencial
      return (
        <div className="bg-red-400 w-full">
          <MCButton variant="outline" size="s" className="rounded-full w-full">
            View details
          </MCButton>
        </div>
      );
    }
    // completed o cancelled
    return (
      <div className="w-full">
        <MCButton variant="outline" size="s" className="rounded-full w-full">
          View details
        </MCButton>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="flex items-center justify-between p-2 rounded-xl bg-none "
    >
      <div className="flex items-center gap-4">
        {appointment.clientImage ? (
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={appointment.clientImage}
              alt={appointment.clientName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ) : (
          <MCUserAvatar size={56} name={appointment.clientName} />
        )}
        <div className="flex flex-col">
          <h4 className="font-display text-lg font-semibold text-foreground">
            {appointment.clientName}
          </h4>
          <p className="text-sm text-muted-foreground">{appointment.service}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>
              {appointment.startTime} - {appointment.endTime}
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="flex items-center gap-1">
              {appointment.isVirtual ? (
                <>
                  <Video className="h-3.5 w-3.5" />
                  Virtual
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  In-person
                </>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-fit">{renderButtons()}</div>
    </motion.div>
  );
}
