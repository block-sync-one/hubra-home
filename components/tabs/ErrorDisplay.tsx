"use client";

import React from "react";
import { Icon } from "@iconify/react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden p-6">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon className="w-12 h-12 text-red-500 mx-auto mb-4" icon="mdi:alert-circle" />
          <p className="text-white mb-4">{error}</p>
          {onRetry && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
