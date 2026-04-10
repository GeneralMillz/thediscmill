import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils';

interface TimelineEntry {
  timestamp: number;
  type: 'success' | 'error' | 'drift';
  message: string;
  latency: number;
}

interface TimelineProps {
  entries?: TimelineEntry[]; // Optional since auditStore might not have it yet
}

export function Timeline({ entries = [] }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm italic">
        No timeline data available for this session.
      </div>
    );
  }

  return (
    <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
      {entries.map((entry, index) => (
        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            {entry.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : entry.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-gray-900 text-sm">{entry.type.toUpperCase()}</div>
              <time className="font-mono text-[10px] text-indigo-600">{formatDate(entry.timestamp)}</time>
            </div>
            <div className="text-gray-500 text-xs">{entry.message}</div>
            <div className="mt-2 text-[10px] font-bold text-gray-400">{entry.latency}ms latency</div>
          </div>
        </div>
      ))}
    </div>
  );
}
