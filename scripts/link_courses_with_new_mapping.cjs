const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, '../src/data/pdfFileMapping.json');
const coursesPath = path.join(__dirname, '../src/data/videoCourses.ts');

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
let coursesContent = fs.readFileSync(coursesPath, 'utf8');

// For each meso item, update pdfUrl and isGlobalPdf and title if needed
coursesContent = coursesContent.replace(/\{\s*id:\s*['"](meso-\d+)['"]([\s\S]*?)\}/g, (match, id, body) => {
    const mapInfo = mapping[id];
    let newBody = body;

    if (mapInfo) {
        // Update or insert pdfUrl
        if (newBody.includes('pdfUrl:')) {
            newBody = newBody.replace(/pdfUrl:\s*['"][^'"]*['"]/, `pdfUrl: "${mapInfo.pdfUrl}"`);
        } else {
            newBody += `,\n    pdfUrl: "${mapInfo.pdfUrl}"`;
        }

        // Update or insert pdfTotalPages
        if (newBody.includes('pdfTotalPages:')) {
            newBody = newBody.replace(/pdfTotalPages:\s*\d+/, `pdfTotalPages: ${mapInfo.totalPages}`);
        } else {
            newBody += `,\n    pdfTotalPages: ${mapInfo.totalPages}`;
        }

        if (mapInfo.isGlobal) {
            if (!newBody.includes('isGlobalPdf:')) {
                newBody += `,\n    isGlobalPdf: true`;
            }
        }
    }

    return `{ id: "${id}"${newBody} }`;
});

fs.writeFileSync(coursesPath, coursesContent, 'utf8');
console.log("Successfully linked courses with new mapping!");
