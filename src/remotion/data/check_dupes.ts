import { videoCourses } from './videoCourses.js';
const ids = new Set();
for (const course of videoCourses) {
    if (ids.has(course.id)) {
        console.error("DUPLICATE KEY:", course.id);
    }
    ids.add(course.id);
}
console.log("Total courses:", videoCourses.length);
console.log("Unique IDs:", ids.size);
