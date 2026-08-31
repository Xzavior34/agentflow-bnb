import https from 'https';

function checkBalance(address) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest']
    });

    const req = https.request('https://bsc-testnet-rpc.publicnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.result) {
            const wei = BigInt(json.result);
            const eth = Number(wei) / 1e18;
            resolve(eth);
          } else {
            resolve(0);
          }
        } catch (e) {
          resolve(0);
        }
      });
    });

    req.on('error', err => resolve(0));
    req.write(payload);
    req.end();
  });
}

async function main() {
  const b1 = await checkBalance('0x07764D9031b8747e28d3E1601Ff1417569de22DA');
  const b2 = await checkBalance('0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B');
  console.log(`ADDRESS_1 0x0776... BALANCE: ${b1} tBNB`);
  console.log(`ADDRESS_2 0xA3bb... BALANCE: ${b2} tBNB`);
}

main();
