import React from "react";
import MCDashboardContentSimple from "@/shared/layout/MCDashboardContentSimple";
import MCTablesLayouts from "@/shared/components/tables/MCTablesLayouts";

function MyAppointmentsPage() {
  return (
    <MCDashboardContentSimple>
      <MCTablesLayouts
        title="My Appointments"
        metrics={[]} // Puedes pasar métricas si tienes
        searchComponent={null} // O tu componente de búsqueda
        filterComponent={null} // O tu componente de filtros
        tableComponent={<div>Table goes here</div>} // Tu tabla de citas
        toogleView={null} // O tu componente de vista alterna
        filtersInlineWithTitle={true} // Si quieres los filtros junto al título cuando no hay métricas
      />
    </MCDashboardContentSimple>
  );
}

export default MyAppointmentsPage;
