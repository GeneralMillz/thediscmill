import React from 'react';
import { Shield, Star } from 'lucide-react';

export function HeroBadge() {
  return (
    <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-200 animate-bounce-slow">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">Official</div>
        <div className="text-sm font-black uppercase tracking-tighter leading-none">Disc Hero</div>
      </div>
      <div className="ml-4 flex gap-1">
        <Star className="w-3 h-3 fill-white text-white" />
        <Star className="w-3 h-3 fill-white text-white" />
        <Star className="w-3 h-3 fill-white text-white" />
      </div>
    </div>
  );
}
