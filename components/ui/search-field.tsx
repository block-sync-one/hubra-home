"use client";

/**
 * SearchField Component
 * Reusable search input with debouncing and flexible API
 * Can be used by any table or component that needs search functionality
 */

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";

export interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isClearable?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

/**
 * Generic SearchField Component
 *
 * Features:
 * - Optional debouncing
 * - Clearable
 * - Customizable placeholder and icon
 * - Flexible styling
 * - Type-safe
 *
 * Example usage:
 * ```tsx
 * <SearchField
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search protocols..."
 *   debounceMs={300}
 * />
 * ```
 */
export function SearchField({
  value: controlledValue,
  onChange,
  onClear,
  placeholder = "Search...",
  debounceMs = 0,
  className = "",
  showIcon = true,
  size = "sm",
  variant = "flat",
  isClearable = true,
  autoFocus = false,
  disabled = false,
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || "");

  // Sync with controlled value if provided
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounced onChange
  useEffect(() => {
    if (!onChange || debounceMs === 0) return;

    const timeoutId = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [internalValue, onChange, debounceMs]);

  // Handle input change
  const handleChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);

      // If no debounce, call onChange immediately
      if (onChange && debounceMs === 0) {
        onChange(newValue);
      }
    },
    [onChange, debounceMs]
  );

  // Handle clear
  const handleClear = useCallback(() => {
    setInternalValue("");
    onChange?.("");
    onClear?.();
  }, [onChange, onClear]);

  return (
    <Input
      className={className}
      classNames={{
        inputWrapper: "bg-card h-10 w-full border-none",
        input: "text-sm text-white placeholder:text-gray-500 w-full bg-transparent",
      }}
      disabled={disabled}
      isClearable={isClearable}
      placeholder={placeholder}
      size={size}
      startContent={showIcon ? <Icon className="text-gray-500" icon="solar:magnifer-linear" width={20} /> : undefined}
      type="text"
      value={internalValue}
      variant={variant}
      onChange={(e) => handleChange(e.target.value)}
      onClear={handleClear}
    />
  );
}

// Memoized version for performance in lists
export const MemoizedSearchField = React.memo(SearchField);
