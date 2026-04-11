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
          className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                <Activity className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{serviceName}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Service Deep-Dive &amp; Instrumentation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Session Stats</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{audit.totalCalls}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Requests</div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/40 p-6 rounded-2xl border border-green-100 dark:border-green-900">
                <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                  <Database className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cache Performance</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {audit.totalCalls > 0 ? Math.round((audit.totalCacheHits / audit.totalCalls) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Hit Rate ({audit.totalCacheHits} hits)</div>
                </div>
              </div>
              <div className={cn(
                "p-6 rounded-2xl border",
                audit.parserDrift
                  ? "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"
              )}>
                <div className={cn("flex items-center mb-2", audit.parserDrift ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500")}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Parser Health</span>
                </div>
                <div className="space-y-1">
                  <div className={cn("text-2xl font-bold", audit.parserDrift ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white")}>
                    {audit.parserDrift ? 'DRIFT' : 'STABLE'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Structure Validation</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Network Timeline
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 min-h-[300px]">
                  <Timeline />
                </div>
              </div>

              {/* Snapshots & Errors */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
                    <Code className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    HTML Snapshot
                  </h3>
                  <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 font-mono text-[11px] text-green-400 overflow-x-auto h-32 sm:h-40">
                    {audit.lastHtmlSnapshot || 'No snapshot captured.'}
                  </div>
                </div>

                {audit.lastError && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Last Error Log
                    </h3>
                    <div className="bg-red-50 dark:bg-red-950/40 rounded-2xl p-4 border border-red-100 dark:border-red-900 text-xs text-red-700 dark:text-red-300 break-words">
                      {audit.lastError}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Close Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
