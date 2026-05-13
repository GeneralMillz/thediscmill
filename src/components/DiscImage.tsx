import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils';

interface DiscImageProps {
  src?: string;
  name: string;
  brand: string;
  className?: string;
  alt?: string;
}

const GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-orange-400',
  'from-fuchsia-500 to-pink-500',
  'from-amber-500 to-red-500',
  'from-violet-500 to-indigo-500',
  'from-cyan-500 to-blue-500',
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function DiscImage({ src, name, brand, className, alt }: DiscImageProps) {
  const [imgError, setImgError] = useState(false);

  const isPlaceholder = !src || src.includes('placeholder-disc.png') || imgError;

  if (isPlaceholder) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const gradient = getGradient(name + brand);

    return (
      <div className={cn("relative flex items-center justify-center rounded-full shadow-inner overflow-hidden border-4 border-white/10", className)}>
        {/* Dynamic Gradient Background */}
        <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-90", gradient)} />
        
        {/* Inner glow effect for realism */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 rounded-full border border-white/20" />
        
        {/* The Letter */}
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative text-white font-black font-display tracking-tighter drop-shadow-md z-10 select-none"
          style={{ fontSize: 'clamp(2rem, 40%, 6rem)' }}
        >
          {initial}
        </motion.span>

        {/* Outer Ring to simulate disc rim */}
        <div className="absolute inset-2 rounded-full border-2 border-black/5 mix-blend-overlay" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || `${brand} ${name}`} 
      className={cn("object-contain drop-shadow-xl", className)} 
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
