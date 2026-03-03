import { videoCourses } from "./src/data/videoCourses";
let catToSec: Record<string, number> = { ectoderme: 0, endoderme: 0, oeil: 0, mesoderme: 0 };
let noDurationCount = 0;
videoCourses.forEach(c => {
  if (!c.duration) { noDurationCount++; return; }
  let parts = c.duration.split(':').map(Number);
  let s = 0;
  if(parts.length === 2) s = parts[0]*60 + parts[1];
  if(parts.length === 3) s = parts[0]*3600 + parts[1]*60 + parts[2];
  if(catToSec[c.categoryId] !== undefined) catToSec[c.categoryId] += s;
});
console.log('--- EN MINUTES ---');
console.log('Ectoderme:', Math.round(catToSec.ectoderme/60), 'min');
console.log('Endoderme:', Math.round(catToSec.endoderme/60), 'min');
console.log('L Oeil:', Math.round(catToSec.oeil/60), 'min');
console.log('--> Total actuel estimé:', Math.round((catToSec.ectoderme + catToSec.endoderme + catToSec.oeil)/60), 'min');
console.log('------------------');
console.log('Mésoderme à uploader:', Math.round(catToSec.mesoderme/60), 'min');
