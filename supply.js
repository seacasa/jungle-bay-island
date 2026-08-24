// Public mirror of the live function at https://memetics.wtf/api/supply
// api/supply.js — chain-true $BAYLA supply, numeric-only (CMC endpoint format)
// /api/supply?q=total and /api/supply?q=circulating both answer the same number:
// supply is fixed, fully minted, mint authority disabled, so total = circulating.
// The number is read live from Solana getTokenSupply (UI units, 6 decimals),
// never hardcoded. On RPC failure this answers 502 "unavailable", never a stale guess.
const MINT = '7hmVkPXmVagxoptAEpx4jBzZVHwGLdFj6c1y42qxpump';
const RPCS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-rpc.publicnode.com'
];

module.exports = async (req, res) => {
  try {
    let amt = null;
    for (const url of RPCS) {
      try {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTokenSupply', params: [MINT] })
        });
        if (!r.ok) continue;
        const j = await r.json();
        const v = j && j.result && j.result.value;
        if (v && v.uiAmountString) { amt = v.uiAmountString; break; }
      } catch (e) { /* try next rpc */ }
    }
    if (amt === null) {
      res.statusCode = 502;
      res.setHeader('content-type', 'text/plain');
      res.end('unavailable');
      return;
    }
    res.setHeader('content-type', 'text/plain');
    res.setHeader('cache-control', 's-maxage=300, stale-while-revalidate=3600');
    res.end(String(amt));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('error');
  }
};
