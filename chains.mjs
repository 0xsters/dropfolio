// Chain registry for Dropfolio. RPC endpoints are public; if one is down,
// the next one in the list is tried. Endpoint candidates come from the
// DefiLlama chainlist dataset (https://github.com/DefiLlama/chainlist) and
// every default below was live-tested before being included.
export const EVM_CHAINS = [
  { name: 'Ethereum', chainId: 1, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://ethereum-rpc.publicnode.com', 'https://cloudflare-eth.com'] },
  { name: 'BNB Chain', chainId: 56, symbol: 'BNB', coingecko: 'binancecoin', rpcs: ['https://bsc-dataseed.bnbchain.org', 'https://bsc-dataseed.binance.org'] },
  { name: 'Base', chainId: 8453, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.base.org', 'https://base-rpc.publicnode.com'] },
  { name: 'Polygon', chainId: 137, symbol: 'POL', coingecko: 'polygon-ecosystem-token', rpcs: ['https://polygon-bor-rpc.publicnode.com', 'https://polygon-rpc.com'] },
  { name: 'Arbitrum', chainId: 42161, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum-one-rpc.publicnode.com'] },
  { name: 'Optimism', chainId: 10, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.optimism.io', 'https://optimism-rpc.publicnode.com'] },
  { name: 'Avalanche', chainId: 43114, symbol: 'AVAX', coingecko: 'avalanche-2', rpcs: ['https://api.avax.network/ext/bc/C/rpc', 'https://avalanche-c-chain-rpc.publicnode.com'] },
  { name: 'zkSync Era', chainId: 324, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.era.zksync.io', 'https://zksync-era-rpc.publicnode.com'] },
  { name: 'Linea', chainId: 59144, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.linea.build', 'https://linea-rpc.publicnode.com'] },
  { name: 'Scroll', chainId: 534352, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.scroll.io', 'https://scroll-rpc.publicnode.com'] },
  { name: 'Mantle', chainId: 5000, symbol: 'MNT', coingecko: 'mantle', rpcs: ['https://rpc.mantle.xyz', 'https://mantle-rpc.publicnode.com'] },
  { name: 'Blast', chainId: 81457, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://lb.routeme.sh/rpc/evm/81457', 'https://rpc.blast.io'] },
  { name: 'Taiko', chainId: 167000, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.mainnet.taiko.xyz', 'https://taiko-rpc.publicnode.com'] },
  { name: 'Soneium', chainId: 1868, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.soneium.org', 'https://soneium-rpc.publicnode.com'] },
  { name: 'Unichain', chainId: 130, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.unichain.org', 'https://unichain-rpc.publicnode.com'] },
  { name: 'Ink', chainId: 57073, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc-gel.inkonchain.com', 'https://ink-rpc.publicnode.com'] },
  { name: 'Abstract', chainId: 2741, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://api.mainnet.abs.xyz', 'https://abstract-rpc.publicnode.com'] },
  { name: 'Berachain', chainId: 80094, symbol: 'BERA', coingecko: 'berachain-bera', rpcs: ['https://rpc.berachain.com', 'https://berachain-rpc.publicnode.com'] },
  { name: 'Sei', chainId: 1329, symbol: 'SEI', coingecko: 'sei-network', rpcs: ['https://evm-rpc.sei-apis.com', 'https://sei-evm-rpc.publicnode.com'] },
  { name: 'Sonic', chainId: 146, symbol: 'S', coingecko: 'sonic-3', rpcs: ['https://rpc.soniclabs.com', 'https://sonic-rpc.publicnode.com'] },
  { name: 'Fantom', chainId: 250, symbol: 'FTM', coingecko: 'fantom', rpcs: ['https://rpcapi.fantom.network', 'https://fantom-rpc.publicnode.com'] },
  { name: 'Gnosis', chainId: 100, symbol: 'XDAI', coingecko: 'xdai', rpcs: ['https://rpc.gnosischain.com', 'https://gnosis-rpc.publicnode.com'] },
  { name: 'Celo', chainId: 42220, symbol: 'CELO', coingecko: 'celo', rpcs: ['https://forno.celo.org', 'https://celo-rpc.publicnode.com'] },
  { name: 'Moonbeam', chainId: 1284, symbol: 'GLMR', coingecko: 'moonbeam', rpcs: ['https://moonbeam.drpc.org', 'https://moonbeam.api.onfinality.io/public'] },
  { name: 'Cronos', chainId: 25, symbol: 'CRO', coingecko: 'crypto-com-chain', rpcs: ['https://evm.cronos.org', 'https://cronos-evm-rpc.publicnode.com'] },
  { name: 'Kaia', chainId: 8217, symbol: 'KAIA', coingecko: 'kaia', rpcs: ['https://public-en.node.kaia.io', 'https://kaia-rpc.publicnode.com'] },
  { name: 'Mode', chainId: 34443, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.mode.network', 'https://mode-rpc.publicnode.com'] },
  { name: 'Zora', chainId: 7777777, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.zora.energy', 'https://zora-rpc.publicnode.com'] },
  { name: 'World Chain', chainId: 480, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://worldchain-mainnet.g.alchemy.com/public', 'https://world-chain-rpc.publicnode.com'] },
];
export const SOLANA_RPCS = ['https://api.mainnet-beta.solana.com', 'https://solana-rpc.publicnode.com'];
export const SOLANA_COINGECKO = 'solana';
