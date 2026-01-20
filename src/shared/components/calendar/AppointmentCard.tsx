import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Video, MapPin } from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  clientImage?: string;
  service: string;
  startTime: string;
  endTime: string;
  isVirtual: boolean;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-sage-light">
          <AvatarImage
            src={appointment.clientImage}
            alt={appointment.clientName}
          />
          <AvatarFallback className="bg-sage-light text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
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
                  Presencial
                </>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {appointment.isVirtual ? (
          <Button variant="default" size="sm" className="rounded-full">
            Unirse
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              Cancelar
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Reprogramar
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
