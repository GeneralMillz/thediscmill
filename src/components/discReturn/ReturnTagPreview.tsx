import React, { useEffect, useRef } from 'react';
import { generateQRCode } from '../../utils/qr';
import { Download, Printer, Share2 } from 'lucide-react';

interface ReturnTagPreviewProps {
  encodedData: string;
  ownerInfo: any;
}

export function ReturnTagPreview({ encodedData, ownerInfo }: ReturnTagPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const returnUrl = `${window.location.origin}/return?data=${encodedData}`;

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode(returnUrl, canvasRef.current);
    }
  }, [returnUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tag card — intentionally stays white in dark mode for print correctness */}
      <div className="bg-white p-8 rounded-[2rem] border-4 border-indigo-600 shadow-2xl overflow-hidden relative print:border-black print:shadow-none">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 print:bg-black" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-1">Found This Disc?</h2>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Scan to Contact Owner</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-inner">
            <canvas ref={canvasRef} className="w-48 h-48" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Owner ID</div>
          <div className="font-mono text-sm font-bold text-indigo-600 break-all bg-indigo-50 px-4 py-2 rounded-lg">
            {ownerInfo.pdga ? `PDGA# ${ownerInfo.pdga}` : ownerInfo.name || 'ANONYMOUS'}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 text-center">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
            Powered by The Disc Mill Return Network
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold hover:bg-black dark:hover:bg-gray-600 transition-colors"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Tag
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Disc Return Tag',
                url: returnUrl
              });
            }
          }}
          className="flex items-center justify-center py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Link
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/40 p-6 rounded-2xl border border-amber-100 dark:border-amber-900 no-print">
        <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2">Pro Tip</h4>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Print this tag and tape it to the inside rim of your disc with clear packing tape. Or, simply write the URL and your unique code on the disc with a Sharpie.
        </p>
      </div>
    </div>
  );
}
