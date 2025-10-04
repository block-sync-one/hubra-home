'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TokenError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Token page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0d0e21] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-6">
          <Icon 
            icon="lucide:alert-triangle" 
            className="h-16 w-16 text-red-400 mx-auto mb-4" 
          />
          <h1 className="text-2xl font-medium text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-400 mb-6">
            We encountered an error while loading the token data. Please try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-[#feaa01] text-black font-semibold hover:bg-[#feaa01]/90"
          >
            Try again
            <Icon icon="lucide:refresh-cw" className="h-4 w-4" />
          </Button>
          
          <Button
            variant="bordered"
            className="w-full border-white/20 text-white hover:bg-white/5"
            onClick={() => window.location.href = '/tokens'}
          >
            <Icon icon="lucide:arrow-left" className="h-4 w-4" />
            Back to Tokens
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
