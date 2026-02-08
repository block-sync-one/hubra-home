"use client";

/**
 * PartnerLogoStrip - Trusted Protocol Logos
 *
 * Display partners in a subtle, grayscale row.
 * Treatment: Grayscale by default, subtle color on hover.
 * Small scale — trust signal, not advertisement.
 *
 * Partners: Sanctum, Kamino, Dialect, Jupiter, Orca, Drift
 */

interface Partner {
  name: string;
  logo: React.ReactNode;
}

// SVG logos for each partner - simplified, clean versions
const partners: Partner[] = [
  {
    name: "Sanctum",
    logo: (
      <svg className="w-auto h-5" fill="currentColor" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text className="font-medium" fontSize="16" x="0" y="17">
          Sanctum
        </text>
      </svg>
    ),
  },
  {
    name: "Kamino",
    logo: (
      <svg className="w-auto h-5" fill="currentColor" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
        <text className="font-medium" fontSize="16" x="0" y="17">
          Kamino
        </text>
      </svg>
    ),
  },
  {
    name: "Dialect",
    logo: (
      <svg className="w-auto h-5" fill="currentColor" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
        <text className="font-medium" fontSize="16" x="0" y="17">
          Dialect
        </text>
      </svg>
    ),
  },
  {
    name: "Jupiter",
    logo: (
      <svg className="w-auto h-5" fill="currentColor" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
        <text className="font-medium" fontSize="16" x="0" y="17">
          Jupiter
        </text>
      </svg>
    ),
  },
  {
    name: "Orca",
    logo: (
      <svg className="w-auto h-5" fill="currentColor" viewBox="0 0 60 24" xmlns="http://www.w3.org/2000/svg">
        <text className="font-medium" fontSize="16" x="0" y="17">
          Orca
        </text>
      </svg>
    ),
  },
  {
    name: "Drift",
    logo: (
      <svg className="w-auto h-5" fill="currentColor" viewBox="0 0 60 24" xmlns="http://www.w3.org/2000/svg">
        <text className="font-medium" fontSize="16" x="0" y="17">
          Drift
        </text>
      </svg>
    ),
  },
];

export const PartnerLogoStrip = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label */}
      <p className="text-gray-500 uppercase tracking-wider" style={{ fontSize: "var(--hp-caption)" }}>
        Powered by leading protocols
      </p>

      {/* Logo row */}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="text-gray-500 opacity-60 transition-all duration-300 hover:opacity-100 hover:text-gray-300"
            title={partner.name}>
            {partner.logo}
          </div>
        ))}
      </div>
    </div>
  );
};
