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
    // Use TextEncoder to handle Unicode characters correctly
    const bytes = new TextEncoder().encode(jsonStr);
    const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
    const base64 = btoa(binString);

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
    
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);

    // Security check: use a reviver to prevent prototype pollution at any level
    const payload = JSON.parse(jsonStr, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        throw new Error('Insecure key detected');
      }
      return value;
    });

    // Ensure the payload is an object (or null) as expected
    if (payload !== null && typeof payload !== 'object') {
      throw new Error('Invalid payload type');
    }

    return payload;
  } catch (err) {
    console.error('Failed to decode payload', err);
    throw new Error('Invalid payload');
  }
}
