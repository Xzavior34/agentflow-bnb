import http from 'http';

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}, Length: ${res.headers['content-length']}`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.error(`URL: ${url} -> Error:`, err.message);
      resolve(false);
    });
  });
}

async function testAll() {
  await checkUrl('http://localhost:8080/');
  await checkUrl('http://localhost:8080/assets/index-S2o4i0bp.js');
  await checkUrl('http://localhost:8080/assets/index-BbuWGd1F.css');
  await checkUrl('http://localhost:8080/assets/Index-Cw2EIYNR.js');
}

testAll();
