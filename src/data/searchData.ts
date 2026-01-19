// Datos mock para la búsqueda inteligente
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

export interface Specialty {
  id: string;
  name: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  popular: boolean;
}

export const specialties: Specialty[] = [
  { id: "1", name: "Dermatología" },
  { id: "2", name: "Diabetología" },
  { id: "3", name: "Dilatación y legrado" },
  { id: "4", name: "Diagnóstico por imagen" },
  { id: "5", name: "Cardiología" },
  { id: "6", name: "Neurología" },
  { id: "7", name: "Pediatría" },
  { id: "8", name: "Ginecología" },
  { id: "9", name: "Oftalmología" },
  { id: "10", name: "Psiquiatría" },
];

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Daniel Almonte",
    specialty: "Psicoterapeuta",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Derek Hernandez",
    specialty: "Psicoterapeuta",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Diego Ramirez",
    specialty: "Psicoterapeuta",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Dianna Troncoso",
    specialty: "Psicoterapeuta",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "María García",
    specialty: "Cardiología",
    image:
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Carlos López",
    specialty: "Neurología",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop&crop=face",
  },
];

export const insurancePlans: InsurancePlan[] = [
  { id: "1", name: "ARS Universal Plan Premium (PPO)", popular: true },
  { id: "2", name: "ARS Humano Más Salud (PPO)", popular: true },
  { id: "3", name: "ARS Monumental Plus", popular: true },
  { id: "4", name: "ARS Palic Platinum Care (PPO)", popular: true },
  { id: "5", name: "ARS Senasa Contributivo", popular: true },
  { id: "6", name: "ARS Monumental Empresarial", popular: true },
  { id: "7", name: "ARS Atlántida Salud Total", popular: false },
  { id: "8", name: "APS Familiar Plus", popular: false },
  { id: "9", name: "ARS Banreservas", popular: false },
  { id: "10", name: "ARS Colonial", popular: false },
  { id: "11", name: "ARS CMD", popular: false },
  { id: "12", name: "ARS Futuro", popular: false },
];
