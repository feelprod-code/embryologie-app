export interface VTTBlock {
    id: string;
    timeRange: string;
    text: string;
}

export function parseVTT(vttContent: string): VTTBlock[] {
    const blocks: VTTBlock[] = [];
    const lines = vttContent.split('\n');

    let i = 0;
    // Skip WEBVTT header
    while (i < lines.length && !lines[i].includes('-->')) {
        if (lines[i].startsWith('WEBVTT')) {
            i++;
        } else {
            i++;
        }
    }

    // Go back to the ID line if it exists
    if (i > 0 && lines[i].includes('-->') && lines[i - 1].trim() !== '') {
        i--;
    }

    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line) {
            i++;
            continue;
        }

        let id = '';
        let timeRange = '';
        let text = [];

        // Check if the current line is an ID (doesn't contain '-->')
        if (!lines[i].includes('-->')) {
            id = lines[i].trim();
            i++;
        }

        // The next line must be the timecode
        if (i < lines.length && lines[i].includes('-->')) {
            timeRange = lines[i].trim();
            i++;

            // The following lines until a blank line are the text
            while (i < lines.length && lines[i].trim() !== '') {
                text.push(lines[i].trim());
                i++;
            }

            blocks.push({
                id,
                timeRange,
                text: text.join('\n')
            });
        } else {
            i++; // Skip if not a valid block
        }
    }

    return blocks;
}

export function stringifyVTT(blocks: VTTBlock[]): string {
    let out = 'WEBVTT\n\n';
    blocks.forEach((b, index) => {
        out += `${b.id || (index + 1)}\n`;
        out += `${b.timeRange}\n`;
        out += `${b.text}\n\n`;
    });
    return out;
}
