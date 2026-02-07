import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "wait" | "process" | "finish" | "error";

export interface StepItem {
  title?: string;
  subTitle?: string;
  icon?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

export interface MCStepperProps {
  items: StepItem[];
  current?: number;
  onChange?: (current: number) => void;
  size?: "default" | "large";
  showLabels?: boolean;
  className?: string;
}

const getStepStatus = (
  index: number,
  current: number,
  itemStatus?: StepStatus,
): StepStatus => {
  if (itemStatus) return itemStatus;
  if (index < current) return "finish";
  if (index === current) return "process";
  return "wait";
};

function MCStepper({
  items,
  current = 0,
  size = "large",
  showLabels = false,
  className,
}: MCStepperProps) {
  const isLarge = size === "large";

  return (
    <div className={cn("flex items-start w-full", className)}>
      {items.map((item, index) => {
        const status = getStepStatus(index, current, item.status);
        const isLast = index === items.length - 1;

        const bubbleBg =
          status === "finish" || status === "process"
            ? "bg-[#D7E3C9]"
            : "bg-[#D7E3C9] opacity-60";
        const bubbleText = "text-[#0B2C12]";
        const ringAccent =
          status === "process" ? "ring-4 ring-[#D7E3C9]/50" : "";

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Step Circle */}
              <button
                type="button"
                disabled
                className={cn(
                  "relative flex items-center justify-center rounded-full transition-all",
                  "h-14 w-14 text-2xl font-semibold",
                  bubbleBg,
                  bubbleText,
                  ringAccent,
                  "cursor-default",
                )}
                style={{
                  boxShadow: undefined,
                }}
              >
                {item.icon ? (
                  item.icon
                ) : status === "finish" ? (
                  <div>
                    <Check
                      className={cn(
                        "h-8 w-8 stroke-2",
                        current !== index && "opacity-60",
                      )}
                      strokeWidth={3}
                    />
                  </div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>

              {/* Labels below circle */}
              {showLabels && (item.title || item.subTitle) && (
                <div className="mt-3 text-center">
                  {item.title && (
                    <div
                      className={cn(
                        "font-medium transition-colors",
                        isLarge ? "text-base" : "text-sm",
                        "text-[#0B2C12]",
                        status === "wait" && "opacity-50",
                      )}
                    >
                      {item.title}
                    </div>
                  )}
                  {item.subTitle && (
                    <div
                      className={cn(
                        "mt-1",
                        isLarge ? "text-sm" : "text-xs",
                        "text-[#0B2C12] opacity-40",
                      )}
                    >
                      {item.subTitle}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-1 relative overflow-hidden",
                  "mt-10",
                )}
              >
                <div className="absolute inset-0 bg-[#D7E3C9]/30" />
                <div
                  className={cn(
                    "absolute inset-0 origin-left bg-[#D7E3C9]",
                    index < current ? "scale-x-100" : "scale-x-0",
                  )}
                  style={{
                    transform: index < current ? "scaleX(1)" : "scaleX(0)",
                    transition: "none",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default MCStepper;
