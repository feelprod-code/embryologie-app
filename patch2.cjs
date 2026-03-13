const fs = require('fs');

const file = 'src/components/VideoPlayerPage.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`    if (Math.min(window.innerWidth, window.innerHeight) <= 450) return 'mobile';`,
`    if (Math.min(window.innerWidth, window.innerHeight) <= 450 || deviceClass === 'mobile') return 'mobile';`
);

fs.writeFileSync(file, code);
