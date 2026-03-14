import fs from 'fs';
import path from 'path';

const cachePath = path.resolve('scripts/translation_cache.json');

interface CacheData {
  [key: string]: string;
}

function cleanText(text: string): string {
  // Look for patterns like \n\n00:00\n or \n00:00\n
  // and truncate the text before that.
  const regex = /\n\n?\d{2}:\d{2}\n/;
  const match = text.match(regex);
  if (match && match.index !== undefined) {
    return text.substring(0, match.index).trim();
  }
  return text;
}

function run() {
  if (!fs.existsSync(cachePath)) {
    console.log('Cache file not found.');
    return;
  }

  const cacheContent = fs.readFileSync(cachePath, 'utf8');
  let cache: CacheData = JSON.parse(cacheContent);
  let modifiedCount = 0;

  for (const key in cache) {
    const originalText = cache[key];
    if (typeof originalText === 'string') {
      const cleanedText = cleanText(originalText);
      if (cleanedText !== originalText) {
        cache[key] = cleanedText;
        modifiedCount++;
      }
    }
  }

  if (modifiedCount > 0) {
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
    console.log(`Cleaned ${modifiedCount} corrupted translation entries in the cache.`);
  } else {
    console.log('No corrupted translations found in the cache.');
  }
}

run();
