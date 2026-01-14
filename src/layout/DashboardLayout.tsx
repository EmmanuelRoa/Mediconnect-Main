import { Outlet } from "react-router-dom";
import MCNavbar from "@/shared/navigation/navigation/AdminNavbar";
import MCNavbarMobile from "@/shared/navigation/navigation/AdminNavbarMobile";
function DashboardLayout() {
  return (
    <div className="p-8 bg-bg-btn-secondary  min-h-screen  flex flex-col gap-6">
      {/* Navbar móvil solo visible en pantallas pequeñas */}
      <div className="block md:hidden sticky top-0 z-30 animate-fade-in">
        <MCNavbarMobile />
      </div>
      {/* Navbar escritorio solo visible en pantallas medianas o mayores */}
      <div className="hidden md:block sticky top-5 z-30 animate-fade-in">
        <MCNavbar />
      </div>
      <div className="w-fill h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
