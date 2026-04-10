import React from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { buildAmazonLink } from '../../utils/amazon';

interface WhereToBuyProps {
  asin?: string;
  amazonShort?: string;
  amazonQuery?: string;
  sku?: string;
  brand?: string;
}

export function WhereToBuy({ asin, amazonShort, amazonQuery, sku, brand }: WhereToBuyProps) {
  const amazonHref = buildAmazonLink({ amazonShort, asin, amazonQuery });
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <ShoppingBag className="mr-2 w-5 h-5 text-indigo-600" />
        Where to Buy
      </h3>
      <div className="space-y-3">
        {amazonHref && (
          <a
            href={amazonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-4 mr-3" loading="lazy" referrerPolicy="no-referrer" />
              <span className="text-sm font-medium text-gray-700">Amazon</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
          </a>
        )}
        {false && sku && (
          <a 
            href={`https://otbdiscs.com/product/${sku}/?ref=thediscmill`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex items-center">
              <img src="https://otbdiscs.com/wp-content/uploads/2018/06/OTB-Discs-Logo-300x150.png" alt="OTB" className="h-4 mr-3" loading="lazy" referrerPolicy="no-referrer" />
              <span className="text-sm font-medium text-gray-700">OTB Discs</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
          </a>
        )}
      </div>
      <p className="mt-4 text-[10px] text-gray-400 leading-tight">
        * The Disc Mill may earn a small commission from qualifying purchases made through these links.
      </p>
    </div>
  );
}
