import { useMemo } from "react";
import { insurancePlans, type InsurancePlan } from "@/data/searchData";

interface InsuranceDropdownProps {
  searchTerm: string;
  onSelect: (plan: InsurancePlan) => void;
}

const InsuranceDropdown = ({
  searchTerm,
  onSelect,
}: InsuranceDropdownProps) => {
  const { popularPlans, allPlans } = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      return {
        popularPlans: insurancePlans.filter((p) => p.popular),
        allPlans: insurancePlans
          .filter((p) => !p.popular)
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
    }

    const filtered = insurancePlans.filter((p) =>
      p.name.toLowerCase().includes(query),
    );

    return {
      popularPlans: filtered.filter((p) => p.popular),
      allPlans: filtered
        .filter((p) => !p.popular)
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [searchTerm]);

  // Agrupar por letra inicial
  const groupedPlans = useMemo(() => {
    const groups: Record<string, InsurancePlan[]> = {};
    allPlans.forEach((plan) => {
      const letter = plan.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(plan);
    });
    return groups;
  }, [allPlans]);

  return (
    <div className="absolute top-full left-0 right-0 mt-2.5 bg-card rounded-2xl shadow-search border border-primary/15 overflow-hidden z-50 max-h-96 overflow-y-auto">
      <div className="py-3">
        {/* Planes populares */}
        {popularPlans.length > 0 && (
          <div className="px-5">
            <h3 className="font-semibold text-foreground mb-2">
              Planes populares
            </h3>
            {popularPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onSelect(plan)}
                className="w-full text-left py-2 px-2 rounded-lg hover:bg-accent transition-colors text-foreground  hover:text-secondary-foreground"
              >
                {plan.name}
              </button>
            ))}
          </div>
        )}

        {/* Todos los planes */}
        {Object.keys(groupedPlans).length > 0 && (
          <div className="px-5 mt-4">
            <h3 className="font-semibold text-foreground mb-2">
              Todos los planes
            </h3>
            {Object.entries(groupedPlans).map(([letter, plans]) => (
              <div key={letter}>
                <div className="text-sm font-medium text-muted-foreground mt-3 mb-1">
                  {letter}
                </div>
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => onSelect(plan)}
                    className="w-full text-left py-2 px-2 rounded-lg hover:bg-accent hover:text-secondary-foreground transition-colors text-foreground"
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {popularPlans.length === 0 &&
          Object.keys(groupedPlans).length === 0 && (
            <div className="px-5 py-4 text-muted-foreground text-center">
              No se encontraron planes
            </div>
          )}
      </div>
    </div>
  );
};

export default InsuranceDropdown;
