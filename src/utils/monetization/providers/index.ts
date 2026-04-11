/**
 * Monetization provider registry — scaffolding only.
 * Not imported by any existing component. Future: use in WhereToBuy and similar.
 */
import type { MonetizationProvider, MonetizableProduct } from '../../../types';
import { amazonProvider } from './amazon';
import { mvpDropshipProvider } from './mvp';

export const ALL_PROVIDERS: MonetizationProvider[] = [
  amazonProvider,
  mvpDropshipProvider,
];

/** Returns every provider that can handle the given product. */
export function getAvailableProviders(
  product: MonetizableProduct
): MonetizationProvider[] {
  return ALL_PROVIDERS.filter((p) => p.isAvailable(product));
}

/** Returns the highest-priority available provider, or null if none. */
export function getPrimaryProvider(
  product: MonetizableProduct
): MonetizationProvider | null {
  return getAvailableProviders(product)[0] ?? null;
}
