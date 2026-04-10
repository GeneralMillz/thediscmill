import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Sponsored() {
  return (
    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
      <ShieldCheck className="w-3 h-3 mr-1" />
      Sponsored
    </div>
  );
}
