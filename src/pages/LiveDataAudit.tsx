import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAllAudits } from '../services/audit';
import { Activity, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { ServiceCard } from '../components/audit/ServiceCard';
import { DrilldownModal } from '../components/audit/DrilldownModal';
import { ServiceAudit } from '../types';
import { cn } from '../utils';

export function LiveDataAudit() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [selectedService, setSelectedService] = useState<{ name: string; audit: ServiceAudit } | null>(null);
  const audits = getAllAudits();

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => setLastUpdate(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Only panic for true failures — local/fallback data is healthy even if slow
  const hasPanic = Object.values(audits).some(a =>
    (!!a.lastError && !a.lastSuccessfulFetch) ||
    (a.parserDrift && !a.lastSuccessfulFetch) ||
    (a.latency > 1500 && a.dataSource === 'live')
  );
  const hasActivity = Object.keys(audits).length > 0;

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Data Health | The Disc Mill</title>
        <meta name="description" content="Live status of all The Disc Mill data sources." />
      </Helmet>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Live Data Audit</h1>
          </div>
          <p className="text-lg text-gray-600">Real-time health monitoring of external PDGA and Disc services.</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-2">
            <RefreshCw className="w-3 h-3 mr-2 animate-spin-slow" />
            Auto-refresh enabled
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Panic Banner */}
      {hasPanic && (
        <div className="mb-12 bg-red-600 text-white p-6 rounded-3xl flex items-center shadow-xl shadow-red-100 animate-pulse">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-6 shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">⚠️ System Alert: Service Degradation Detected</h2>
            <p className="text-red-100 text-sm">One or more services are failing or experiencing high latency. Check the service grid below for details.</p>
          </div>
        </div>
      )}

      {/* Service Grid */}
      {hasActivity ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(audits).map(([name, audit]) => (
            <ServiceCard 
              key={name} 
              name={name} 
              audit={audit} 
              onViewDetails={() => setSelectedService({ name, audit })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Service Activity</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            The audit store is currently empty. Start browsing courses, players, or discs to populate real-time health data.
          </p>
        </div>
      )}

      {/* Drilldown Modal */}
      {selectedService && (
        <DrilldownModal 
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          serviceName={selectedService.name}
          audit={selectedService.audit}
        />
      )}
    </div>
  );
}
