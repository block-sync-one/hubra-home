"use client";
import { useRef, useEffect, useState, type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  muted?: boolean;
};

export function Section({ children, className = "", id, muted }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`w-full transition-[opacity,transform] duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${muted ? "bg-white/[0.015]" : ""} ${className}`}
      id={id}>
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:py-40">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
}) {
  const align = center ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-5 max-w-2xl ${center ? "mx-auto" : ""} ${align}`}>
      {eyebrow && <span className="font-mono text-xs tracking-[0.2em] uppercase text-primary/70">{eyebrow}</span>}
      <h2 className="font-sans text-[clamp(2rem,3.5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.08] text-white">{title}</h2>
      {description && <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl">{description}</p>}
    </div>
  );
}
