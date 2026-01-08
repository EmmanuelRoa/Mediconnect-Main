import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/shared/ui/badge";
import { useTranslation } from "react-i18next";
export type OnboardingChecklistItem = {
  id: string;
  title: string;
  optional?: boolean;
  completed?: boolean;
  onClick: () => void;
};

type OnboardingChecklistProps = {
  items: OnboardingChecklistItem[];
};

function OnboardingChecklist({ items }: OnboardingChecklistProps) {
  const { t } = useTranslation("auth");
  return (
    <div className="space-y-5 w-full mb-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="group flex h-auto w-full items-center justify-between  rounded-t-2xl   px-4 py-4 hover:bg-primary/5  border-b border-primary/10"
        >
          {/* Left */}
          <div className="flex  items-center gap-2">
            <div
              className={cn(
                "text-base font-medium flex flex-col items-start gap-1",
                item.completed ? "text-primary" : "text-foreground"
              )}
            >
              {item.title}

              {item.completed && (
                <span className="text-sm text-secondary">
                  {t("onboardingChecklist.completed")}
                </span>
              )}
            </div>

            {item.optional && (
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-xs bg-accent/50 text-primary"
              >
                {t("onboardingChecklist.optional")}
              </Badge>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {item.completed ? (
              <Check className="h-5 w-5 text-secondary animate-bounce" /> // animación de rebote
            ) : (
              <ArrowRight className="h-5 w-5 text-primary/50 transition-transform duration-200 group-hover:translate-x-2" /> // animación de movimiento
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default OnboardingChecklist;
