import { test } from 'node:test';
import assert from 'node:assert';
import { brandSlug } from './brandSlug.ts';

test('brandSlug', async (t) => {
  await t.test('converts everything to lowercase', () => {
    assert.strictEqual(brandSlug('Innova'), 'innova');
    assert.strictEqual(brandSlug('MVP'), 'mvp');
  });

  await t.test('replaces spaces with hyphens', () => {
    assert.strictEqual(brandSlug('Innova Champion Discs'), 'innova-champion-discs');
  });

  await t.test('replaces non-alphanumeric characters with hyphens', () => {
    assert.strictEqual(brandSlug('EV-7'), 'ev-7');
    assert.strictEqual(brandSlug('Brand & Co'), 'brand-co');
  });

  await t.test('merges multiple non-alphanumeric characters into a single hyphen', () => {
    assert.strictEqual(brandSlug('Brand   Space'), 'brand-space');
    assert.strictEqual(brandSlug('Brand---Space'), 'brand-space');
    assert.strictEqual(brandSlug('Brand!!!Space'), 'brand-space');
  });

  await t.test('strips leading and trailing hyphens', () => {
    assert.strictEqual(brandSlug('-Innova-'), 'innova');
    assert.strictEqual(brandSlug('!!!Innova!!!'), 'innova');
  });

  await t.test('handles alphanumeric strings', () => {
    assert.strictEqual(brandSlug('discraft123'), 'discraft123');
  });

  await t.test('handles examples from documentation', () => {
    assert.strictEqual(brandSlug("Innova Champion Discs"), "innova-champion-discs");
    assert.strictEqual(brandSlug("MVP Disc Sports"), "mvp-disc-sports");
    assert.strictEqual(brandSlug("EV-7"), "ev-7");
    assert.strictEqual(brandSlug("Above Ground Level"), "above-ground-level");
  });
});
