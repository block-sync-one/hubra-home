"use client";

import Image from "next/image";

/**
 * PhoneMockup - iPhone-style frame with app screenshot
 *
 * Creates a CSS phone frame with rounded corners, notch, and
 * displays the app screenshot inside.
 */

interface PhoneMockupProps {
  /** Path to screenshot image */
  screenshot?: string;
  /** Alt text for screenshot */
  alt?: string;
  /** Additional className */
  className?: string;
}

export const PhoneMockup = ({
  screenshot = "/image/app-screenshot-placeholder.svg",
  alt = "Hubra App Screenshot",
  className = "",
}: PhoneMockupProps): JSX.Element => {
  return (
    <div className={`relative ${className}`}>
      {/* Phone frame */}
      <div
        className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[40px] p-2 shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
        {/* Inner bezel */}
        <div
          className="relative w-full h-full rounded-[32px] overflow-hidden"
          style={{
            background: "#000",
          }}>
          {/* Dynamic Island / Notch */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] rounded-full z-20"
            style={{
              background: "#000",
              boxShadow: "0 0 0 3px #1a1a1a",
            }}
          />

          {/* Screenshot container */}
          <div className="relative w-full h-full">
            {screenshot ? (
              <Image fill alt={alt} className="object-cover object-top" sizes="(max-width: 768px) 280px, 320px" src={screenshot} />
            ) : (
              /* Placeholder when no screenshot */
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--hp-hero-bg)" }}>
                <div className="text-center px-4">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-gray-500 text-sm">App Preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Screen reflection overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[32px]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Side button (right) */}
        <div className="absolute right-[-2px] top-[100px] w-[3px] h-[60px] rounded-r" style={{ background: "#2a2a2a" }} />

        {/* Volume buttons (left) */}
        <div className="absolute left-[-2px] top-[80px] w-[3px] h-[30px] rounded-l" style={{ background: "#2a2a2a" }} />
        <div className="absolute left-[-2px] top-[120px] w-[3px] h-[50px] rounded-l" style={{ background: "#2a2a2a" }} />
      </div>

      {/* Glow effect behind phone */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at center, var(--hp-gold-400) 0%, transparent 70%)",
          transform: "scale(1.2)",
        }}
      />
    </div>
  );
};
