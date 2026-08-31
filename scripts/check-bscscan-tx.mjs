import https from 'https';

function getBscScan(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', err => resolve('{}'));
  });
}

async function check() {
  const addrs = [
    '0x07764D9031b8747e28d3E1601Ff1417569de22DA',
    '0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B'
  ];

  for (const a of addrs) {
    const url = `https://api-testnet.bscscan.com/api?module=account&action=balance&address=${a}&tag=latest`;
    const res = await getBscScan(url);
    console.log(`BscScan API for ${a}:`, res);
  }
}

check();
