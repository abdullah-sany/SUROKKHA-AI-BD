import type { ReactNode } from "react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-stone-200 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
      <SkeletonLine className="h-4 w-2/3" />
      <SkeletonLine className="h-3 w-1/2" />
      <SkeletonLine className="h-3 w-full" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-4">
      {icon && <div className="text-stone-400">{icon}</div>}
      <div>
        <p className="font-semibold text-navy-700">{title}</p>
        {description && <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry, retryLabel }: { message: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-4">
      <p className="text-sm text-emred-600 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-semibold text-navy-500 underline underline-offset-2 min-h-[44px] px-2"
        >
          {retryLabel ?? "Try again"}
        </button>
      )}
    </div>
  );
}
