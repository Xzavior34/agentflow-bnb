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
  const base = 'https://agentproof-rho.vercel.app/api/v1';
  console.log('=== CANDIDATE 1: bsc/49637 ===');
  console.log(JSON.stringify(await get(`${base}/agents/bsc/49637`), null, 2));

  console.log('=== CANDIDATE 2: bsc/319889 ===');
  console.log(JSON.stringify(await get(`${base}/agents/bsc/319889`), null, 2));
}

main();
