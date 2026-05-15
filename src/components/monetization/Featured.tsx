import React from 'react';
import { Sponsored } from './Sponsored';
import { ArrowRight } from 'lucide-react';

interface FeaturedPlacementProps {
  title: string;
  description: string;
  link: string;
  image?: string;
}

export const Featured: React.FC<FeaturedPlacementProps> = ({ title, description, link, image }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 relative overflow-hidden group active:scale-[0.99] transition-transform">
      <div className="absolute top-4 right-4">
        <Sponsored />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 max-w-md">{description}</p>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-600 font-bold hover:underline"
        >
          Check it out <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      {image && (
        <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
          <img src={image} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
