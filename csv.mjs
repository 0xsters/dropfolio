// Renders the same per-chain rows tracker.mjs builds as CSV, one row per
// native balance and one per nonzero token holding, so the report opens in
// any spreadsheet. Failed reads stay visible as rows with a status column
// instead of a balance. Fields are quoted RFC 4180 style whenever they
// contain a comma, a quote, or a line break.
export function escapeCsv(value) {
  const s = String(value ?? '');
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const fmtBalance = (v) => (v == null ? '' : v.toFixed(6));
const fmtUsd = (v) => (v == null ? '' : v.toFixed(2));
const fmtTx = (r) => (r.txCountCapped ? r.txCount + '+' : String(r.txCount));

function walletRows(w) {
  const rows = [];
  for (const r of w.rows) {
    if (!r.ok) {
      rows.push([w.address, r.chain, 'native', r.symbol, '', '', '', 'read failed: ' + r.error]);
      continue;
    }
    rows.push([w.address, r.chain, 'native', r.symbol, fmtBalance(r.balance), fmtTx(r), fmtUsd(r.usd), 'ok']);
    for (const t of r.tokens || []) {
      if (!t.ok) { rows.push([w.address, r.chain, 'token', t.symbol, '', '', '', 'read failed: ' + t.error]); continue; }
      if (t.balance <= 0) continue;
      rows.push([w.address, r.chain, 'token', t.symbol, fmtBalance(t.balance), '', fmtUsd(t.usd), 'ok']);
    }
  }
  rows.push([w.address, '', 'total', '', '', '', fmtUsd(w.totalUsd), 'ok']);
  return rows;
}

export function renderCsv(report, grandTotal) {
  const lines = ['wallet,chain,asset_type,asset,balance,tx_count,value_usd,status'];
  for (const w of report.wallets) {
    for (const row of walletRows(w)) lines.push(row.map(escapeCsv).join(','));
  }
  if (report.wallets.length > 1) {
    lines.push(['ALL WALLETS', '', 'grand_total', '', '', '', fmtUsd(grandTotal), 'ok'].map(escapeCsv).join(','));
  }
  return lines.join('\n') + '\n';
}
