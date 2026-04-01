import { videoCourses } from './videoCourses.js';

let errors = 0;
videoCourses.forEach(c => {
    if (!c.id) { console.error("Missing id", c); errors++; }
    if (!c.title) { console.error("Missing title", c); errors++; }
    if (!c.categoryId) { console.error("Missing categoryId", c); errors++; }
    if (typeof c.youtubeId !== 'string') { console.error("Invalid youtubeId", c); errors++; }
});
console.log(`Checked all 167 courses. Errors found: ${errors}`);
