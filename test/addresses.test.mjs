// Offline tests for wallet address detection. Cases come from the
// recorded fixture test/fixtures/addresses.json: real addresses plus the
// boundary shapes around both formats. No network is needed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { detectAddress, isEvm, isSolana } from '../addresses.mjs';

const cases = JSON.parse(await readFile(new URL('./fixtures/addresses.json', import.meta.url), 'utf8'));

test('detectAddress classifies every recorded fixture case', () => {
  for (const c of cases) {
    assert.equal(detectAddress(c.input), c.expected, c.note + ': ' + JSON.stringify(c.input));
  }
});

test('isEvm accepts only 0x plus 40 hex characters', () => {
  assert.equal(isEvm('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'), true);
  assert.equal(isEvm('0xd8da6bf26964af9d7eed9e03e53415d37aa96045'), true);
  assert.equal(isEvm('0x0000000000000000000000000000000000000000'), true);
  assert.equal(isEvm('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA9604'), false);
  assert.equal(isEvm('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA960455'), false);
  assert.equal(isEvm('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045'), false);
  assert.equal(isEvm(''), false);
});

test('isSolana accepts 32-44 base58 characters and never a 0x address', () => {
  assert.equal(isSolana('So11111111111111111111111111111111111111112'), true);
  assert.equal(isSolana('DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK'), true);
  assert.equal(isSolana('11111111111111111111111111111111'), true);
  assert.equal(isSolana('1111111111111111111111111111111'), false);
  assert.equal(isSolana('So111111111111111111111111111111111111111120'), false);
  assert.equal(isSolana('So1111111111111111111111111111111111111111l'), false);
  assert.equal(isSolana('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'), false);
  assert.equal(isSolana(''), false);
});
