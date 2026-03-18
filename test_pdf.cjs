const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync("scripts/pdfs_cours/0-L'OEIL-Marc Damoiseaux.pdf");

pdf(dataBuffer).then(function(data) {
    console.log("Extracting Oeil PDF (First 1000 chars):");
    console.log(data.text.substring(0, 1000));
    fs.writeFileSync('scripts/pdfs_cours/test_oeil_extract.txt', data.text);
}).catch(err => console.error(err));
