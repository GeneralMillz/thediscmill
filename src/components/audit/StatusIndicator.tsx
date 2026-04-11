import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../utils';

interface StatusIndicatorProps {
  latency: number;
  lastError: string | null;
  parserDrift: boolean;
  compact?: boolean;
}

export function StatusIndicator({ latency, lastError, parserDrift, compact = false }: StatusIndicatorProps) {
  const isError = !!lastError || parserDrift;
  const isSlow = latency > 1500;

  const status = isError ? 'Error' : isSlow ? 'Slow' : 'OK';

  const colors = {
    OK: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900",
    Slow: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900",
    Error: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900"
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        colors[status]
      )}>
        {status === 'OK' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
        {status}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-1 rounded-lg border text-sm font-bold",
      colors[status]
    )}>
      {status === 'OK' ? (
        <CheckCircle className="w-4 h-4" />
      ) : status === 'Slow' ? (
        <Clock className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <span>{status}</span>
    </div>
  );
}
