import https from 'https';

const agentUrl = 'https://bnbagent-api.bnbchain.world/v1/rt/01M19F53Z2SRN65TBHKWXY1K54/a2a';

async function testNegotiate() {
  const payload = {
    jsonrpc: '2.0',
    method: 'agent.call',
    params: {
      skill: 'negotiate',
      task_description: 'Risk assessment and health analysis for PancakeSwap V3 and Venus lending pool',
      terms: {
        deliverables: 'Deterministic risk report with onchain evidence labels',
        quality_standards: 'Evidence-backed evaluation with invariant constraint checks'
      }
    },
    id: 1
  };

  console.log('Sending negotiation request to SafeHire agent...');
  const res = await fetch(agentUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const status = res.status;
  const body = await res.text();
  console.log(`HTTP Status: ${status}`);
  console.log('Response Body:', body);
}

testNegotiate().catch(console.error);
