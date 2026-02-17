import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import MyServicesTable from "../components/healthService/MyServicesTable";
import MCTablesLayouts from "@/shared/components/tables/MCTablesLayouts";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import MCToogle from "@/shared/components/forms/MCToogle";
import { MCFilterPopover } from "@/shared/components/filters/MCFilterPopover";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/ui/pagination";
import MCGeneratePDF from "@/shared/components/MCGeneratePDF";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/shared/ui/empty";
import MCButton from "@/shared/components/forms/MCButton";
import {
  Filter,
  CalendarX,
  CheckCircle,
  Ban,
  Star,
  Layers,
} from "lucide-react";

import MCNewButton from "@/shared/components/forms/MCNewButton";
import { ROUTES } from "@/router/routes";

function AppointmentsPage() {
  return <div>AppointmentsPage</div>;
}

export default AppointmentsPage;
