# Dropfolio

Portfolio and airdrop tracker for EVM chains and Solana. Give it wallet addresses and it prints, per chain, the native balance, the ERC-20 token balances from a curated list, their USD values, and the outgoing transaction count, the activity number most airdrop eligibility checks look at first. Your own farming list (programs, chains, statuses, deadlines) lives in `airdrops.json` and is printed with every report, so balances and farming state stay in one place.

Everything is read from public RPC endpoints. No API key, no wallet connection, no signing: addresses are public data and the tool only reads.

## Chains covered

29 EVM chains: Ethereum, BNB Chain, Base, Polygon, Arbitrum, Optimism, Avalanche, zkSync Era, Linea, Scroll, Mantle, Blast, Taiko, Soneium, Unichain, Ink, Abstract, Berachain, Sei, Sonic, Fantom, Gnosis, Celo, Moonbeam, Cronos, Kaia, Mode, Zora, and World Chain, plus Solana. Each EVM chain has two public RPC endpoints and the reader falls back to the second when the first is down. Prices come from the free CoinGecko public API; when it rate-limits, balances still print and values show as n/a.

## ERC-20 token balances

Each chain also reads `balanceOf` for a small curated list of its main stables and wrapped assets (53 tokens across 23 chains, in `chains.mjs`): USDT, USDC, DAI, WETH, WBTC, and the chain's wrapped native where it exists. Every contract address was verified live by calling `decimals()` and `symbol()` on the chain's own RPC. Token holdings print indented under the chain's native row; only nonzero holdings print, and their USD value counts toward the wallet total. A token read that fails (for example a flaky RPC) prints as a `read failed` row and never blocks the rest of the report.

## Usage

```bash
node tracker.mjs 0xYourEvmAddress
node tracker.mjs 0xYourEvmAddress YourSolanaAddress AnotherEvmAddress
node tracker.mjs --file wallets.txt
node tracker.mjs --json 0xYourEvmAddress
node tracker.mjs --html report.html 0xYourEvmAddress
node tracker.mjs --csv report.csv 0xYourEvmAddress
```

- Positional arguments: any mix of EVM (0x...) and Solana addresses; each is detected automatically.
- `--file wallets.txt`: one address per line.
- `--json`: machine-readable report for scripts.
- `--html report.html`: also writes the same report as a single self-contained HTML page (inline CSS, no external files) that can be opened offline or shared as-is.
- `--csv report.csv`: also writes the per-chain rows as CSV (one row per native balance and per nonzero token holding, with a total row per wallet and a grand-total row when several wallets are given), so the report opens in any spreadsheet. Failed reads stay visible as rows with a `read failed` status instead of a balance.

Edit `airdrops.json` to track the programs you farm: name, chain, status, deadline, note.

## Tests

```bash
npm test
```

Runs offline with `node --test`, no RPC or network needed. Address
detection (`addresses.mjs`) and all three report formats (console in
`console.mjs`, HTML in `html.mjs`, CSV in `csv.mjs`) are tested against
recorded fixtures in `test/fixtures/`: real values from the live runs
against vitalik.eth (see `test/fixtures/README.md`), plus the boundary
shapes around the EVM and Solana address formats. If a live value
changes, update the fixture and the tests together.

## Example output

Shortened from a live run on 16 November 2026 against the well-known public vitalik.eth address. Token rows are the ERC-20 holdings on each chain; in a full run every chain prints and the total covers all of them.

```text
Wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 (EVM)
Chain        Balance              Tx count   Value
Ethereum    5.798970 ETH        5970       $10,558.65
  ↳ USDT    291.368220 USDT                $291.20
  ↳ USDC    39.192124 USDC                 $39.18
  ↳ DAI     14.372082 DAI                  $14.37
  ↳ WETH    1.468928 WETH                  $2,672.17
BNB Chain   0.170081 BNB        14         $100.70
  ↳ USDT    1224.421002 USDT               $1,223.70
  ↳ USDC    48.537247 USDC                 $48.52
  ↳ WBNB    0.000010 WBNB                  $0.01
... (29 EVM chains in total, read in parallel; the Total value line at the end of a full run sums native + token USD values)
```

## What the activity count means

For EVM chains the count is the account nonce, meaning outgoing transactions sent. For Solana it is the number of signatures on the account, capped at 1000 (shown as 1000+). Snapshots and eligibility rules usually weigh transaction count, active days, and volume together; this tool covers the count honestly and does not claim to predict eligibility.

## Roadmap

- ERC-20 token balances per chain from a curated token list (done 2026-11-16: 53 tokens, 23 chains, verified live).
- SPL token balances per chain from a curated token list.
- An HTML dashboard export (`--html report.html`) with the same data. (done 2026-11-17: new `html.mjs` renderer plus the `--html` flag in `tracker.mjs`; offline tests 6/6 pass, full pipeline verified end to end against a local stub RPC with console and HTML values identical.)
- Active-days estimation per chain from transaction history.
- CSV export for spreadsheets. (done 2026-11-18: new `csv.mjs` renderer plus the `--csv` flag in `tracker.mjs`; offline tests 11/11 pass, full pipeline verified end to end against a local stub RPC with console, HTML, and CSV values identical.)
- Recorded-fixture tests for address detection and report formatting, runnable offline with `npm test`.

## License

MIT
