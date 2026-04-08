const fs = require('fs');
const path = require('path');

const VTT_DIR = path.join(__dirname, '../public/vtt');

function getFiles() {
  const files = fs.readdirSync(VTT_DIR);
  // Get all files that are NOT French (already fixed by GPT-4o)
  return files.filter(f => !f.endsWith('_fr.vtt') && f.endsWith('.vtt') && !f.startsWith('test_'));
}

function run() {
  const foreignFiles = getFiles();
  let modifiedCount = 0;

  foreignFiles.forEach(file => {
    const fp = path.join(VTT_DIR, file);
    let content = fs.readFileSync(fp, 'utf8');
    let original = content;

    // Spanish / Italian / German / English
    content = content.replace(/Yonah Messie/g, 'Joanna Macy');
    content = content.replace(/Yona Messie/g, 'Joanna Macy');
    content = content.replace(/Yona Messi/g, 'Joanna Macy');
    content = content.replace(/Andreas Messy/g, 'Joanna Macy');
    content = content.replace(/Andreas Messi/g, 'Joanna Macy');
    content = content.replace(/Jonas Messy/g, 'Joanna Macy');
    content = content.replace(/Jonas Messi/g, 'Joanna Macy');
    content = content.replace(/Johanna Messi/g, 'Joanna Macy');
    content = content.replace(/Johanna Messy/g, 'Joanna Macy');

    // Japanese
    content = content.replace(/ヨナ・メッシ/g, 'ジョアンナ・メイシー');
    content = content.replace(/アンドレアス・メッシ/g, 'ジョアンナ・メイシー');
    content = content.replace(/ジョナス・メッシ/g, 'ジョアンナ・メイシー');

    // Chinese
    content = content.replace(/约拿·梅西/g, '乔安娜·梅西');
    content = content.replace(/安德烈亚斯·梅西/g, '乔安娜·梅西');
    content = content.replace(/乔纳斯·梅西/g, '乔安娜·梅西');

    if (content !== original) {
      fs.writeFileSync(fp, content, 'utf8');
      modifiedCount++;
      console.log(`Replaced Joanna Macy in: ${file}`);
    }
  });

  console.log(`Finished! Modified ${modifiedCount} translated files.`);
}

run();
