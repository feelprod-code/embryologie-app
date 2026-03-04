const fs = require('fs');
let content = fs.readFileSync('/Users/philippeguillaume/ANTIGRAVITY/embryologie-app/src/data/embryologie.ts', 'utf8');

// We are going to replace detailedStages entirely with an enriched version.
// A simpler way is to just replace the exact code of detailedStages array.
