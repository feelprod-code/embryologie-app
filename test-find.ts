import { videoCourses as fr } from './src/data/videoCourses.ts';
import { videoCourses as en } from './src/data/videoCourses_en.ts';
import { videoCourses as es } from './src/data/videoCourses_es.ts';

console.log("English title for ecto-01:", en.find(c => c.id === 'ecto-01')?.title);
console.log("Spanish title for ecto-01:", es.find(c => c.id === 'ecto-01')?.title);
