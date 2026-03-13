export function cleanTranscript(text: string): string {
    if (!text) return text;

    let cleaned = text;

    // 1. Fix common UTF-8 encoding issues often found in AI transcriptions
    const utf8Fixes: Record<string, string> = {
        'Ã©': 'é',
        'Ã¨': 'è',
        'Ã ': 'à',
        'Ã§': 'ç',
        'Ãª': 'ê',
        'Ã«': 'ë',
        'Ã®': 'î',
        'Ã¯': 'ï',
        'Ã´': 'ô',
        'Ã¶': 'ö',
        'Ã¹': 'ù',
        'Ã»': 'û',
        'Ã¼': 'ü',
        'Ã¢': 'â',
        'Ã¤': 'ä',
        'Å“': 'œ',
        'â€™': "'",
        'â€œ': '"',
        'â€': '"',
        'â€”': '—',
        'â€“': '–',
        'Â«': '«',
        'Â»': '»',
        'â€¦': '...',
        'Ã ': 'À',
        'Ã‰': 'É',
        'Ãˆ': 'È',
        'ÃŠ': 'Ê',
        'Ã‡': 'Ç',
    };

    for (const [bad, good] of Object.entries(utf8Fixes)) {
        // Escape specific regex chars if they occur in keys, though none here strictly require it except maybe some punctuation.
        // Using simple replaceAll for exact string match.
        cleaned = cleaned.split(bad).join(good);
    }

    // 2. Fix spaced-out letters. e.g. "s p é c i f i q u e" -> "spécifique"
    // This regex looks for 3 or more single letters separated by spaces.
    // It handles typical French alphabet characters along with standard A-Z.
    // We use a replacer function to remove the spaces between those letters.

    // This matches a pattern like "a b c d". It removes spaces between single characters.
    cleaned = cleaned.replace(/(?<=\b|[ \n\r\t.,;:?!'’])[a-zA-ZàâäéèêëîïôöùûüçœÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒ](?: [a-zA-ZàâäéèêëîïôöùûüçœÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒ]){2,}(?=\b|[ \n\r\t.,;:?!'’])/g, (match) => {
        return match.replace(/ /g, '');
    });

    // 3. Fix spaces before punctuation (French typography)
    // Re-adjust spaces for punctuation. 
    // In French typography, there is a space before : ; ! ? 
    // But we want to clean up excessive spaces or completely bad formatting.
    cleaned = cleaned.replace(/\s+,/g, ',');
    cleaned = cleaned.replace(/\s+\./g, '.');
    // For double punctuation, ensure exactly one non-breaking space (or normal space), but let's just make it a single space to be safe
    cleaned = cleaned.replace(/\s+([:;!?])/g, ' $1');

    // 4. Remove hallucinated hallucinated filler symbols like ***
    cleaned = cleaned.replace(/\*{3,}/g, '');

    return cleaned;
}
