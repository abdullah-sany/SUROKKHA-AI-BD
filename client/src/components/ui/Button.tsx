import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "emergency";
type Size = "md" | "lg" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-navy-500 text-white hover:bg-navy-600 active:bg-navy-700",
  secondary: "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700",
  outline: "bg-transparent text-navy-500 border border-navy-300 hover:bg-navy-50",
  ghost: "bg-transparent text-navy-500 hover:bg-navy-50",
  emergency: "bg-emred-500 text-white hover:bg-emred-600 active:bg-emred-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-2 min-h-[36px]",
  md: "text-sm px-4 py-2.5 min-h-[44px]",
  lg: "text-base px-5 py-3.5 min-h-[52px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon, fullWidth, className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
