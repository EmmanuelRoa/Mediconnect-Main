import React from "react";
import { useParams } from "react-router-dom";
import MCDashboardContent from "@/shared/layout/MCDashboardContent";
import PhotoGallery from "../components/healthService/PhotoGallery";
import {
  Star,
  Clock,
  Stethoscope,
  Monitor,
  ArrowLeft,
  Share2,
  Pencil,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import MCButton from "@/shared/components/forms/MCButton";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { MCUserAvatar } from "@/shared/navigation/userMenu/MCUserAvatar";
import gallery1 from "@/assets/tryOuts/0a2523c730e041428f78c4cba0930230~tplv-jj85edgx6n-image-origin.jpeg";
import gallery2 from "@/assets/Register-Center.png";
import gallery3 from "@/assets/doctorOnbording/profile-picture.png";
import gallery4 from "@/assets/tryOuts/0a2523c730e041428f78c4cba0930230~tplv-jj85edgx6n-image-origin.jpeg";
import gallery5 from "@/assets/tryOuts/1242061.jpg";
import gallery6 from "@/assets/flag-spain.png";
import doctorAvatar from "@/assets/Register-Doctor.png";

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
];

const reviews = [
  {
    name: "Christian Bautista",
    time: "Hace 1 día",
    rating: 5,
    text: "Excelente atención. El doctor fue muy atento y explicó todo con calma. Se nota que se preocupan por el bienestar de sus pacientes.",
  },
  {
    name: "María González",
    time: "Hace 3 días",
    rating: 5,
    text: "Muy profesional y amable. La consulta fue muy completa y me sentí muy cómoda. Recomendado al 100%.",
  },
  {
    name: "Carlos Méndez",
    time: "Hace 1 semana",
    rating: 4,
    text: "Buen servicio médico. El doctor se tomó el tiempo de explicar todo detalladamente. El único detalle fue la espera.",
  },
  {
    name: "Ana Pérez",
    time: "Hace 2 semanas",
    rating: 5,
    text: "Excelente experiencia. El trato fue humano y profesional. Sin duda volveré para mis próximas consultas.",
  },
  {
    name: "Carlos Méndez",
    time: "Hace 1 semana",
    rating: 4,
    text: "Buen servicio médico. El doctor se tomó el tiempo de explicar todo detalladamente. El único detalle fue la espera.",
  },
  {
    name: "Ana Pérez",
    time: "Hace 2 semanas",
    rating: 5,
    text: "Excelente experiencia. El trato fue humano y profesional. Sin duda volveré para mis próximas consultas.",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-yellow-400/70"
        }`}
      />
    ))}
  </div>
);

function ServicesPage() {
  const { serviceId } = useParams();

  return (
    <MCDashboardContent mainWidth="w-[100%]" noBg>
      <div className="min-h-screen w-full px-4 md:px-8 lg:px-16 space-y-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto ">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-heading text-foreground mb-4">
              Consulta de Medicina Familiar
            </h1>
            <div className="flex  gap-4">
              <button className="flex items-center gap-1.5 text-sm text-foreground hover:text-secondary transition-colors font-body">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
              <button className="flex items-center gap-1.5 text-sm text-foreground hover:text-secondary transition-colors font-body">
                <Pencil className="w-4 h-4" />
                Editar
              </button>
            </div>
          </div>

          {/* Photo Gallery */}
          <PhotoGallery images={galleryImages} alt="Consulta médica" />

          {/* Service meta */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground bg  font-body">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-star text-star" />
              <span className="font-semibold text-foreground">4.8</span>
              <span>(12 reseñas)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Stethoscope className="w-4 h-4" />
              <span>Medicina Familiar</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>60 minutos</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Monitor className="w-4 h-4" />
              <span>Presencial / mixta</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Doctor info */}
              <div>
                <h2 className="text-xl font-heading font-semibold  text-foreground mb-4">
                  Conoce a tu Doctor
                </h2>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 relative overflow-hidden rounded-full border border-primary/10 bg-muted flex items-center justify-center">
                    {!doctorAvatar ? (
                      <Avatar className="h-20 w-20 rounded-full overflow-hidden">
                        <AvatarImage
                          src={doctorAvatar}
                          alt="Dr. Cristiano Ronaldo"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          CR
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <MCUserAvatar
                        name="Dr. Cristiano Ronaldo"
                        square
                        size={80}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground font-body text-lg">
                      Dr. Cristiano Ronaldo
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Medicina Familiar
                    </p>
                    <div className="flex gap-6 mt-2 text-sm text-muted-foreground font-body">
                      <div>
                        <span className="text-foreground font-semibold">
                          23
                        </span>{" "}
                        Reseñas
                      </div>
                      <div>
                        <span className="text-foreground font-semibold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-star text-star inline" />
                          4.9
                        </span>{" "}
                        Calificación
                      </div>
                      <div>
                        <span className="text-foreground font-semibold">2</span>{" "}
                        Años de exp.
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-body text-xs"
                    >
                      Ver perfil
                    </Button>
                    <Button size="sm" className="font-body text-xs">
                      Contactar Doctor
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* About */}
              <div>
                <h2 className="text-xl font-heading text-foreground mb-3">
                  Acerca de este servicio
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed text-justify">
                  Atención integral para toda la familia, enfocada en prevenir,
                  diagnosticar y tratar enfermedades comunes. Nuestro médico de
                  familia acompaña a cada paciente en todas las etapas de la
                  vida, considerando su bienestar físico, emocional y social.
                </p>
              </div>

              <Separator />

              {/* Reviews */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-heading text-foreground">
                    Reseñas
                  </h2>
                  <span className="text-muted-foreground font-body">•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-star text-star" />
                    <span className="font-semibold text-foreground font-body">
                      4.8
                    </span>
                    <span className="text-muted-foreground font-body">
                      (12 reseñas)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-muted text-muted-foreground font-body text-sm">
                            {review.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground font-body">
                            {review.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-muted-foreground font-body">
                              • {review.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">
                        {review.text}
                      </p>
                      <button className="text-xs text-primary font-medium font-body hover:underline">
                        Mostrar más
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 font-body">
                  Mostrar todas las reseñas
                </Button>
              </div>
            </div>

            {/* Right column - Booking card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6 shadow-lg border-border">
                <div className="text-center space-y-4">
                  <div>
                    <span className="text-2xl font-heading text-foreground">
                      RD$1500
                    </span>
                    <span className="text-muted-foreground font-body text-sm ml-1">
                      por paciente
                    </span>
                  </div>
                  <Button className="w-full font-body text-base py-6">
                    Agendar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MCDashboardContent>
  );
}

export default ServicesPage;
