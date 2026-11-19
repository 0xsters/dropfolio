// Console rendering of the report tracker.mjs builds: one line per native
// balance, one indented line per nonzero token holding, failed reads kept
// visible, then a total per wallet and a grand total when several wallets
// are given. Kept separate from tracker.mjs so the exact console output
// can be tested offline against a recorded fixture (see test/console.test.mjs).
const fmtUsd = (v) => (v == null ? 'n/a' : '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export function formatReport(report, grandTotal) {
  const lines = [];
  for (const w of report.wallets) {
    lines.push('');
    lines.push('Wallet: ' + w.address + ' (' + w.kind.toUpperCase() + ')');
    lines.push('Chain        Balance              Tx count   Value');
    for (const r of w.rows) {
      if (!r.ok) { lines.push(r.chain.padEnd(12) + ' read failed: ' + r.error); continue; }
      const tx = r.txCountCapped ? r.txCount + '+' : String(r.txCount);
      lines.push(r.chain.padEnd(12) + (r.balance.toFixed(6) + ' ' + r.symbol).padEnd(20) + tx.padEnd(11) + fmtUsd(r.usd));
      for (const t of r.tokens || []) {
        if (!t.ok) { lines.push(('  ↳ ' + t.symbol).padEnd(12) + ' read failed: ' + t.error); continue; }
        if (t.balance <= 0) continue;
        lines.push(('  ↳ ' + t.symbol).padEnd(12) + (t.balance.toFixed(6) + ' ' + t.symbol).padEnd(20) + ''.padEnd(11) + fmtUsd(t.usd));
      }
    }
    lines.push('Total value: ' + fmtUsd(w.totalUsd));
  }
  if (report.wallets.length > 1) {
    lines.push('');
    lines.push('All wallets total: ' + fmtUsd(grandTotal));
  }
  if (report.farming.length) {
    lines.push('');
    lines.push('Airdrop farming list (from airdrops.json):');
    for (const f of report.farming) {
      lines.push('- ' + f.name + ' [' + (f.chain || '?') + '] status: ' + (f.status || '?') + (f.deadline ? ', deadline: ' + f.deadline : '') + (f.note ? ' - ' + f.note : ''));
    }
  }
  return lines;
}
