# Recorded fixtures

These files freeze real observed data so the offline tests (`npm test`)
check the formatters and address detection against values that actually
came out of the tool, not hand-invented test data.

- `vitalik-report.json`: a report in the exact shape `tracker.mjs` builds
  (`wallets` with per-chain rows and token rows, plus `farming`). The
  balances, tx counts, and token holdings are the numbers recorded from
  the live runs against the well-known public vitalik.eth address
  (`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`) on 2026-11-16 (see the
  example output in `README.md`) and the stub-verified runs of
  2026-11-17/18: Ethereum 5.798970 ETH with 5970 tx, USDT 291.368220,
  USDC 39.192124, DAI 14.372082, WETH 1.468928, a WBTC read that failed
  with HTTP 500, BNB Chain 0.170081 BNB with 14 tx, and a Solana row at
  the 1000-signature cap. The wallet and grand totals are computed from
  those recorded USD values (14948.50 and 14960.84). The Zora row records
  a chain read that failed with a timeout. The farming entry keeps the
  HTML-escaping case from the existing HTML tests.
- `addresses.json`: address strings with the kind `tracker.mjs` must
  detect for each (`evm`, `solana`, or `null` for unrecognized). The
  valid cases are real addresses (vitalik.eth, the wrapped SOL mint);
  the invalid cases are the boundary shapes around both formats.

If a live value changes, update the fixture and the tests together and
note the new recording date here.
