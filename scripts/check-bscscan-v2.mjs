import https from 'https';

function getBscScanV2(address) {
  return new Promise((resolve) => {
    const url = `https://api.bscscan.com/v2/api?chainid=97&module=account&action=balance&address=${address}&tag=latest`;
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
    const res = await getBscScanV2(a);
    console.log(`V2 Balance for ${a}:`, res);
  }
}

check();
