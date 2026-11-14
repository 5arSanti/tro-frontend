export function ByLirn({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[0.7rem] font-bold uppercase tracking-[0.14em] text-energy ${className}`.trim()}
    >
      by LIRN
    </span>
  );
}
