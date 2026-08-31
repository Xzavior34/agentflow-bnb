import https from 'https';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function testAgentProof() {
  console.log('Testing AgentProof Public API...');
  const base = 'https://agentproof-rho.vercel.app/api/v1';
  console.log('Root:', await get(base));
  console.log('Agents:', await get(`${base}/agents`));
  console.log('Passport 97/2032:', await get(`${base}/agents/97/2032`));
  console.log('Passport SafeHire:', await get(`${base}/passport/97/2032`));
}

testAgentProof();
