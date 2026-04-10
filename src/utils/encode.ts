/**
 * URL-safe Base64 encoding and decoding for payload data.
 */

/**
 * Encodes a JSON object into a URL-safe Base64 string.
 * @param payload The object to encode.
 * @returns A URL-safe Base64 string.
 */
export function encodePayload(payload: any): string {
  try {
    const jsonStr = JSON.stringify(payload);
    // Use btoa for Base64 encoding
    // Replace characters to make it URL-safe
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode payload', err);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back into a JSON object.
 * @param encoded The encoded string.
 * @returns The decoded object.
 */
export function decodePayload(encoded: string): any {
  try {
    // Restore characters for standard Base64
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if necessary
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to decode payload', err);
    throw new Error('Invalid payload');
  }
}
