import React from 'react';
import { User, Mail, Phone, Hash, MessageSquare, ExternalLink } from 'lucide-react';

interface ScanResultProps {
  info: {
    name?: string;
    email?: string;
    phone?: string;
    pdga?: string;
    notes?: string;
  };
}

export function ScanResult({ info }: ScanResultProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{info.name || 'Anonymous Owner'}</h2>
          {info.pdga && <p className="text-indigo-600 font-bold text-sm">PDGA# {info.pdga}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {info.email && (
          <a 
            href={`mailto:${info.email}?subject=I found your disc!`}
            className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</div>
              <div className="text-sm font-bold text-gray-900 truncate">{info.email}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
          </a>
        )}

        {info.phone && (
          <a 
            href={`tel:${info.phone}`}
            className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</div>
              <div className="text-sm font-bold text-gray-900">{info.phone}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
          </a>
        )}
      </div>

      {info.notes && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <div className="flex items-center text-indigo-900 font-bold mb-3">
            <MessageSquare className="w-4 h-4 mr-2" />
            Owner's Message
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed italic">
            "{info.notes}"
          </p>
        </div>
      )}

      <div className="pt-6 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400">
          This information was provided by the owner and is encoded directly in the QR code.
        </p>
      </div>
    </div>
  );
}
