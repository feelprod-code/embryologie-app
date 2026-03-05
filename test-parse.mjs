import fs from 'fs';

const vttText = `WEBVTT
X-TIMESTAMP-MAP=LOCAL:00:00:00.000,MPEGTS:900000

1
00:00:00.000 --> 00:00:04.440
L'embryologie va vous amener à la recherche d'une honnêteté dans votre ressenti.

2
00:00:04.900 --> 00:00:09.340
Et ça, ça peut être troublant parce qu'on va devoir aller dans un autre contexte
`;

const parseVttTime = (timeStr) => {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
        return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2].replace(',', '.'));
    }
    return 0;
};

const vttLines = vttText.split('\n');
const parsedCues = [];
let i = 0;
while (i < vttLines.length) {
    if (vttLines[i].includes('-->')) {
        const [startStr, endStr] = vttLines[i].split(' --> ');
        let textAcc = '';
        i++;
        // Read until empty line or next block
        while (i < vttLines.length && vttLines[i].trim() !== '' && !vttLines[i].includes('-->') && !/^\d+$/.test(vttLines[i].trim())) {
            // Clean up HTML tags inside VTT text (like <i>, <b>)
            textAcc += vttLines[i].replace(/<[^>]+>/g, '').trim() + ' ';
            i++;
        }
        parsedCues.push({
            start: parseVttTime(startStr.trim()),
            end: parseVttTime(endStr.trim()),
            text: textAcc.trim()
        });
    } else {
        i++;
    }
}

console.log(parsedCues);
