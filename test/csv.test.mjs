// Offline tests for the CSV export. Uses recorded-shaped data (the same
// shape tracker.mjs builds), so no network or RPC is needed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderCsv, escapeCsv } from '../csv.mjs';

function sampleReport() {
  return {
    wallets: [
      {
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', kind: 'evm', totalUsd: 10558.65 + 291.20,
        rows: [
          { chain: 'Ethereum', symbol: 'ETH', balance: 5.79897, txCount: 5970, usd: 10558.65, ok: true, tokens: [
            { symbol: 'USDT', balance: 291.36822, usd: 291.20, ok: true },
            { symbol: 'USDC', balance: 0, usd: null, ok: true },
            { symbol: 'WBTC', balance: 0, ok: false, error: 'HTTP 500' },
          ] },
          { chain: 'BNB Chain', symbol: 'BNB', balance: 0.170081, txCount: 14, usd: 100.70, ok: true, tokens: [] },
        ],
      },
      {
        address: 'So11111111111111111111111111111111111111112', kind: 'solana', totalUsd: 12.34,
        rows: [{ chain: 'Solana', symbol: 'SOL', balance: 0.05, txCount: 1000, txCountCapped: true, usd: 12.34, ok: true }],
      },
    ],
    farming: [],
  };
}

test('header plus one row per native balance, token holding, and wallet total', () => {
  const csv = renderCsv(sampleReport(), 10962.19);
  const lines = csv.trimEnd().split('\n');
  assert.equal(lines[0], 'wallet,chain,asset_type,asset,balance,tx_count,value_usd,status');
  assert.equal(lines[1], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Ethereum,native,ETH,5.798970,5970,10558.65,ok');
  assert.equal(lines[2], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Ethereum,token,USDT,291.368220,,291.20,ok');
  assert.equal(lines[3], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Ethereum,token,WBTC,,,,read failed: HTTP 500');
  assert.equal(lines[4], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,BNB Chain,native,BNB,0.170081,14,100.70,ok');
  assert.equal(lines[5], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,,total,,,,10849.85,ok');
  assert.equal(lines[6], 'So11111111111111111111111111111111111111112,Solana,native,SOL,0.050000,1000+,12.34,ok');
  assert.equal(lines[7], 'So11111111111111111111111111111111111111112,,total,,,,12.34,ok');
  assert.equal(lines[8], 'ALL WALLETS,,grand_total,,,,10962.19,ok');
  assert.equal(lines.length, 9);
});

test('zero-balance tokens print no row', () => {
  const csv = renderCsv(sampleReport(), 10962.19);
  assert.doesNotMatch(csv, /USDC/);
});

test('failed chain rows keep the error and no balance or value', () => {
  const report = sampleReport();
  report.wallets[0].rows.push({ chain: 'Zora', symbol: 'ETH', balance: 0, txCount: 0, usd: null, ok: false, error: 'timeout, retry later' });
  const csv = renderCsv(report, 10962.19);
  assert.match(csv, /0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Zora,native,ETH,,,,"read failed: timeout, retry later"/);
});

test('single wallet has no grand-total row', () => {
  const report = sampleReport();
  report.wallets = report.wallets.slice(0, 1);
  const csv = renderCsv(report, 10849.85);
  assert.doesNotMatch(csv, /grand_total/);
  assert.match(csv, /,total,,,,10849\.85,ok/);
});

test('escapeCsv quotes fields with commas, quotes, or line breaks', () => {
  assert.equal(escapeCsv('plain'), 'plain');
  assert.equal(escapeCsv('a,b'), '"a,b"');
  assert.equal(escapeCsv('say "hi"'), '"say ""hi"""');
  assert.equal(escapeCsv('line1\nline2'), '"line1\nline2"');
  assert.equal(escapeCsv(null), '');
});

// The recorded fixture (test/fixtures/vitalik-report.json) is the shared
// source for all three renderers: the same report must render the same
// recorded values in HTML, CSV, and the console.
test('recorded fixture renders the same values as the inline sample', async () => {
  const { readFile } = await import('node:fs/promises');
  const report = JSON.parse(await readFile(new URL('./fixtures/vitalik-report.json', import.meta.url), 'utf8'));
  const csv = renderCsv(report, 14960.84);
  const lines = csv.trimEnd().split('\n');
  assert.equal(lines[1], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Ethereum,native,ETH,5.798970,5970,10558.65,ok');
  assert.equal(lines[2], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Ethereum,token,USDT,291.368220,,291.20,ok');
  assert.equal(lines[6], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Ethereum,token,WBTC,,,,read failed: HTTP 500');
  assert.equal(lines[10], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,BNB Chain,token,WBNB,0.000010,,0.01,ok');
  assert.equal(lines[11], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,Zora,native,ETH,,,,read failed: timeout');
  assert.equal(lines[12], '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,,total,,,,14948.50,ok');
  assert.equal(lines[13], 'So11111111111111111111111111111111111111112,Solana,native,SOL,0.050000,1000+,12.34,ok');
  assert.equal(lines[14], 'So11111111111111111111111111111111111111112,,total,,,,12.34,ok');
  assert.equal(lines[15], 'ALL WALLETS,,grand_total,,,,14960.84,ok');
  assert.equal(lines.length, 16);
});
