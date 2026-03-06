import type { DoctorNearby } from "@/shared/navigation/userMenu/editProfile/doctor/services/doctor.types";
import type { Doctor, Provider } from "@/data/providers";
import { doctorService } from "@/shared/navigation/userMenu/editProfile/doctor/services";

/**
 * Maps API doctor data (with nested services) to UI Provider format
 * Each doctor from the API is transformed into one Provider entry
 * 
 * @param doctors - Array of doctors from the API (getDoctoresByDistance)
 * @returns Array of Provider objects (Doctor type) for the UI
 */
export const mapDoctorsToProviders = async (
  doctors: DoctorNearby[],
  language: string = "es"
): Promise<Provider[]> => {
  if (!doctors || doctors.length === 0) {
    return [];
  }

  const providers: Doctor[] = await Promise.all(
    doctors.map(async (doctor) => {
    // Extract primary specialty
    const primarySpecialty = doctor.especialidades.find((e) => e.es_principal);
    const mainSpecialtyName = primarySpecialty?.especialidades.nombre || "Sin especialidad";

    // Extract all specialty names
    const specialties = doctor.especialidades.map((e) => e.especialidades.nombre);

    // Extract modality from services
    const modalitySet = new Set<"Presencial" | "Virtual">();
    doctor.servicios.forEach((s) => {
      const modality = mapModalityToUI(s.modalidad);
      modality.forEach((m) => modalitySet.add(m));
    });
    const modality = Array.from(modalitySet);

    // Extract unique addresses from ubicaciones
    const addresses = doctor.servicios
      .map((u) => u.servicios_ubicaciones.map((su) => {
        return su.ubicacion.direccion;
      }))
      .flat();

    // Extract insurance names
    const insurances = Array.from(
      new Set(doctor.segurosAceptados.map((s) => s.seguro.nombre))
    );

    // Try to fetch availability for the doctor; fall back to placeholder on failure
    let availability = generateAvailabilityPlaceholder();
    try {
      const slotsResp = await doctorService.getDoctorSlotsAvailableInRange(
        doctor.usuarioId,
        new Date().toISOString().split("T")[0], // startDate: today
        5,
        {
          target: language || "es",
          source: language === "es" ? "en" : "es",
          translate_fields: "diaSemana,mes"
        }
      );

      if (slotsResp?.data && Array.isArray(slotsResp.data)) {
        availability = slotsResp.data.map((slot: any) => {
          const dayOfMonth = slot.fecha.split("-")[2];
          return {
            date: dayOfMonth,
            dayName: slot.diaSemana,
            slots: slot.totalSlotsLibres,
            month: slot.mes,
          };
        });
      }
    } catch (e) {
      // Keep placeholder on error
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch availability for doctor ID ${doctor.usuarioId}`, e);
    }

    // Default coordinates (TODO: extract from ubicaciones if available)
     const coordinates = doctor.servicios
      .map((u) => u.servicios_ubicaciones.map((su) => {
        return { lat: su.ubicacion.latitud, lng: su.ubicacion.longitud };
    })).flat();

    //Map languages
    const languages = doctor.idiomas.map((i) => i.nombre);

    
    return {
      id: doctor.usuarioId.toString(),
      type: "doctor",
      name: `${doctor.nombre} ${doctor.apellido}`,
      specialty: mainSpecialtyName,
      rating: Math.round(doctor.calificacionPromedio * 10) / 10,
      reviewCount: doctor.cantidadResenas,
      address: addresses.length > 0 ? addresses : ["Sin dirección"],
      languages: languages,
      insurances,
      phone: doctor.usuario.telefono || "",
      image: doctor.usuario.fotoPerfil || "",
      coordinates,
      modality,
      experience: doctor.anosExperiencia,
      specialties,
      bio: doctor.biografia || "",
      availability,
      connectionStatus: "not_connected",
      isFavorite: doctor.esFavorito,
      // Store additional data for filtering
      _rawDoctor: doctor, // Keep reference to raw doctor data for filtering
    } as Doctor & { _rawDoctor: DoctorNearby };
    })
  );

  return providers;
};

/**
 * Maps API modality string to UI modality array
 */
const mapModalityToUI = (
  modalidad: string
): ("Presencial" | "Virtual")[] => {
  const normalized = modalidad.toLowerCase();
  
  if (normalized.includes("mixed") || normalized.includes("mixta")) {
    return ["Presencial", "Virtual"];
  }
  if (normalized.includes("virtual") || normalized.includes("teleconsulta")) {
    return ["Virtual"];
  }
  if (normalized.includes("present") || normalized.includes("presencial")) {
    return ["Presencial"];
  }
  
  // Default to presencial if unknown
  return ["Presencial"];
};

/**
 * Generates placeholder availability data
 * TODO: Process actual horarios from service data
 */
const generateAvailabilityPlaceholder = () => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const today = new Date();

  return days.map((dayName, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    return {
      date: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
      dayName,
      slots: Math.floor(Math.random() * 15), // Placeholder
    };
  });
};
