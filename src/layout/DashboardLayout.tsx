import { Outlet, useLocation } from "react-router-dom";
import MCNavbar from "@/shared/navigation/MCNavbar";
import MCNavbarMobile from "@/shared/navigation/MCMobileNavbar";
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import { useEffect } from "react";

function DashboardLayout() {
  const location = useLocation();
  const setIsAppointmentInProgress = useAppointmentStore(
    (state) => state.setIsAppointmentInProgress,
  );
  const resetAppointment = useAppointmentStore(
    (state) => state.clearAppointments,
  );

  useEffect(() => {
    return () => {
      const currentPath = window.location.pathname;

      if (
        !currentPath.startsWith("/patient/schedule-appointment") &&
        !currentPath.startsWith("/search")
      ) {
        resetAppointment();
      }
    };
    // Add setIsAppointmentInProgress to dependency array for completeness
  }, [location.pathname, resetAppointment, setIsAppointmentInProgress]);

  return (
    <div className="min-h-screen px-4 py-6 bg-bg-btn-secondary flex flex-col gap-6">
      <div className="block md:hidden sticky top-0 z-30 animate-fade-in">
        <MCNavbarMobile />
      </div>

      <div className="hidden md:block sticky top-5 z-30 animate-fade-in">
        <MCNavbar />
      </div>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
