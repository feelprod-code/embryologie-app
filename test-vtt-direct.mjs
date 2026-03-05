import https from 'node:https';

const cloudflareId = '9928d1d298f329797032bb5abd4e3e59';

async function testFetch() {
    const url = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/captions/fr.vtt`;
    console.log('Fetching', url);
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log('--- MANIFEST ---');
        console.log(res.status, res.statusText);
        console.log(text.substring(0, 500));
    } catch (e) {
        console.error(e);
    }
}

testFetch();
