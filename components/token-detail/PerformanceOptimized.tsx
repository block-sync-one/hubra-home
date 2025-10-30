"use client";

import React, { memo, useMemo } from "react";

// Memoized components for better performance
export const MemoizedTokenHeader = memo(function MemoizedTokenHeader(props: any) {
  return <div {...props} />;
});

export const MemoizedVolumeStats = memo(function MemoizedVolumeStats(props: any) {
  return <div {...props} />;
});

export const MemoizedTradingSection = memo(function MemoizedTradingSection(props: any) {
  return <div {...props} />;
});

export const MemoizedTokenDescription = memo(function MemoizedTokenDescription(props: any) {
  return <div {...props} />;
});

// Performance utilities
export const usePerformanceOptimizedData = (data: any) => {
  return useMemo(() => {
    // Add any data processing optimizations here
    return {
      ...data,
      // Pre-compute expensive calculations
      formattedPrice: data.price?.replace("€", "") || "0",
      isPositiveChange: data.change > 0,
      changeColor: data.change > 0 ? "#15b79e" : "#f63d68",
    };
  }, [data]);
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};
