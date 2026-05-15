import React, { useEffect, useState } from 'react';
import { SEO } from '../../components/SEO';
import { ShieldCheck } from 'lucide-react';

export function OutboundAnalytics() {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <SEO title="Analytics Dashboard" description="Track outbound clicks and platform performance." />

      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-500" /> Analytics Dashboard
        </h1>
        <p className="text-gray-500 max-w-3xl leading-relaxed">
          The local storage fallback has been removed. All analytics tracking is now strictly routed through Google Analytics 4 (GA4). You can view the outbound click events within your Google Analytics dashboard.
        </p>
      </div>

    </div>
  );
}
