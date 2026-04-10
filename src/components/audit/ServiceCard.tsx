import React from 'react';
import { ServiceAudit } from '../../types';
import { StatusIndicator } from './StatusIndicator';
import { Clock, Globe, Database, ArrowRight, HardDrive, Layers } from 'lucide-react';
import { formatDate, cn } from '../../utils';

interface ServiceCardProps {
  name: string;
  audit: ServiceAudit;
  onViewDetails: () => void;
}

type ServiceStatus = 'ok' | 'local' | 'fallback' | 'slow' | 'error';

function getStatus(audit: ServiceAudit): ServiceStatus {
  if (audit.lastError && !audit.lastSuccessfulFetch) return 'error';
  if (audit.parserDrift) return 'error';
  if (audit.dataSource === 'local') return 'local';
  if (audit.dataSource === 'local-fallback') return 'fallback';
  if (audit.latency > 1500) return 'slow';
  return 'ok';
}

const STATUS_STYLES: Record<ServiceStatus, {
  border: string;
  header: string;
  badge: string;
  badgeText: string;
  label: string;
}> = {
  ok:       { border: 'border-green-200',  header: 'bg-green-50/50 border-green-100',   badge: 'bg-green-100',  badgeText: 'text-green-700',  label: 'OK' },
  local:    { border: 'border-blue-200',   header: 'bg-blue-50/50 border-blue-100',     badge: 'bg-blue-100',   badgeText: 'text-blue-700',   label: 'Local' },
  fallback: { border: 'border-amber-200',  header: 'bg-amber-50/50 border-amber-100',   badge: 'bg-amber-100',  badgeText: 'text-amber-700',  label: 'Fallback' },
  slow:     { border: 'border-yellow-200', header: 'bg-yellow-50/50 border-yellow-100', badge: 'bg-yellow-100', badgeText: 'text-yellow-700', label: 'Slow' },
  error:    { border: 'border-red-200',    header: 'bg-red-50/50 border-red-100',       badge: 'bg-red-100',    badgeText: 'text-red-700',    label: 'Error' },
};

// Human-readable source label
function sourceLabel(audit: ServiceAudit): string {
  if (audit.cacheHit) return 'In-Memory Cache';
  if (audit.dataSource === 'live') return audit.lastProxyUsed || 'Direct';
  if (audit.dataSource === 'local') return 'Local File';
  if (audit.dataSource === 'local-fallback') return 'Local Fallback';
  if (audit.lastProxyUsed) return audit.lastProxyUsed;
  return 'None';
}

// Icon for source type
function SourceIcon({ audit }: { audit: ServiceAudit }) {
  if (audit.cacheHit) return <Database className="w-3.5 h-3.5 mr-2" />;
  if (audit.dataSource === 'local' || audit.dataSource === 'local-fallback') return <HardDrive className="w-3.5 h-3.5 mr-2" />;
  return <Globe className="w-3.5 h-3.5 mr-2" />;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ name, audit, onViewDetails }) => {
  const status = getStatus(audit);
  const styles = STATUS_STYLES[status];

  return (
    <div className={cn(
      'bg-white border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md group',
      styles.border
    )}>
      {/* Header */}
      <div className={cn(
        'px-4 py-3 flex justify-between items-center border-b',
        styles.header
      )}>
        <h3 className="font-bold text-gray-900 uppercase tracking-tight text-sm">{name}</h3>
        <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider', styles.badge, styles.badgeText)}>
          {styles.label}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {/* Latency */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5 mr-2" />
            Latency
          </div>
          <span className={cn(
            'font-mono font-bold text-sm',
            audit.latency > 1500 ? 'text-red-600' : audit.latency > 500 ? 'text-amber-600' : 'text-green-600'
          )}>
            {audit.latency}ms
          </span>
        </div>

        {/* Source / Proxy */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400 text-xs">
            <SourceIcon audit={audit} />
            Source
          </div>
          <span className="text-gray-900 font-medium text-xs">{sourceLabel(audit)}</span>
        </div>

        {/* Cache */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400 text-xs">
            <Database className="w-3.5 h-3.5 mr-2" />
            Cache
          </div>
          <span className={cn('text-xs font-bold', audit.cacheHit ? 'text-green-600' : 'text-gray-400')}>
            {audit.cacheHit ? 'HIT' : 'MISS'}
          </span>
        </div>

        {/* Item count (discs, courses, etc.) */}
        {audit.itemCount !== undefined && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-400 text-xs">
              <Layers className="w-3.5 h-3.5 mr-2" />
              Items
            </div>
            <span className="text-indigo-600 font-black text-sm">{audit.itemCount.toLocaleString()}</span>
          </div>
        )}

        {/* Fallback explanation */}
        {status === 'fallback' && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-[10px] text-amber-700 font-medium leading-relaxed">
            Live API unavailable — serving from local catalog. Data is complete but not real-time.
          </div>
        )}

        {/* Local explanation */}
        {status === 'local' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-[10px] text-blue-700 font-medium leading-relaxed">
            Served from bundled local data. No external request needed.
          </div>
        )}

        {/* Last success */}
        <div className="pt-3 border-t border-gray-50">
          <div className="text-[10px] text-gray-400 mb-1 uppercase font-bold">Last Success</div>
          <div className="text-xs text-gray-900 font-medium">
            {audit.lastSuccessfulFetch ? formatDate(audit.lastSuccessfulFetch) : 'Never'}
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center py-2 px-4 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all group"
        >
          View Details
          <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
