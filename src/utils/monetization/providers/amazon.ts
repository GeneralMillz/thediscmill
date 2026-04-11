/**
 * Amazon Associates provider — scaffolding only.
 * Not imported by any UI component. Future: wire through the provider registry.
 */
import { buildAmazonLink } from '../../amazon';
import type { MonetizationProvider, MonetizableProduct } from '../../../types';

export const amazonProvider: MonetizationProvider = {
  id: 'amazon',
  type: 'affiliate',

  isAvailable(product: MonetizableProduct): boolean {
    return !!(product.asin || product.amazonShort || product.amazonQuery);
  },

  getLink(product: MonetizableProduct): string | null {
    return buildAmazonLink({
      amazonShort: product.amazonShort,
      asin: product.asin,
      amazonQuery: product.amazonQuery,
    });
  },

  metadata: {
    label: 'Buy on Amazon',
    disclosure: 'As an Amazon Associate I earn from qualifying purchases.',
  },
};
