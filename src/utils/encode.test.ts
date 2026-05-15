import { test } from 'node:test';
import assert from 'node:assert';
import { encodePayload, decodePayload } from './encode.ts';

test('encodePayload and decodePayload should work for simple objects', () => {
  const payload = { name: 'John Doe', email: 'john@example.com' };
  const encoded = encodePayload(payload);
  const decoded = decodePayload(encoded);
  assert.deepStrictEqual(decoded, payload);
});

test('encodePayload and decodePayload should handle Unicode characters', () => {
  const payload = { name: 'Jöhn Döe', message: '🚀 Sky is not the limit' };
  const encoded = encodePayload(payload);
  const decoded = decodePayload(encoded);
  assert.deepStrictEqual(decoded, payload);
});

test('decodePayload should throw error for invalid payload', () => {
  assert.throws(() => {
    decodePayload('invalid-base64!');
  }, /Invalid payload/);
});

test('encodePayload should return empty string on error', () => {
  // btoa might fail on non-stringifiable or very large data, though JSON.stringify usually handles it
  // or if we pass something that causes JSON.stringify to throw (like circular reference)
  const circular: any = {};
  circular.self = circular;
  assert.strictEqual(encodePayload(circular), '');
});

test('decodePayload should handle potential prototype pollution', () => {
  // This is a direct test of the JSON.parse vulnerability
  // In many JS environments, JSON.parse('{"__proto__": {"polluted": true}}')
  // actually creates an object where the __proto__ property is set.
  const maliciousJSON = '{"__proto__": {"polluted": true}, "name": "attacker"}';
  const bytes = new TextEncoder().encode(maliciousJSON);
  const binString = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  const base64 = btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  assert.throws(() => {
    decodePayload(base64);
  }, /Invalid payload/);
});
