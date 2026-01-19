import React from "react";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
interface MCFilterInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  mainInput?: boolean;
}

function MCFilterInput() {
  return (
    <div className="relative  h-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
      <Input
        placeholder="Buscar Médico"
        className="w-full rounded-full h-full  placeholder:text-primary/80 px-8 py-3.5 text-base sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-10 lg:py-3 lg:text-md border-primary/20 bg-bg-btn-secondary dark:bg-bg-btn-secondary"
      />
    </div>
  );
}

export default MCFilterInput;
