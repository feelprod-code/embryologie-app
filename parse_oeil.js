require('ts-node').register({ transpileOnly: true });
const { videoCourses } = require('./src/data/videoCourses.ts');
const oeilVids = videoCourses.filter(v => v.categoryId === 'oeil').map(v => ({
  title: v.title,
  time: v.duration,
  desc: v.summary.replace(/\n/g, ' ').substring(0, 100) + '...',
  hasTranscript: true
}));
console.log(JSON.stringify(oeilVids, null, 2));
