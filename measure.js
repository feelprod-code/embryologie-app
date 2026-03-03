const fs = require('fs');

let totalMinutes = 0;

try {
  const jsonStr = fs.readFileSync('../youtube-video-upload/uploads.json', 'utf8');
  const data = JSON.parse(jsonStr);
  
  data.forEach(v => {
    if (v.duration) {
      let parts = v.duration.split(':').map(Number);
      let s = 0;
      if (parts.length === 2) s = parts[0]*60 + parts[1];
      if (parts.length === 3) s = parts[0]*3600 + parts[1]*60 + parts[2];
      totalMinutes += (s / 60);
    }
  });

  console.log("Minutes from youtube uploads.json:", Math.round(totalMinutes));

} catch (e) {
  console.log("No uploads.json or error reading it.");
}
