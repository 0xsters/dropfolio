// Chain registry for Dropfolio. RPC endpoints are public; if one is down,
// the next one in the list is tried. Endpoint candidates come from the
// DefiLlama chainlist dataset (https://github.com/DefiLlama/chainlist) and
// every default below was live-tested before being included.
//
// Each chain may also carry a `tokens` list: a small curated set of ERC-20
// contracts (the chain's main stables and wrapped assets) whose balanceOf
// is read for every wallet. Every address below was verified live on
// 2026-11-16 by calling decimals() and symbol() against the chain's own
// RPC: the decimals match, and the symbol is the contract's on-chain
// symbol except where noted. Display labels follow the market name when
// the on-chain symbol differs: Polygon/Arbitrum USDT is the USDT0
// deployment (on-chain "USDT0"/"USD₮0"), Avalanche USDT reports "USDt",
// Celo cUSD now reports "USDm", Celo USDT reports "USD₮", Gnosis wxDAI
// reports "WXDAI", and the bridged USDC.e contracts report "USDC".
export const EVM_CHAINS = [
  { name: 'Ethereum', chainId: 1, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://ethereum-rpc.publicnode.com', 'https://cloudflare-eth.com'], tokens: [
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, coingecko: 'tether' },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, coingecko: 'dai' },
    { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, coingecko: 'weth' },
    { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, coingecko: 'wrapped-bitcoin' },
  ] },
  { name: 'BNB Chain', chainId: 56, symbol: 'BNB', coingecko: 'binancecoin', rpcs: ['https://bsc-dataseed.bnbchain.org', 'https://bsc-dataseed.binance.org'], tokens: [
    { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, coingecko: 'tether' },
    { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, coingecko: 'usd-coin' },
    { symbol: 'WBNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18, coingecko: 'binancecoin' },
  ] },
  { name: 'Base', chainId: 8453, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.base.org', 'https://base-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'USDbC', address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Polygon', chainId: 137, symbol: 'POL', coingecko: 'polygon-ecosystem-token', rpcs: ['https://polygon-bor-rpc.publicnode.com', 'https://polygon-rpc.com'], tokens: [
    { symbol: 'USDT0', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, coingecko: 'tether' },
    { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'USDC.e', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18, coingecko: 'weth' },
    { symbol: 'WPOL', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18, coingecko: 'polygon-ecosystem-token' },
  ] },
  { name: 'Arbitrum', chainId: 42161, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum-one-rpc.publicnode.com'], tokens: [
    { symbol: 'USDT0', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6, coingecko: 'tether' },
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'USDC.e', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Optimism', chainId: 10, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.optimism.io', 'https://optimism-rpc.publicnode.com'], tokens: [
    { symbol: 'USDT', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6, coingecko: 'tether' },
    { symbol: 'USDC', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'USDC.e', address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
    { symbol: 'WBTC', address: '0x68F180fCce683A3E4AB594E02D1F3dF9B2F9A9E1', decimals: 8, coingecko: 'wrapped-bitcoin' },
  ] },
  { name: 'Avalanche', chainId: 43114, symbol: 'AVAX', coingecko: 'avalanche-2', rpcs: ['https://api.avax.network/ext/bc/C/rpc', 'https://avalanche-c-chain-rpc.publicnode.com'], tokens: [
    { symbol: 'USDt', address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', decimals: 6, coingecko: 'tether' },
    { symbol: 'USDC', address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WAVAX', address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18, coingecko: 'avalanche-2' },
    { symbol: 'DAI.e', address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', decimals: 18, coingecko: 'dai' },
  ] },
  { name: 'zkSync Era', chainId: 324, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.era.zksync.io', 'https://zksync-era-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4', decimals: 6, coingecko: 'usd-coin' },
  ] },
  { name: 'Linea', chainId: 59144, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.linea.build', 'https://linea-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', decimals: 6, coingecko: 'usd-coin' },
  ] },
  { name: 'Scroll', chainId: 534352, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.scroll.io', 'https://scroll-rpc.publicnode.com'], tokens: [
    { symbol: 'WETH', address: '0x5300000000000000000000000000000000000004', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Mantle', chainId: 5000, symbol: 'MNT', coingecko: 'mantle', rpcs: ['https://rpc.mantle.xyz', 'https://mantle-rpc.publicnode.com'], tokens: [
    { symbol: 'USDT', address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE', decimals: 6, coingecko: 'tether' },
  ] },
  { name: 'Blast', chainId: 81457, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://lb.routeme.sh/rpc/evm/81457', 'https://rpc.blast.io'], tokens: [
    { symbol: 'WETH', address: '0x4300000000000000000000000000000000000004', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Taiko', chainId: 167000, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.mainnet.taiko.xyz', 'https://taiko-rpc.publicnode.com'] },
  { name: 'Soneium', chainId: 1868, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.soneium.org', 'https://soneium-rpc.publicnode.com'] },
  { name: 'Unichain', chainId: 130, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.unichain.org', 'https://unichain-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Ink', chainId: 57073, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc-gel.inkonchain.com', 'https://ink-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x2D270e6886d130D724215A266106e6832161EAEd', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Abstract', chainId: 2741, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://api.mainnet.abs.xyz', 'https://abstract-rpc.publicnode.com'] },
  { name: 'Berachain', chainId: 80094, symbol: 'BERA', coingecko: 'berachain-bera', rpcs: ['https://rpc.berachain.com', 'https://berachain-rpc.publicnode.com'], tokens: [
    { symbol: 'WBERA', address: '0x6969696969696969696969696969696969696969', decimals: 18, coingecko: 'berachain-bera' },
  ] },
  { name: 'Sei', chainId: 1329, symbol: 'SEI', coingecko: 'sei-network', rpcs: ['https://evm-rpc.sei-apis.com', 'https://sei-evm-rpc.publicnode.com'] },
  { name: 'Sonic', chainId: 146, symbol: 'S', coingecko: 'sonic-3', rpcs: ['https://rpc.soniclabs.com', 'https://sonic-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'wS', address: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38', decimals: 18, coingecko: 'sonic-3' },
  ] },
  { name: 'Fantom', chainId: 250, symbol: 'FTM', coingecko: 'fantom', rpcs: ['https://rpcapi.fantom.network', 'https://fantom-rpc.publicnode.com'], tokens: [
    { symbol: 'WFTM', address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', decimals: 18, coingecko: 'fantom' },
  ] },
  { name: 'Gnosis', chainId: 100, symbol: 'XDAI', coingecko: 'xdai', rpcs: ['https://rpc.gnosischain.com', 'https://gnosis-rpc.publicnode.com'], tokens: [
    { symbol: 'wxDAI', address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', decimals: 18, coingecko: 'xdai' },
  ] },
  { name: 'Celo', chainId: 42220, symbol: 'CELO', coingecko: 'celo', rpcs: ['https://forno.celo.org', 'https://celo-rpc.publicnode.com'], tokens: [
    { symbol: 'USDm', address: '0x765DE816845861e75A25fCA122bb6898B8B1282a', decimals: 18, coingecko: 'celo-dollar' },
    { symbol: 'USDC', address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'USDT', address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e', decimals: 6, coingecko: 'tether' },
  ] },
  { name: 'Moonbeam', chainId: 1284, symbol: 'GLMR', coingecko: 'moonbeam', rpcs: ['https://moonbeam.drpc.org', 'https://moonbeam.api.onfinality.io/public'] },
  { name: 'Cronos', chainId: 25, symbol: 'CRO', coingecko: 'crypto-com-chain', rpcs: ['https://evm.cronos.org', 'https://cronos-evm-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x3D7F2C478aAfdB65542BCB44bCeeC05849999d2D', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WCRO', address: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23', decimals: 18, coingecko: 'crypto-com-chain' },
  ] },
  { name: 'Kaia', chainId: 8217, symbol: 'KAIA', coingecko: 'kaia', rpcs: ['https://public-en.node.kaia.io', 'https://kaia-rpc.publicnode.com'] },
  { name: 'Mode', chainId: 34443, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://mainnet.mode.network', 'https://mode-rpc.publicnode.com'], tokens: [
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'Zora', chainId: 7777777, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://rpc.zora.energy', 'https://zora-rpc.publicnode.com'], tokens: [
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
  ] },
  { name: 'World Chain', chainId: 480, symbol: 'ETH', coingecko: 'ethereum', rpcs: ['https://worldchain-mainnet.g.alchemy.com/public', 'https://world-chain-rpc.publicnode.com'], tokens: [
    { symbol: 'USDC', address: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', decimals: 6, coingecko: 'usd-coin' },
    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingecko: 'weth' },
  ] },
];
export const SOLANA_RPCS = ['https://api.mainnet-beta.solana.com', 'https://solana-rpc.publicnode.com'];
export const SOLANA_COINGECKO = 'solana';
