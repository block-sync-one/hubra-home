import type { SwiperOptions, Swiper as SwiperType } from "swiper/types";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

interface HorizontalSwiperProps {
  children: React.ReactNode[];
  className?: string;
  spaceBetween?: number;
  slidesPerView?: number | "auto";
  freeMode?: boolean;
  grabCursor?: boolean;
  breakpoints?: {
    [width: number]: SwiperOptions;
    [ratio: string]: SwiperOptions;
  };
  onSlideChange?: (swiper: SwiperType) => void;
}

/**
 * Reusable horizontal Swiper component for overflow sliders
 * Provides smooth swiping experience with consistent styling
 */
export function HorizontalSwiper({
  children,
  className = "",
  spaceBetween = 8,
  slidesPerView = "auto",
  freeMode = true,
  grabCursor = true,
  breakpoints,
  onSlideChange,
}: HorizontalSwiperProps) {
  const hasSwiped = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (swipeTimeout.current) {
        clearTimeout(swipeTimeout.current);
      }
    };
  }, []);

  const handleTouchStart = (_swiper: SwiperType, event: TouchEvent | MouseEvent) => {
    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    hasSwiped.current = false;

    // Clear any existing timeout
    if (swipeTimeout.current) {
      clearTimeout(swipeTimeout.current);
      swipeTimeout.current = null;
    }
  };

  const handleTouchMove = (_swiper: SwiperType, event: TouchEvent | MouseEvent) => {
    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    if (touchStartX.current === 0) {
      touchStartX.current = currentX;
      touchStartY.current = currentY;

      return;
    }

    const deltaX = Math.abs(currentX - touchStartX.current);
    const deltaY = Math.abs(currentY - touchStartY.current);

    // Only consider it a swipe if horizontal movement is greater than vertical and exceeds threshold
    if (deltaX > 10 && deltaX > deltaY) {
      hasSwiped.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (hasSwiped.current) {
      // Keep preventing clicks for a short time after swipe ends
      swipeTimeout.current = setTimeout(() => {
        hasSwiped.current = false;
        touchStartX.current = 0;
        touchStartY.current = 0;
        swipeTimeout.current = null;
      }, 300);
    } else {
      touchStartX.current = 0;
      touchStartY.current = 0;
    }
  };

  const preventClick = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
    if (hasSwiped.current) {
      e.preventDefault();
      e.stopPropagation();
      // Prevent the event from reaching child elements
      if (e.nativeEvent && typeof (e.nativeEvent as any).stopImmediatePropagation === "function") {
        (e.nativeEvent as any).stopImmediatePropagation();
      }
    }
  };

  return (
    <Swiper
      breakpoints={breakpoints}
      className={`personal-insights ${className}`}
      freeMode={freeMode}
      grabCursor={grabCursor}
      preventClicks={true}
      preventClicksPropagation={true}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      style={{
        width: "100%",
        paddingBottom: "8px",
      }}
      threshold={15}
      onSlideChange={onSlideChange}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}>
      {children.map((child, index) => (
        <SwiperSlide
          key={index}
          style={{ width: "auto" }}
          onClickCapture={preventClick}
          onMouseDownCapture={preventClick}
          onPointerDownCapture={preventClick}
          onTouchStartCapture={preventClick}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
