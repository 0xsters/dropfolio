// Wallet address detection. EVM addresses are 0x plus 40 hex characters;
// Solana addresses are 32-44 base58 characters (no 0, O, I, or l). The
// two shapes do not overlap, but EVM is still checked first so a 0x
// address is never mistaken for a Solana one.
export const isEvm = (a) => /^0x[0-9a-fA-F]{40}$/.test(a);
export const isSolana = (a) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a) && !isEvm(a);

// 'evm' | 'solana' | null (unrecognized: tracker.mjs skips it with a warning).
export function detectAddress(address) {
  if (isEvm(address)) return 'evm';
  if (isSolana(address)) return 'solana';
  return null;
}
