import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ChevronDown } from "lucide-react";
import { DropdownMenuTrigger } from "@/shared/animate-ui/components/radix/dropdown-menu";

interface UserData {
  name: string;
  email: string;
  avatar: string;
  initials: string;
  roleLabel: string;
}

interface MCUserMenuTriggerProps {
  userData: UserData;
  open: boolean;
}

export function MCUserMenuTrigger({ userData, open }: MCUserMenuTriggerProps) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className={`flex items-center justify-center gap-3 rounded-full w-full bg-transparent hover:bg-accent/80 outline-none border-none shadow-none ring-0 focus:ring-0 h-fit transition-colors ${
          open ? "bg-primary rounded-full text-primary" : ""
        }`}
      >
        <Avatar className="h-14 w-14 rounded-full shadow-lg transition-all">
          <AvatarImage
            src={userData.avatar}
            alt={userData.name}
            className="object-cover"
          />
          <AvatarFallback className="text-xl">
            {userData.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-start gap-3">
          <div className="flex flex-col items-start leading-tight text-left">
            <span
              className={`text-base font-semibold ${
                !open ? "text-primary" : "text-background"
              }`}
            >
              {userData.name}
            </span>
            <span
              className={`text-sm font-normal max-w-35 truncate ${
                !open ? "text-primary" : "text-background"
              }`}
              style={{ textOverflow: "clip" }}
              title={userData.email}
            >
              {userData.roleLabel}
            </span>
          </div>

          <div className="flex flex-col h-full w-full items-start justify-start">
            <ChevronDown
              className={`w-7 h-7 mt-0.5 stroke-2.5 transition-transform duration-200 ${
                open ? "rotate-180 text-background" : "text-primary"
              }`}
            />
          </div>
        </div>
      </Button>
    </DropdownMenuTrigger>
  );
}

export default MCUserMenuTrigger;
