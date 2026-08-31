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

async function testAgentProofBsc() {
  const base = 'https://agentproof-rho.vercel.app/api/v1';
  console.log('Agent bsc/2032:', await get(`${base}/agents/bsc/2032`));
  console.log('Passport bsc/2032:', await get(`${base}/passport/bsc/2032`));
  console.log('Reliability bsc/2032:', await get(`${base}/reliability/bsc/2032`));
}

testAgentProofBsc();
