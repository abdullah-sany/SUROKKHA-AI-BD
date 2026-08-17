import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, padded = true, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`bg-white border border-stone-200 rounded-xl shadow-card ${padded ? "p-4" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
