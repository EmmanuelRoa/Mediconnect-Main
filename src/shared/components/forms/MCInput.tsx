import { Input } from "@/shared/ui/input";
import { useFormContext } from "react-hook-form";
import { EyeIcon } from "@/shared/ui/eye";
import { EyeOffIcon } from "@/shared/ui/eye-off";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MCInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  size?: "small" | "medium" | "large";
  status?: "default" | "error" | "success" | "warning" | "loading";
  statusMessage?: string;
  variant?: "edit" | "default";
  // Nueva prop para modo standalone
  standalone?: boolean;
}

function MCInput({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  size = "medium",
  status = "default",
  statusMessage,
  variant = "default",
  standalone = false,
}: MCInputProps) {
  // Obtener form context solo si NO está en modo standalone
  const formContext = standalone ? null : useFormContext();

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleStatusColor = () => {
    switch (status) {
      case "error":
        return "border-red-500 focus:border-red-500";
      case "success":
        return "border-green-500 focus:border-green-500";
      case "warning":
        return "border-yellow-500 focus:border-yellow-500";
      case "loading":
        return "border-blue-500 focus:border-blue-500";
      default:
        return "border-primary/50 focus:border-primary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-10 px-3 text-sm";
      case "large":
        return "h-16 px-6 text-lg";
      default:
        return "h-12 sm:h-[60px] px-3 sm:px-5";
    }
  };

  const handlePasswordToggle = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const getVariantClasses = () => {
    if (variant === "edit") {
      return "border-none bg-accent text-primary/80 placeholder:text-primary/60";
    }
    return "";
  };

  // Props del input dependiendo del modo
  const inputProps = standalone
    ? {
        // Modo standalone: solo value y onChange controlado
        value: value || "",
        onChange: onChange,
      }
    : (() => {
        // Modo form: usar react-hook-form register
        if (!formContext) return {};

        const field = formContext.register(name);
        return {
          ...field,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);
            onChange?.(e);
          },
        };
      })();

  // Obtener errores solo si está en un form
  const error = !standalone && formContext?.formState?.errors?.[name];

  return (
    <div className="w-full flex flex-col mb-4 px-0">
      {/* Label and Password Toggle */}
      {label && (
        <div className="flex flex-row justify-between items-center mb-2 gap-2">
          <label
            htmlFor={name}
            className="text-left text-base sm:text-lg text-primary"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {(type === "password" || showPasswordToggle) && (
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl text-secondary/75 dark:text-accent/75 hover:bg-secondary/10 dark:accent-accent/10 dark:hover:text-accent hover:text-secondary px-2 py-1 active:bg-secondary/20 active:text-secondary dark:active:text-accent dark:active:bg-accent/20"
              onClick={handlePasswordToggle}
              disabled={disabled} // <-- Deshabilita el botón si el input está deshabilitado
            >
              {passwordVisibility ? (
                <span className="flex items-center gap-1">
                  <EyeOffIcon size={18} />
                  <p className="hidden sm:inline">Ocultar</p>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <EyeIcon size={18} />
                  <p className="hidden sm:inline">Mostrar</p>
                </span>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        <Input
          id={name}
          placeholder={placeholder}
          type={type === "password" && passwordVisibility ? "text" : type}
          required={required}
          disabled={disabled}
          {...inputProps}
          className={cn(
            "w-full rounded-4xl focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-primary placeholder:text-md",
            getSizeClasses(),
            handleStatusColor(),
            getVariantClasses(),
            className,
          )}
        />
      </div>

      {/* Status Message */}
      {statusMessage && (
        <span
          className={cn(
            "text-sm mt-1 block",
            status === "success"
              ? "text-green-500"
              : status === "error"
                ? "text-red-500"
                : status === "warning"
                  ? "text-yellow-500"
                  : status === "loading"
                    ? "text-blue-500"
                    : "text-gray-500",
          )}
        >
          {statusMessage}
        </span>
      )}

      {/* Form Errors (solo si NO es standalone) */}
      {error && (
        <span className="text-red-500 text-sm mt-1">
          {String(error?.message)}
        </span>
      )}
    </div>
  );
}

export default MCInput;
