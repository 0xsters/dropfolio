// Offline tests for the console report. The report comes from the recorded
// fixture test/fixtures/vitalik-report.json (live vitalik.eth values from
// 2026-11-16, see test/fixtures/README.md), so the expected lines below
// freeze the exact console output: column padding, the 1000+ cap, token
// rows, and how failed reads print. No network is needed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { formatReport } from '../console.mjs';

const report = JSON.parse(await readFile(new URL('./fixtures/vitalik-report.json', import.meta.url), 'utf8'));
const GRAND_TOTAL = 14960.84;

const expectedLines = [
  '',
  'Wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 (EVM)',
  'Chain        Balance              Tx count   Value',
  'Ethereum    5.798970 ETH        5970       $10,558.65',
  '  ↳ USDT    291.368220 USDT                $291.20',
  '  ↳ USDC    39.192124 USDC                 $39.18',
  '  ↳ DAI     14.372082 DAI                  $14.37',
  '  ↳ WETH    1.468928 WETH                  $2,672.17',
  '  ↳ WBTC     read failed: HTTP 500',
  'BNB Chain   0.170081 BNB        14         $100.70',
  '  ↳ USDT    1224.421002 USDT               $1,223.70',
  '  ↳ USDC    48.537247 USDC                 $48.52',
  '  ↳ WBNB    0.000010 WBNB                  $0.01',
  'Zora         read failed: timeout',
  'Total value: $14,948.50',
  '',
  'Wallet: So11111111111111111111111111111111111111112 (SOLANA)',
  'Chain        Balance              Tx count   Value',
  'Solana      0.050000 SOL        1000+      $12.34',
  'Total value: $12.34',
  '',
  'All wallets total: $14,960.84',
  '',
  'Airdrop farming list (from airdrops.json):',
  '- Test <b>Program</b> [Base] status: active, deadline: 2026-12-01 - note & more',
];

test('console output matches the recorded fixture line for line', () => {
  assert.deepEqual(formatReport(report, GRAND_TOTAL), expectedLines);
});

test('zero-balance tokens print no row, failed token reads stay visible', () => {
  const lines = formatReport(report, GRAND_TOTAL);
  assert.ok(lines.some((l) => l.includes('291.368220 USDT')));
  assert.ok(!lines.some((l) => l.includes('USDC') && l.includes('0.000000')));
  assert.ok(lines.some((l) => l.includes('read failed: HTTP 500')));
});

test('single wallet has no grand-total line and empty farming prints nothing', () => {
  const single = { wallets: report.wallets.slice(0, 1), farming: [] };
  const lines = formatReport(single, 14948.5);
  assert.ok(!lines.some((l) => l.includes('All wallets total')));
  assert.ok(!lines.some((l) => l.includes('Airdrop farming list')));
  assert.ok(lines.some((l) => l === 'Total value: $14,948.50'));
});

test('a null USD value prints as n/a instead of a dollar amount', () => {
  const noPrices = JSON.parse(JSON.stringify(report));
  noPrices.wallets[0].rows[0].usd = null;
  noPrices.wallets[0].rows[0].tokens.forEach((t) => { t.usd = null; });
  const lines = formatReport(noPrices, null);
  assert.ok(lines.some((l) => l.includes('5.798970 ETH') && l.endsWith('n/a')));
  assert.ok(lines.some((l) => l.includes('291.368220 USDT') && l.endsWith('n/a')));
});
