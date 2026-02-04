import React, { useState } from "react";
import MCTablesLayouts from "@/shared/components/tables/MCTablesLayouts";
import MCDoctorsCards from "@/shared/components/MCDoctorsCards";
import MCFilterInput from "@/shared/components/filters/MCFilterInput";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/ui/pagination";
import MCPDFButton from "@/shared/components/forms/MCPDFButton";
import MCGeneratePDF from "@/shared/components/MCGeneratePDF";
import { mockAppointments } from "@/data/appointments";
import { useTranslation } from "react-i18next";

const doctorsList = [
  {
    id: "d1",
    name: "Alexander Gil",
    specialty: "Cardiólogo",
    rating: 4.8,
    yearsOfExperience: 15,
    languages: ["es", "en", "fr"],
    insuranceAccepted: ["senasa", "universal", "humano"],
    isFavorite: false,
    urlImage:
      "https://i.pinimg.com/736x/58/8b/f4/588bf4e2b04c192c96b297d7627b31e6.jpg",
  },
  {
    id: "d2",
    name: "María López",
    specialty: "Dermatóloga",
    rating: 4.9,
    yearsOfExperience: 10,
    languages: ["es", "en"],
    insuranceAccepted: ["palic", "humano"],
    isFavorite: true,
    urlImage:
      "https://i.pinimg.com/736x/22/1f/d5/221fd565c4175235f7ae93d2ba80c641.jpg",
  },
  {
    id: "d3",
    name: "Carlos Méndez",
    specialty: "Pediatra",
    rating: 4.7,
    yearsOfExperience: 8,
    languages: ["es"],
    insuranceAccepted: ["universal"],
    isFavorite: true,
    urlImage:
      "https://i.pinimg.com/736x/b5/09/6b/b5096bf449df00f2f3fc52d8a4de5c70.jpg",
  },
  {
    id: "d4",
    name: "Sofía Ramírez",
    specialty: "Endocrinóloga",
    rating: 4.6,
    yearsOfExperience: 12,
    languages: ["es", "fr"],
    insuranceAccepted: ["senasa", "mapfre", "yunen"],
    isFavorite: true,
    urlImage: "",
  },
  {
    id: "d5",
    name: "Luis Fernández",
    specialty: "Ginecólogo",
    rating: 4.5,
    yearsOfExperience: 11,
    languages: ["es", "en"],
    insuranceAccepted: ["palic", "universal"],
    isFavorite: false,
    urlImage: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "d6",
    name: "Ana Torres",
    specialty: "Oftalmóloga",
    rating: 4.8,
    yearsOfExperience: 9,
    languages: ["es"],
    insuranceAccepted: ["senasa", "humano"],
    isFavorite: true,
    urlImage: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "d7",
    name: "Pedro Castillo",
    specialty: "Ortopedista",
    rating: 4.4,
    yearsOfExperience: 13,
    languages: ["es", "en"],
    insuranceAccepted: ["mapfre", "palic"],
    isFavorite: false,
    urlImage: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: "d8",
    name: "Gabriela Suárez",
    specialty: "Psiquiatra",
    rating: 4.9,
    yearsOfExperience: 7,
    languages: ["es", "en", "it"],
    insuranceAccepted: ["universal", "humano"],
    isFavorite: true,
    urlImage: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "d9",
    name: "Javier Peña",
    specialty: "Neurólogo",
    rating: 4.7,
    yearsOfExperience: 14,
    languages: ["es"],
    insuranceAccepted: ["senasa", "palic"],
    isFavorite: false,
    urlImage: "https://randomuser.me/api/portraits/men/77.jpg",
  },
  {
    id: "d10",
    name: "Lucía Vargas",
    specialty: "Nutrióloga",
    rating: 4.6,
    yearsOfExperience: 6,
    languages: ["es", "en"],
    insuranceAccepted: ["humano", "mapfre"],
    isFavorite: true,
    urlImage: "https://randomuser.me/api/portraits/women/81.jpg",
  },
];

const CARDS_PER_PAGE = 8;

function MyDoctorsPage() {
  const { t } = useTranslation("patient");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filtrado por búsqueda
  const filteredDoctors = doctorsList.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  // Paginación
  const totalPages = Math.ceil(filteredDoctors.length / CARDS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (page - 1) * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE,
  );

  // PDF generator
  const pdfGeneratorComponent = (
    <MCPDFButton
      onClick={async () => {
        setIsLoading(true);
        await MCGeneratePDF({
          columns: [
            { title: t("myDoctors.pdfColumns.name"), key: "name" },
            { title: t("myDoctors.pdfColumns.specialty"), key: "specialty" },
            { title: t("myDoctors.pdfColumns.rating"), key: "rating" },
            {
              title: t("myDoctors.pdfColumns.yearsOfExperience"),
              key: "yearsOfExperience",
            },
            { title: t("myDoctors.pdfColumns.languages"), key: "languages" },
            {
              title: t("myDoctors.pdfColumns.insuranceAccepted"),
              key: "insuranceAccepted",
            },
          ],
          data: filteredDoctors,
          fileName: "mis-doctores",
          title: t("myDoctors.pdfTitle"),
          subtitle: t("myDoctors.pdfSubtitle"),
        });
        setIsLoading(false);
      }}
      loading={isLoading}
    />
  );

  // Search input
  const searchComponent = (
    <MCFilterInput
      placeholder={t("myDoctors.searchPlaceholder")}
      value={search}
      onChange={(value: string) => {
        setPage(1);
        setSearch(value);
      }}
    />
  );

  return (
    <MCTablesLayouts
      title={t("myDoctors.title")}
      searchComponent={searchComponent}
      pdfGeneratorComponent={pdfGeneratorComponent}
      tableComponent={
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedDoctors.map((doctor) => (
              <MCDoctorsCards
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                specialty={doctor.specialty}
                rating={doctor.rating}
                yearsOfExperience={doctor.yearsOfExperience}
                languages={doctor.languages}
                insuranceAccepted={doctor.insuranceAccepted}
                isFavorite={doctor.isFavorite}
                urlImage={doctor.urlImage}
              />
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (page > 1) setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : 0}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      isActive={page === idx + 1}
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (page < totalPages) setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    aria-disabled={page === totalPages}
                    tabIndex={page === totalPages ? -1 : 0}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      }
    />
  );
}

export default MyDoctorsPage;
