// Renders the same report tracker.mjs builds as a single self-contained
// HTML page: no external CSS, fonts, or scripts, so the file can be opened
// offline or shared as-is. Every string that comes from an address, a chain
// name, or airdrops.json is HTML-escaped before it is written out.
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const fmtUsd = (v) => (v == null ? 'n/a' : '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 }));
const fmtBalance = (balance, symbol) => balance.toFixed(6) + ' ' + symbol;

function walletSection(w) {
  const rows = w.rows.map((r) => {
    if (!r.ok) return `<tr class="failed"><td>${escapeHtml(r.chain)}</td><td colspan="3">read failed: ${escapeHtml(r.error)}</td></tr>`;
    const tx = r.txCountCapped ? r.txCount + '+' : String(r.txCount);
    let html = `<tr><td>${escapeHtml(r.chain)}</td><td>${fmtBalance(r.balance, r.symbol)}</td><td>${tx}</td><td>${fmtUsd(r.usd)}</td></tr>`;
    for (const t of r.tokens || []) {
      if (!t.ok) { html += `<tr class="failed"><td>&#8627; ${escapeHtml(t.symbol)}</td><td colspan="3">read failed: ${escapeHtml(t.error)}</td></tr>`; continue; }
      if (t.balance <= 0) continue;
      html += `<tr class="token"><td>&#8627; ${escapeHtml(t.symbol)}</td><td>${fmtBalance(t.balance, t.symbol)}</td><td></td><td>${fmtUsd(t.usd)}</td></tr>`;
    }
    return html;
  }).join('\n');
  return `<section>
<h2>Wallet: ${escapeHtml(w.address)} (${escapeHtml(w.kind.toUpperCase())})</h2>
<table>
<thead><tr><th>Chain</th><th>Balance</th><th>Tx count</th><th>Value</th></tr></thead>
<tbody>
${rows}
</tbody>
<tfoot><tr><td colspan="3">Total value</td><td>${fmtUsd(w.totalUsd)}</td></tr></tfoot>
</table>
</section>`;
}

export function renderHtml(report, grandTotal) {
  const generated = new Date().toISOString();
  const wallets = report.wallets.map(walletSection).join('\n');
  const allTotal = report.wallets.length > 1
    ? `<p class="grand-total">All wallets total: ${fmtUsd(grandTotal)}</p>` : '';
  const farming = report.farming.length
    ? `<section>
<h2>Airdrop farming list</h2>
<ul>
${report.farming.map((f) => `<li><strong>${escapeHtml(f.name)}</strong> [${escapeHtml(f.chain || '?')}] status: ${escapeHtml(f.status || '?')}${f.deadline ? `, deadline: ${escapeHtml(f.deadline)}` : ''}${f.note ? ` - ${escapeHtml(f.note)}` : ''}</li>`).join('\n')}
</ul>
</section>` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dropfolio report</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #111; }
h1 { font-size: 1.5rem; }
h2 { font-size: 1.1rem; margin-top: 2rem; word-break: break-all; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 1px solid #ddd; }
th { background: #f4f4f4; }
tr.token td:first-child { padding-left: 1.5rem; }
tr.failed td { color: #a00; }
tfoot td { font-weight: bold; }
.grand-total { font-weight: bold; }
.meta { color: #555; font-size: 0.9rem; }
</style>
</head>
<body>
<h1>Dropfolio report</h1>
<p class="meta">Generated ${escapeHtml(generated)}. Balances are read from public RPCs; USD values come from CoinGecko and show as n/a when the price feed is unavailable. Tx count is the outgoing transaction count (nonce) for EVM chains and the signature count, capped at 1000, for Solana.</p>
${wallets}
${allTotal}
${farming}
</body>
</html>
`;
}
