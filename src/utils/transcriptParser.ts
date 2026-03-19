export interface TranscriptSentence {
    text: string;
    startTime: number;
}

export interface TranscriptCue {
    startTime: number;
    speaker: string;
    text: string;
    sentences: TranscriptSentence[];
}

/**
 * Parses a transcript string in the format:
 * MM:SS Speaker Name
 * Text block...
 * 
 * Or
 * HH:MM:SS Speaker Name
 * Text block...
 */
export function parseTranscript(transcript: string): TranscriptCue[] {
    if (!transcript) return [];

    const lines = transcript.split('\n');
    const cues: TranscriptCue[] = [];
    
    let currentCue: Partial<TranscriptCue> | null = null;
    let currentText: string[] = [];

    // Regex to match "00:09 Philippe Guillaume" or "1:00:09 Marc Damoiseaux"
    const timeSpeakerRegex = /^(\d{1,2}:)?(\d{2}):(\d{2})\s+(.+)$/;

    for (const line of lines) {
        const match = line.match(timeSpeakerRegex);
        
        if (match) {
            // If we have an ongoing cue, save it
            if (currentCue && currentCue.startTime !== undefined) {
                currentCue.text = currentText.join('\n').trim();
                cues.push(currentCue as TranscriptCue);
            }

            // Start a new cue
            const hours = match[1] ? parseInt(match[1].replace(':', ''), 10) : 0;
            const minutes = parseInt(match[2], 10);
            const seconds = parseInt(match[3], 10);
            
            const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
            const speaker = match[4].trim();

            currentCue = {
                startTime: timeInSeconds,
                speaker: speaker,
                sentences: []
            };
            currentText = [];
        } else if (currentCue) {
            // Accumulate text
            if (line.trim() || currentText.length > 0) {
                currentText.push(line);
            }
        }
    }

    // Save the last cue
    if (currentCue && currentCue.startTime !== undefined) {
        currentCue.text = currentText.join('\n').trim();
        cues.push(currentCue as TranscriptCue);
    }

    // Process blocks into sentences with interpolated startTimes
    for (let i = 0; i < cues.length; i++) {
        const cue = cues[i];
        const nextCue = cues[i + 1];
        
        const blockDuration = nextCue 
            ? nextCue.startTime - cue.startTime 
            : Math.max(cue.text.length * 0.08, 10); // Approx 80ms per character for the last block

        // Split text by punctuation and newlines
        const regex = /([^.!?。！？\n]+[.!?。！？\n]+)/g;
        const matches = cue.text.match(regex);
        let rawSentences: string[] = [];
        
        if (!matches) {
            rawSentences = [cue.text.trim()];
        } else {
            const matchedText = matches.join('');
            rawSentences = matches.map(s => s.trim()).filter(s => s.length > 0);
            const leftover = cue.text.substring(matchedText.length).trim();
            if (leftover) {
                rawSentences.push(leftover);
            }
        }
        
        // Clean up formatting
        rawSentences = rawSentences
            .map(s => s.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(s => s.length > 0);

        const totalChars = rawSentences.reduce((acc, s) => acc + s.length, 0);
        
        const sentences: TranscriptSentence[] = [];
        let accumulatedTime = cue.startTime;
        
        for (const s of rawSentences) {
            sentences.push({ text: s, startTime: accumulatedTime });
            const sDuration = totalChars > 0 ? (s.length / totalChars) * blockDuration : 0;
            accumulatedTime += sDuration;
        }
        
        cue.sentences = sentences;
    }

    return cues;
}
