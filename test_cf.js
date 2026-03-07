const https = require('https');

const url = 'https://customer-6i2z59dst7q6iswv.cloudflarestream.com/9928d1d298f329797032bb5abd4e3e59/downloads/default.mp4';
https.get(url, (res) => {
  console.log(res.statusCode, res.headers);
});
