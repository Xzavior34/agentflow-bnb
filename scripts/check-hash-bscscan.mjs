import https from 'https';

function checkBscScanHtml(chain, hash) {
  return new Promise((resolve) => {
    const domain = chain === 'testnet' ? 'testnet.bscscan.com' : 'bscscan.com';
    const url = `https://${domain}/tx/${hash}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const isFound = res.statusCode === 200 && !body.includes('Sorry, We are unable to locate');
        resolve({ domain, status: res.statusCode, isFound, length: body.length });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function main() {
  const hash = '0x3651175601bec8b3738f723b195dd21ff847f0578a90c9acb08db5b7285a56e1';
  console.log('Checking Testnet BscScan...');
  console.log(await checkBscScanHtml('testnet', hash));
  console.log('Checking Mainnet BscScan...');
  console.log(await checkBscScanHtml('mainnet', hash));
}

main();
