import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Database, AlertTriangle, Code, BarChart3 } from 'lucide-react';
import { ServiceAudit } from '../../types';
import { Timeline } from './Timeline';
import { cn } from '../../utils';

interface DrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  audit: ServiceAudit;
}

export function DrilldownModal({ isOpen, onClose, serviceName, audit }: DrilldownModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Activity className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{serviceName}</h2>
                <p className="text-xs text-gray-500">Service Deep-Dive & Instrumentation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-center text-indigo-600 mb-2">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Session Stats</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{audit.totalCalls}</div>
                  <div className="text-xs text-gray-500">Total Requests</div>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-center text-green-600 mb-2">
                  <Database className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cache Performance</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {audit.totalCalls > 0 ? Math.round((audit.totalCacheHits / audit.totalCalls) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500">Hit Rate ({audit.totalCacheHits} hits)</div>
                </div>
              </div>
              <div className={cn(
                "p-6 rounded-2xl border",
                audit.parserDrift ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
              )}>
                <div className={cn("flex items-center mb-2", audit.parserDrift ? "text-red-600" : "text-gray-400")}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Parser Health</span>
                </div>
                <div className="space-y-1">
                  <div className={cn("text-2xl font-bold", audit.parserDrift ? "text-red-600" : "text-gray-900")}>
                    {audit.parserDrift ? 'DRIFT' : 'STABLE'}
                  </div>
                  <div className="text-xs text-gray-500">Structure Validation</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-indigo-600" />
                  Network Timeline
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 min-h-[300px]">
                  <Timeline />
                </div>
              </div>

              {/* Snapshots & Errors */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600" />
                    HTML Snapshot
                  </h3>
                  <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 font-mono text-[11px] text-green-400 overflow-x-auto h-40">
                    {audit.lastHtmlSnapshot || 'No snapshot captured.'}
                  </div>
                </div>

                {audit.lastError && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Last Error Log
                    </h3>
                    <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-xs text-red-700 break-words">
                      {audit.lastError}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
