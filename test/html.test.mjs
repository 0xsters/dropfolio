// Offline tests for the HTML dashboard export. Uses recorded-shaped data
// (the same shape tracker.mjs builds), so no network or RPC is needed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHtml, escapeHtml } from '../html.mjs';

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
    farming: [
      { name: 'Test <b>Program</b>', chain: 'Base', status: 'active', deadline: '2026-12-01', note: 'note & more' },
    ],
  };
}

test('renders one table per wallet with native rows, totals, and grand total', () => {
  const html = renderHtml(sampleReport(), 10962.19);
  assert.match(html, /Wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 \(EVM\)/);
  assert.match(html, /5\.798970 ETH/);
  assert.match(html, /\$10,558\.65/);
  assert.match(html, /Solana/);
  assert.match(html, /1000\+/);
  assert.match(html, /All wallets total: \$10,962\.19/);
});

test('token rows print only nonzero holdings, failed reads stay visible', () => {
  const html = renderHtml(sampleReport(), 10962.19);
  assert.match(html, /291\.368220 USDT/);
  assert.doesNotMatch(html, /USDC/);
  assert.match(html, /read failed: HTTP 500/);
});

test('escapes farming names and notes instead of injecting HTML', () => {
  const html = renderHtml(sampleReport(), 10962.19);
  assert.doesNotMatch(html, /<b>Program<\/b>/);
  assert.match(html, /Test &lt;b&gt;Program&lt;\/b&gt;/);
  assert.match(html, /note &amp; more/);
});

test('escapeHtml escapes all five special characters', () => {
  assert.equal(escapeHtml('<a href="x">&\'y</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;y&lt;/a&gt;');
});

test('single wallet has no grand-total line and empty farming prints nothing', () => {
  const report = sampleReport();
  report.wallets = report.wallets.slice(0, 1);
  report.farming = [];
  const html = renderHtml(report, 10849.85);
  assert.doesNotMatch(html, /All wallets total/);
  assert.doesNotMatch(html, /Airdrop farming list/);
});

test('failed chain rows print the error and keep the report going', () => {
  const report = sampleReport();
  report.wallets[0].rows.push({ chain: 'Zora', symbol: 'ETH', balance: 0, txCount: 0, usd: null, ok: false, error: 'timeout' });
  const html = renderHtml(report, 10962.19);
  assert.match(html, /Zora<\/td><td colspan="3">read failed: timeout/);
});

// The recorded fixture (test/fixtures/vitalik-report.json) is the shared
// source for all three renderers: the same report must render the same
// recorded values in HTML, CSV, and the console.
test('recorded fixture renders the same values as the inline sample', async () => {
  const { readFile } = await import('node:fs/promises');
  const report = JSON.parse(await readFile(new URL('./fixtures/vitalik-report.json', import.meta.url), 'utf8'));
  const html = renderHtml(report, 14960.84);
  assert.match(html, /5\.798970 ETH/);
  assert.match(html, /291\.368220 USDT/);
  assert.match(html, /\$14,948\.50/);
  assert.match(html, /All wallets total: \$14,960\.84/);
  assert.match(html, /read failed: HTTP 500/);
  assert.match(html, /Zora<\/td><td colspan="3">read failed: timeout/);
  assert.match(html, /1000\+/);
});
