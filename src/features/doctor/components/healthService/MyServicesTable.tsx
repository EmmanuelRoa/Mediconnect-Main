import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Star } from "lucide-react";
import MCServicesStatus from "@/shared/components/tables/MCServicesStatus";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/ui/pagination";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import ServicesActions from "./ServicesActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
const PAGE_SIZE = 15;

interface Service {
  id: string;
  servicio: string;
  especialidad: string;
  ubicacion: string | string[]; // <-- puede ser string o array de strings
  tipo: string;
  precio: string;
  duracion: string;
  rating: number;
  estado: string;
  imagen: string;
}

interface MyServicesTableProps {
  services?: Service[];
}

function MyServicesTable({ services = [] }: MyServicesTableProps) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(services.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedData = services.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Servicio</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.imagen ? (
                      <div className="h-16 w-16 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                        <Avatar className="h-16 w-16 rounded-full overflow-hidden">
                          <AvatarImage
                            src={row.imagen}
                            alt={row.servicio}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {row.servicio
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : null}
                    <span className="font-medium">{row.servicio}</span>
                  </div>
                </TableCell>
                <TableCell>{row.especialidad}</TableCell>
                <TableCell>
                  {Array.isArray(row.ubicacion) ? (
                    row.ubicacion.length > 1 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="underline cursor-pointer">
                              {row.ubicacion[0]} +{row.ubicacion.length - 1}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex flex-col gap-1">
                              {row.ubicacion.map((u, idx) => (
                                <span key={idx}>{u}</span>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span>{row.ubicacion[0]}</span>
                    )
                  ) : (
                    <span>{row.ubicacion}</span>
                  )}
                </TableCell>
                <TableCell>{row.tipo}</TableCell>
                <TableCell>{row.precio}</TableCell>
                <TableCell>{row.duracion}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Star
                      size={16}
                      fill="#F7B500"
                      className="text-yellow-400 mb-0.5"
                    />
                    <span className="font-medium">{row.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <MCServicesStatus
                    variant="default"
                    status={row.estado === "Activo" ? "active" : "inactive"}
                  />
                </TableCell>
                <TableCell>
                  <ServicesActions
                    status={row.estado === "Activo" ? "active" : "inactive"}
                    onView={() => alert(`Ver servicio ${row.id}`)}
                    onEdit={() => alert(`Editar servicio ${row.id}`)}
                    onDeactivate={() => alert(`Desactivar servicio ${row.id}`)}
                    onActivate={() => alert(`Activar servicio ${row.id}`)}
                    onDelete={() => alert(`Eliminar servicio ${row.id}`)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No hay servicios registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default MyServicesTable;
