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

async function main() {
  console.log("=== 1. Listing Monitored Agents ===");
  const listRes = await fetchUrl("https://agentproof-rho.vercel.app/api/v1/agents?chain=bsc&limit=10");
  console.log("List Status:", listRes.status);
  console.log("List Data Sample:", JSON.stringify(listRes.data, null, 2).substring(0, 500));

  let sampleAgentId = "bsc:316380";
  if (listRes.data && Array.isArray(listRes.data.data) && listRes.data.data.length > 0) {
    const first = listRes.data.data[0];
    sampleAgentId = first.identity?.id || first.id || sampleAgentId;
    console.log(`\nFound agent from list: ${sampleAgentId}`);
  }

  console.log(`\n=== 2. Fetching Reliability for ${sampleAgentId} ===`);
  const relRes = await fetchUrl(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${sampleAgentId}/reliability`);
  console.log("Reliability Status:", relRes.status);
  console.log("Reliability Payload:", JSON.stringify(relRes.data, null, 2));

  console.log(`\n=== 3. Fetching Reputation Integrity for ${sampleAgentId} ===`);
  const repRes = await fetchUrl(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${sampleAgentId}/reputation-integrity`);
  console.log("Reputation Status:", repRes.status);
  console.log("Reputation Payload:", JSON.stringify(repRes.data, null, 2));

  console.log(`\n=== 4. Fetching Services for ${sampleAgentId} ===`);
  const srvRes = await fetchUrl(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${sampleAgentId}/services`);
  console.log("Services Status:", srvRes.status);
  console.log("Services Payload:", JSON.stringify(srvRes.data, null, 2));
}

main();
