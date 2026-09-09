async function testEndpoint(url) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('json')) {
      const data = await res.json();
      return { status: res.status, data };
    } else {
      const text = await res.text();
      return { status: res.status, textSample: text.substring(0, 200) };
    }
  } catch (err) {
    return { error: err.message };
  }
}

async function main() {
  console.log("=== 1. Testing GET /health ===");
  const health = await testEndpoint("https://agentproof-rho.vercel.app/api/v1/health");
  console.log("Health:", JSON.stringify(health, null, 2));

  console.log("\n=== 2. Testing GET /agents?chain=bsc&limit=5 ===");
  const agents = await testEndpoint("https://agentproof-rho.vercel.app/api/v1/agents?chain=bsc&limit=5");
  console.log("Agents Status:", agents.status);
  console.log("Agents Sample:", JSON.stringify(agents.data, null, 2).substring(0, 500));

  const testIds = ["2518", "bsc:2518", "49637", "bsc:49637", "316380", "bsc:316380", "2032"];

  for (const id of testIds) {
    console.log(`\n=== 3. Testing Single Agent ${id} ===`);
    const agentData = await testEndpoint(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${id}`);
    const relData = await testEndpoint(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${id}/reliability`);
    const badge = await testEndpoint(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${id}/badge.svg`);

    console.log(`Agent ${id} Info Status:`, agentData.status);
    console.log(`Agent ${id} Reliability Status:`, relData.status);
    if (relData.data?.data?.windows) {
      console.log(`Agent ${id} Windows:`, JSON.stringify(relData.data.data.windows, null, 2));
    }
    console.log(`Agent ${id} Badge Status:`, badge.status, badge.textSample ? 'SVG returned' : '');
  }
}

main();
