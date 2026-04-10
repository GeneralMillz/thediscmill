import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Sponsored } from './Sponsored';

interface SpotlightProps {
  name: string;
  logo: string;
  description: string;
  link: string;
}

export function Spotlight({ name, logo, description, link }: SpotlightProps) {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white p-6 sm:p-8 rounded-3xl overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none" />

      <div className="absolute top-5 right-5">
        <Sponsored />
      </div>

      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-3 flex items-center justify-center shrink-0 shadow-xl shadow-black/30">
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Featured Partner</div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{name}</h3>
          <p className="text-sm text-indigo-100/80 mb-5 max-w-xl leading-relaxed">{description}</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
          >
            Shop {name}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
