import fs from 'fs';
import path from 'path';

function escapeString(str) {
    if (!str) return '""';
    return JSON.stringify(str); // this adds quotes and escapes things properly
}

function injectSummaries(tsFilePath) {
    const cachePath = path.resolve('./scripts/summary_cache.json');
    if (!fs.existsSync(cachePath)) {
        console.error("No summary_cache.json found.");
        return;
    }

    const summaries = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    let content = fs.readFileSync(path.resolve(tsFilePath), 'utf8');

    let modifiedCount = 0;

    for (const [id, summaryData] of Object.entries(summaries)) {
        const idPattern = new RegExp(`id:\\s*"${id}",([\\s\\S]*?)transcriptMarkdown:\\s*\``, 'g');
        content = content.replace(idPattern, (match, beforeTranscript) => {
            // If it already has shortSummary or fullSummary, replace them or skip?
            // Actually, we use our regex to insert precisely before transcriptMarkdown
            let cleanBefore = beforeTranscript;

            // Remove existing shortSummary/fullSummary if any
            cleanBefore = cleanBefore.replace(/shortSummary:\s*".*?",[\s\n]*/g, '');
            cleanBefore = cleanBefore.replace(/fullSummary:\s*".*?",[\s\n]*/g, '');

            // format new ones
            const shortSum = summaryData.shortSummary ? `shortSummary: ${escapeString(summaryData.shortSummary.trim())},\n    ` : '';
            const fullSum = summaryData.fullSummary ? `fullSummary: ${escapeString(summaryData.fullSummary.trim())},\n    ` : '';

            modifiedCount++;
            return `id: "${id}",${cleanBefore}${shortSum}${fullSum}transcriptMarkdown: \``;
        });
    }

    fs.writeFileSync(path.resolve(tsFilePath), content);
    console.log(`Injected summaries into ${tsFilePath}. Modified ${modifiedCount} entries.`);
}

injectSummaries('./src/data/videoCourses.ts');
