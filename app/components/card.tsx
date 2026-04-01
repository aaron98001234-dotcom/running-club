import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export default function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`train-track rounded-2xl border border-slate-300 bg-[var(--train-card)] p-6 shadow-[0_8px_24px_rgba(30,52,79,0.12)] ${className}`.trim()}
    >
      {children}
    </section>
  );
}
