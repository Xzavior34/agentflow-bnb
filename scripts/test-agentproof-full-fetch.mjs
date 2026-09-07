import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function testAgent(tokenId) {
  const agentId = `bsc:${tokenId}`;
  const base = `https://agentproof-rho.vercel.app/api/v1/agents/bsc/${agentId}`;
  
  const [rel, rep, srv] = await Promise.all([
    fetchUrl(`${base}/reliability`),
    fetchUrl(`${base}/reputation-integrity`),
    fetchUrl(`${base}/services`)
  ]);

  console.log(`\n=== Agent ${agentId} ===`);
  console.log('Reliability status:', rel.status, rel.data?.data ? 'Data returned' : 'No data');
  if (rel.data?.data?.windows) {
    console.log('  Windows:', Object.keys(rel.data.data.windows));
    const w24 = rel.data.data.windows['24h'] || rel.data.data.windows['30d'];
    if (w24) console.log('  Availability:', w24.availabilityPct, 'Latency:', w24.medianLatencyMs, 'obs:', w24.observationCount);
  }
  console.log('Reputation status:', rep.status, rep.data?.data?.feedbackAvailability || '');
  console.log('Services status:', srv.status, srv.data?.data?.services?.length ? `${srv.data.data.services.length} services` : '0 services');
}

async function main() {
  const ids = ['49637', '316380', '338367', '319889', '319864', '319859', '2032', '320487'];
  for (const id of ids) {
    await testAgent(id);
  }
}

main();
