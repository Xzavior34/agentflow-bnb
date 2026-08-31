import https from 'https';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body });
        }
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function main() {
  const tokenIds = [2032, 49637, 319889, 319871, 319864, 320487, 319861, 319859, 319842];
  for (const tid of tokenIds) {
    const res = await get(`https://agentproof-rho.vercel.app/api/v1/agents/bsc/${tid}`);
    console.log(`AgentProof bsc/${tid}:`, JSON.stringify(res).substring(0, 150));
  }
}

main();
