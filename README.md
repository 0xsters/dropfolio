# Dropfolio

Portfolio and airdrop tracker for EVM chains and Solana. Give it wallet addresses and it prints, per chain, the native balance, its USD value, and the outgoing transaction count, the activity number most airdrop eligibility checks look at first. Your own farming list (programs, chains, statuses, deadlines) lives in `airdrops.json` and is printed with every report, so balances and farming state stay in one place.

Everything is read from public RPC endpoints. No API key, no wallet connection, no signing: addresses are public data and the tool only reads.

## Chains covered

29 EVM chains: Ethereum, BNB Chain, Base, Polygon, Arbitrum, Optimism, Avalanche, zkSync Era, Linea, Scroll, Mantle, Blast, Taiko, Soneium, Unichain, Ink, Abstract, Berachain, Sei, Sonic, Fantom, Gnosis, Celo, Moonbeam, Cronos, Kaia, Mode, Zora, and World Chain, plus Solana. Each EVM chain has two public RPC endpoints and the reader falls back to the second when the first is down. Prices come from the free CoinGecko public API; when it rate-limits, balances still print and values show as n/a.

## Usage

```bash
node tracker.mjs 0xYourEvmAddress
node tracker.mjs 0xYourEvmAddress YourSolanaAddress AnotherEvmAddress
node tracker.mjs --file wallets.txt
node tracker.mjs --json 0xYourEvmAddress
```

- Positional arguments: any mix of EVM (0x...) and Solana addresses; each is detected automatically.
- `--file wallets.txt`: one address per line.
- `--json`: machine-readable report for scripts.

Edit `airdrops.json` to track the programs you farm: name, chain, status, deadline, note.

## Example output

Shortened from a live run on 10 November 2026 against the well-known public vitalik.eth address. In a full run every chain prints and the total covers all of them.

```text
Wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 (EVM)
Chain        Balance              Tx count   Value
Ethereum    5.793820 ETH        5970       $12,307.87
BNB Chain   0.170081 BNB        14         $117.47
Base        3.128853 ETH        70         $6,646.65
Polygon     592.719867 POL      1          $52.38
Arbitrum    0.159412 ETH        14         $338.64
Optimism    0.181080 ETH        40         $384.67
... (29 EVM chains in total, read in parallel)
Total value: $19,847.68 (rows above)
```

## What the activity count means

For EVM chains the count is the account nonce, meaning outgoing transactions sent. For Solana it is the number of signatures on the account, capped at 1000 (shown as 1000+). Snapshots and eligibility rules usually weigh transaction count, active days, and volume together; this tool covers the count honestly and does not claim to predict eligibility.

## Roadmap

- ERC-20 and SPL token balances per chain from a curated token list.
- An HTML dashboard export (`--html report.html`) with the same data.
- Active-days estimation per chain from transaction history.
- CSV export for spreadsheets.

## License

MIT
