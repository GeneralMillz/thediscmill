/**
 * MVP Disc Sports dropship provider — scaffolding only.
 * Not imported by any UI component. Future: wire through the provider registry.
 */
import type { MonetizationProvider, MonetizableProduct } from '../../../types';

export const mvpDropshipProvider: MonetizationProvider = {
  id: 'mvp-dropship',
  type: 'dropship',

  isAvailable(product: MonetizableProduct): boolean {
    return (
      product.monetizationType === 'dropship' &&
      product.providerId === 'mvp-dropship'
    );
  },

  getLink(_product: MonetizableProduct): string | null {
    return 'https://www.mvpdiscsports.com/dealers/?ref=thediscmill';
  },

  metadata: {
    label: 'Order from MVP',
    disclosure:
      "You'll order directly from the manufacturer. The Disc Mill may receive a referral fee.",
  },
};
