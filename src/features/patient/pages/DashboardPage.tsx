import React from "react";

function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Bienvenido/a a tu Panel</h1>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Chats */}
        <section
          style={{
            flex: 1,
            minWidth: 300,
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h2>Chats</h2>
          <ul>
            <li>
              Dr. Juan Pérez - <button>Ver chat</button>
            </li>
            <li>
              Enfermera Ana Ruiz - <button>Ver chat</button>
            </li>
            <li>
              Soporte Vitalia - <button>Ver chat</button>
            </li>
          </ul>
        </section>
        {/* Próximas citas */}
        <section
          style={{
            flex: 1,
            minWidth: 300,
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h2>Próximas Citas</h2>
          <ul>
            <li>15/01/2026 - Consulta general</li>
            <li>20/01/2026 - Laboratorio</li>
          </ul>
        </section>
        {/* Historial médico */}
        <section
          style={{
            flex: 1,
            minWidth: 300,
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h2>Historial Médico</h2>
          <ul>
            <li>Consulta - 10/12/2025</li>
            <li>Vacuna - 01/11/2025</li>
          </ul>
        </section>
        {/* Recordatorios */}
        <section
          style={{
            flex: 1,
            minWidth: 300,
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <h2>Recordatorios</h2>
          <ul>
            <li>Tomar medicamento 8:00 AM</li>
            <li>Actualizar datos personales</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
