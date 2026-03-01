"use client";
import { useEffect, useRef } from "react";

const PATH_DATA =
  "M496.164 647.036C496.164 953.573 247.493 1202.07 -59.2566 1202.07C-366.007 1202.07 -614.677 953.573 -614.677 647.036C-614.677 340.499 -366.007 92.002 -59.2566 92.002C247.493 92.002 496.164 340.499 496.164 647.036Z";
const SVG_W = 660;
const SVG_H = 304;
const ORBIT_STROKE = 0.78;
const SEGMENT_LEN = 100;
const SAMPLES = 32;

function getSegmentPath(path: SVGPathElement, start: number, end: number): string {
  const pts: string[] = [];

  for (let i = 0; i <= SAMPLES; i++) {
    const l = start + ((end - start) * i) / SAMPLES;
    const pt = path.getPointAtLength(l);

    pts.push(`${pt.x},${pt.y}`);
  }

  return `M${pts.join(" L")}`;
}

export function AnimatedSatelliteOrbit() {
  const pathRef = useRef<SVGPathElement>(null);
  const segRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const orbit = pathRef.current;
    const seg = segRef.current;

    if (!orbit || !seg) return;

    const totalLen = orbit.getTotalLength();
    let raf: number;

    const tick = (t: number) => {
      const progress = 1 - ((t / 10000) % 1);
      const start = progress * totalLen;
      const end = Math.min(start + SEGMENT_LEN, totalLen);

      seg.setAttribute("d", getSegmentPath(orbit, start, end));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      className="absolute left-0 bottom-0 w-full h-full pointer-events-none"
      fill="none"
      height={SVG_H}
      style={{ zIndex: 2 }}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width={SVG_W}
      xmlns="http://www.w3.org/2000/svg">
      <path ref={pathRef} d={PATH_DATA} fill="none" opacity={0.2} stroke="white" strokeLinecap="round" strokeWidth={ORBIT_STROKE} />
      <path ref={segRef} d="" stroke="url(#satGrad)" strokeLinecap="round" strokeWidth={ORBIT_STROKE} />
      <defs>
        <linearGradient id="satGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FEAA01" stopOpacity="1" />
          <stop offset="100%" stopColor="#FEAA01" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
