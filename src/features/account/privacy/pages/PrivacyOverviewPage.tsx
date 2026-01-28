import React from "react";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import AccountActions, {
  type AccountAction,
} from "@/features/account/components/AccountActions";
import { ShieldCheck, MessageCircle, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PrivacyOverviewPage() {
  const navigate = useNavigate();

  const actions: AccountAction[] = [
    {
      id: "profile-privacy",
      title: "Privacidad del perfil",
      onClick: () => navigate("/privacy/profile"),
      icon: <ShieldCheck strokeWidth={1.5} />,
    },
    {
      id: "messages-privacy",
      title: "Mensajes y Comunicación",
      onClick: () => navigate("/privacy/messages"),
      icon: <MessageCircle strokeWidth={1.5} />,
    },
    {
      id: "blocked-users",
      title: "Usuarios Bloqueados",
      onClick: () => navigate("/privacy/blocked"),
      icon: <UserX strokeWidth={1.5} />,
    },
  ];

  return (
    <MCDashboardContent mainWidth="max-w-2xl">
      <div className="flex flex-col gap-6 items-center justify-center w-full mb-8">
        <div className="w-full min-w-xl flex flex-col gap-2 justify-center items-center">
          <h1 className="text-5xl font-medium mb-2">Privacidad y Seguridad</h1>
          <p className="text-muted-foreground text-base max-w-md text-center">
            Administra tu información, privacidad y seguridad para que
            MediConnect funcione mejor para ti
          </p>
        </div>
        <AccountActions items={actions} />
      </div>
    </MCDashboardContent>
  );
}

export default PrivacyOverviewPage;
