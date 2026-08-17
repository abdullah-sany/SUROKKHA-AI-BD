export function DemoModeNotice({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm px-3 py-2.5">
      <span className="font-semibold">Demo mode.</span> {text}
    </div>
  );
}
