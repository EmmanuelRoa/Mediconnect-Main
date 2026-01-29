import React, { useState } from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import MCInput from "@/shared/components/forms/MCInput";
import { Search } from "lucide-react";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import MCButton from "@/shared/components/forms/MCButton";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";

// Badge component
type BadgeProps = {
  children: React.ReactNode;
  role: "PATIENT" | "DOCTOR" | "CENTER";
};

const Badge: React.FC<BadgeProps> = ({ children, role }) => (
  <span
    className={`px-4 py-1 rounded-full text-xs font-medium ${
      role === "PATIENT"
        ? "bg-blue-100 text-blue-800"
        : role === "DOCTOR"
          ? "bg-green-100 text-green-800"
          : "bg-purple-100 text-purple-800"
    }`}
  >
    {children}
  </span>
);

type UserRole = "PATIENT" | "DOCTOR" | "CENTER";

type BlockedUser = {
  id: number;
  name: string;
  userRole: UserRole;
  avatar: string;
};

const blockedUsers: BlockedUser[] = [
  {
    id: 1,
    name: "María González",
    userRole: "PATIENT",
    avatar:
      "https://i.pinimg.com/736x/ad/4b/28/ad4b28ca4a909fca01201660c00c83f2.jpg",
  },
  {
    id: 2,
    name: "Carlos Pérez",
    userRole: "DOCTOR",
    avatar: "",
  },
  {
    id: 3,
    name: "Hospital Dario Contreras",
    userRole: "CENTER",
    avatar: "",
  },
  {
    id: 4,
    name: "Hospital Dario Contreras",
    userRole: "CENTER",
    avatar: "",
  },
  {
    id: 5,
    name: "Hospital Dario Contreras",
    userRole: "CENTER",
    avatar:
      "https://i.pinimg.com/736x/ad/4b/28/ad4b28ca4a909fca01201660c00c83f2.jpg",
  },
  {
    id: 6,
    name: "Carlos Pérez",
    userRole: "DOCTOR",
    avatar:
      "https://i.pinimg.com/736x/ad/4b/28/ad4b28ca4a909fca01201660c00c83f2.jpg",
  },
  {
    id: 7,
    name: "Hospital Dario Contreras",
    userRole: "CENTER",
    avatar:
      "https://i.pinimg.com/736x/ad/4b/28/ad4b28ca4a909fca01201660c00c83f2.jpg",
  },
  // Puedes agregar hasta 15+ para probar la paginación
];

const USERS_PER_PAGE = 10;

function BlockedUsersPage() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredUsers = blockedUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <MCDashboardContent mainWidth={isMobile ? "w-full" : "max-w-4xl"}>
      <div
        className={`flex flex-col gap-6 items-center justify-center w-full mb-8 ${isMobile ? "px-4" : "px-0"}`}
      >
        <div
          className={`w-full flex flex-col gap-2 justify-center items-center ${isMobile ? "min-w-0" : "min-w-xl"}`}
        >
          <h1
            className={`${isMobile ? "text-3xl" : "text-5xl"} font-medium mb-2`}
          >
            Usuarios bloqueados
          </h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Administra las cuentas bloqueadas. Los usuarios bloqueados no pueden
            enviarte mensajes ni ver tu perfil.
          </p>
        </div>
      </div>
      <MCInput
        name="search"
        placeholder={" Buscar usuarios bloqueados"}
        icon={<Search size={16} />}
        value={search}
        onChange={handleSearch}
        className={isMobile ? "w-full" : "w-md"}
      />
      <hr className="border-t border-primary/15 w-full my-2" />

      <div
        className={`flex flex-col gap-6 ${isMobile ? "min-w-0" : "min-w-2xl"}`}
      >
        {paginatedUsers.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No hay usuarios bloqueados.
          </div>
        )}
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className={`flex flex-col sm:flex-row items-center justify-between border-b border-primary/15 py-6 gap-4`}
          >
            <div className="flex items-center gap-6 flex-1 w-full">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                {user.avatar && user.avatar !== "null" ? (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-2xl border border-primary/5 transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-2xl border border-primary/5">
                    <MCUserAvatar
                      name={user.name}
                      square
                      size={isMobile ? 64 : 80}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-medium truncate">
                    {user.name}
                  </span>
                  <Badge role={user.userRole}>
                    {user.userRole === "PATIENT"
                      ? "Paciente"
                      : user.userRole === "DOCTOR"
                        ? "Doctor"
                        : "Centro"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">Bloqueado</div>
              </div>
            </div>
            <MCButton
              size="sm"
              variant="outline"
              className="flex-shrink-0 w-full sm:w-auto"
            >
              Desbloquear
            </MCButton>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    page === 1
                      ? undefined
                      : () => setPage((p) => Math.max(1, p - 1))
                  }
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={
                    page === totalPages
                      ? undefined
                      : () => setPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </MCDashboardContent>
  );
}

export default BlockedUsersPage;
