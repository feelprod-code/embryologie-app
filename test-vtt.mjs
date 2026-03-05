import https from 'node:https';

const cloudflareId = '9928d1d298f329797032bb5abd4e3e59';

async function testFetch() {
    const url = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/manifest/video.m3u8`;
    console.log('Fetching', url);
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log('--- MANIFEST ---');
        console.log(text);

        // Find subtitle track URI (prefer 'fr', fallback to any)
        const lines = text.split('\n');
        let subtitleUri = lines.find(l => l.includes('TYPE=SUBTITLES') && l.includes('LANGUAGE="fr"'));
        if (!subtitleUri) {
            subtitleUri = lines.find(l => l.includes('TYPE=SUBTITLES'));
        }

        if (!subtitleUri) {
            console.warn("No subtitles found in manifest.");
            return;
        }

        const uriMatch = subtitleUri.match(/URI="([^"]+)"/);
        const subManifestFile = uriMatch[1]; // e.g., stream_t8843...m3u8

        const subUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${cloudflareId}/manifest/${subManifestFile}`;
        console.log('\nFetching', subUrl);
        const subRes = await fetch(subUrl);
        const subText = await subRes.text();
        console.log('--- SUB MANIFEST ---');
        console.log(subText);

        const vttPathLine = subText.split('\n').find(l => l.includes('.vtt'));
        if (!vttPathLine) {
            console.log("No VTT path found");
            return;
        }

        // Extract everything after the first slash (to remove ../../)
        const actualVttPath = vttPathLine.replace(/^(\.\.\/)+/, '');
        const finalUrl = `https://customer-6i2z59dst7q6iswv.cloudflarestream.com/${actualVttPath}`;
        console.log('\nFetching', finalUrl);
        const vttRes = await fetch(finalUrl);
        const vttText = await vttRes.text();
        console.log('--- VTT FILE PARTIAL ---');
        console.log(vttText.substring(0, 500));

    } catch (e) {
        console.error(e);
    }
}

testFetch();
