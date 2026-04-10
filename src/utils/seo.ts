export const SITE_NAME = 'The Disc Mill';
export const SITE_URL = 'https://thediscmill.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export function buildTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  return `${SITE_URL}${path}`;
}
