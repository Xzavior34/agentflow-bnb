import http from 'http';

http.get('http://localhost:8080/', (res) => {
  console.log('HTTP Status Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Response Body Length:', body.length);
    console.log('Body Preview:\n', body.slice(0, 500));
  });
}).on('error', (err) => {
  console.error('Error fetching preview server:', err);
});
