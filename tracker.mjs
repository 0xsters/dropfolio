#!/usr/bin/env node
// Dropfolio: portfolio and airdrop tracker for EVM chains and Solana.
// Give it wallet addresses; it prints per-chain native balances, the
// ERC-20 token balances from a curated list, USD values, and the on-chain
// activity counts that airdrop eligibility checks look at, then appends
// your own farming list from airdrops.json.
//
// Usage:
//   node tracker.mjs 0xYourEvmAddress [AnotherAddress] [SolanaAddress]
//   node tracker.mjs --file wallets.txt        (one address per line)
//   node tracker.mjs --json 0x...              (machine-readable output)
//   node tracker.mjs --html report.html 0x...   (self-contained HTML report)
//   node tracker.mjs --csv report.csv 0x...     (per-chain rows as CSV)
import { readFile, writeFile } from 'node:fs/promises';
import { readEvmWallet, readSolanaWallet, fetchPrices } from './portfolio.mjs';
import { renderHtml } from './html.mjs';
import { renderCsv } from './csv.mjs';

const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const htmlIdx = args.indexOf('--html');
const htmlOut = htmlIdx >= 0 ? args[htmlIdx + 1] : null;
const csvIdx = args.indexOf('--csv');
const csvOut = csvIdx >= 0 ? args[csvIdx + 1] : null;
let addresses = args.filter((a) => !a.startsWith('--') && a !== htmlOut && a !== csvOut);
const fileIdx = args.indexOf('--file');
if (fileIdx >= 0) {
  const text = await readFile(args[fileIdx + 1], 'utf8');
  addresses = text.split('\n').map((s) => s.trim()).filter(Boolean);
}
if (htmlIdx >= 0 && !htmlOut) {
  console.error('Error: --html needs an output file path.');
  process.exit(2);
}
if (csvIdx >= 0 && !csvOut) {
  console.error('Error: --csv needs an output file path.');
  process.exit(2);
}
if (!addresses.length) {
  console.log('Usage: node tracker.mjs [--json] [--html report.html] [--csv report.csv] [--file wallets.txt] <address...>');
  process.exit(2);
}
const isEvm = (a) => /^0x[0-9a-fA-F]{40}$/.test(a);
const isSolana = (a) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a) && !isEvm(a);

const report = { wallets: [], farming: [] };
const priceIds = [];
const pending = [];
for (const address of addresses) {
  if (isEvm(address)) pending.push(readEvmWallet(address).then((rows) => ({ address, kind: 'evm', rows })));
  else if (isSolana(address)) pending.push(readSolanaWallet(address).then((row) => ({ address, kind: 'solana', rows: [row] })));
  else console.error('Skipping unrecognized address: ' + address);
}
const wallets = await Promise.all(pending);
for (const w of wallets) for (const r of w.rows) {
  if (r.ok) priceIds.push(r.coingecko);
  for (const t of r.tokens || []) if (t.ok) priceIds.push(t.coingecko);
}
const prices = await fetchPrices(priceIds);
let grandTotal = 0;
for (const w of wallets) {
  let total = 0;
  for (const r of w.rows) {
    r.usd = prices[r.coingecko] ? r.balance * prices[r.coingecko] : null; if (r.usd) total += r.usd;
    for (const t of r.tokens || []) { t.usd = t.ok && prices[t.coingecko] ? t.balance * prices[t.coingecko] : null; if (t.usd) total += t.usd; }
  }
  w.totalUsd = total; grandTotal += total;
  report.wallets.push(w);
}
try {
  const list = JSON.parse(await readFile(new URL('./airdrops.json', import.meta.url), 'utf8'));
  report.farming = list.filter((x) => x && x.name);
} catch { report.farming = []; }

if (htmlOut) {
  await writeFile(htmlOut, renderHtml(report, grandTotal), 'utf8');
  console.error('Wrote HTML report: ' + htmlOut);
}

if (csvOut) {
  await writeFile(csvOut, renderCsv(report, grandTotal), 'utf8');
  console.error('Wrote CSV report: ' + csvOut);
}

if (jsonOut) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }

const fmtUsd = (v) => (v == null ? 'n/a' : '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 }));
for (const w of report.wallets) {
  console.log('');
  console.log('Wallet: ' + w.address + ' (' + w.kind.toUpperCase() + ')');
  console.log('Chain        Balance              Tx count   Value');
  for (const r of w.rows) {
    if (!r.ok) { console.log(r.chain.padEnd(12) + ' read failed: ' + r.error); continue; }
    const tx = r.txCountCapped ? r.txCount + '+' : String(r.txCount);
    console.log(r.chain.padEnd(12) + (r.balance.toFixed(6) + ' ' + r.symbol).padEnd(20) + tx.padEnd(11) + fmtUsd(r.usd));
    for (const t of r.tokens || []) {
      if (!t.ok) { console.log(('  ↳ ' + t.symbol).padEnd(12) + ' read failed: ' + t.error); continue; }
      if (t.balance <= 0) continue;
      console.log(('  ↳ ' + t.symbol).padEnd(12) + (t.balance.toFixed(6) + ' ' + t.symbol).padEnd(20) + ''.padEnd(11) + fmtUsd(t.usd));
    }
  }
  console.log('Total value: ' + fmtUsd(w.totalUsd));
}
if (report.wallets.length > 1) console.log('\nAll wallets total: ' + fmtUsd(grandTotal));
if (report.farming.length) {
  console.log('\nAirdrop farming list (from airdrops.json):');
  for (const f of report.farming) {
    console.log('- ' + f.name + ' [' + (f.chain || '?') + '] status: ' + (f.status || '?') + (f.deadline ? ', deadline: ' + f.deadline : '') + (f.note ? ' - ' + f.note : ''));
  }
}
