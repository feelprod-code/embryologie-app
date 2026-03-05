const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/let lmap =/g, 'const lmap =');
    content = content.replace(/getCategoryTotalDuration\(cId as any\)/g, 'getCategoryTotalDuration(cId as "ectoderme" | "endoderme" | "mesoderme" | "oeil")');
    content = content.replace(/\\d\+\[\\\.\\-\\s_:\]\*/g, '\\d+[\\.\\-\\s_:]*');
    content = content.replace(/const handleTimeUpdate = \(_: number\) => \{/g, 'const handleTimeUpdate = () => {');
    fs.writeFileSync(filePath, content);
}

fixFile('src/components/VideoLibraryList.tsx');
fixFile('src/components/VideoPlayerPage.tsx');
console.log('Fixed');
