import type { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-stone-100 text-stone-700 border-stone-200",
  success: "bg-leaf-50 text-leaf-600 border-leaf-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  danger: "bg-emred-50 text-emred-700 border-emred-100",
  info: "bg-teal-50 text-teal-700 border-teal-100",
};

export function Badge({ children, tone = "neutral", className = "", ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
