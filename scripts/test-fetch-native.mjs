async function testAgent(tokenId) {
  const agentId = `bsc:${tokenId}`;
  const base = `https://agentproof-rho.vercel.app/api/v1/agents/bsc/${agentId}`;
  
  try {
    const [relRes, repRes, srvRes] = await Promise.all([
      fetch(`${base}/reliability`),
      fetch(`${base}/reputation-integrity`),
      fetch(`${base}/services`)
    ]);

    const rel = await relRes.json();
    const rep = await repRes.json();
    const srv = await srvRes.json();

    console.log(`\n=== Agent ${agentId} ===`);
    console.log('Reliability status:', relRes.status);
    console.log('Reliability data:', JSON.stringify(rel, null, 2));
    console.log('Reputation status:', repRes.status);
    console.log('Reputation data:', JSON.stringify(rep, null, 2));
    console.log('Services status:', srvRes.status);
    console.log('Services data:', JSON.stringify(srv, null, 2));
  } catch (err) {
    console.error(`Error for ${agentId}:`, err);
  }
}

async function main() {
  const ids = ['316380', '49637', '338367'];
  for (const id of ids) {
    await testAgent(id);
  }
}

main();
