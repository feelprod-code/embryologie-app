import { videoCourses as fr } from './src/data/videoCourses.ts';
import { videoCourses as en } from './src/data/videoCourses_en.ts';

const frIds = new Set(fr.map(v => v.id));
const enIds = new Set(en.map(v => v.id));

const missingInEn = [...frIds].filter(id => !enIds.has(id));
console.log('Missing in EN:', missingInEn);

const missingInFr = [...enIds].filter(id => !frIds.has(id));
console.log('Missing in FR:', missingInFr);
