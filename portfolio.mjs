// Balance and activity readers. All reads are plain JSON-RPC against public
// endpoints; no API key is needed and no wallet connection ever happens.
import { EVM_CHAINS, SOLANA_RPCS, SOLANA_COINGECKO } from './chains.mjs';

async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'rpc error');
  return data.result;
}

async function evmCall(chain, method, params) {
  let lastErr;
  for (const rpc of chain.rpcs) {
    try { return await post(rpc, { jsonrpc: '2.0', id: 1, method, params }); }
    catch (e) { lastErr = e; }
  }
  throw lastErr;
}

export async function readEvmWallet(address) {
  // Chains are read in parallel so a long chain list stays fast.
  return Promise.all(EVM_CHAINS.map(async (chain) => {
    try {
      const balHex = await evmCall(chain, 'eth_getBalance', [address, 'latest']);
      const nonceHex = await evmCall(chain, 'eth_getTransactionCount', [address, 'latest']);
      return { chain: chain.name, symbol: chain.symbol, coingecko: chain.coingecko, balance: Number(BigInt(balHex)) / 1e18, txCount: parseInt(nonceHex, 16), ok: true };
    } catch (e) {
      return { chain: chain.name, symbol: chain.symbol, coingecko: chain.coingecko, balance: 0, txCount: 0, ok: false, error: String(e.message || e) };
    }
  }));
}

export async function readSolanaWallet(address) {
  let lastErr;
  for (const rpc of SOLANA_RPCS) {
    try {
      const bal = await post(rpc, { jsonrpc: '2.0', id: 1, method: 'getBalance', params: [address] });
      const sigs = await post(rpc, { jsonrpc: '2.0', id: 1, method: 'getSignaturesForAddress', params: [address, { limit: 1000 }] });
      return { chain: 'Solana', symbol: 'SOL', coingecko: SOLANA_COINGECKO, balance: bal.value / 1e9, txCount: sigs.length, txCountCapped: sigs.length >= 1000, ok: true };
    } catch (e) { lastErr = e; }
  }
  return { chain: 'Solana', symbol: 'SOL', coingecko: SOLANA_COINGECKO, balance: 0, txCount: 0, ok: false, error: String(lastErr.message || lastErr) };
}

export async function fetchPrices(ids) {
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + [...new Set(ids)].join(',') + '&vs_currencies=usd';
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    const out = {};
    for (const [id, v] of Object.entries(data)) out[id] = v.usd;
    return out;
  } catch { return {}; }
}
