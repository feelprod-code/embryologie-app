const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const layerTranslations = {
    en: { ectoderm: "Ectoderm", endoderm: "Endoderm", mesoderm: "Mesoderm", eye: "The Eye" },
    fr: { ectoderm: "L'Ectoderme", endoderm: "L'Endoderme", mesoderm: "Le Mésoderme", eye: "L'Oeil" },
    es: { ectoderm: "Ectodermo", endoderm: "Endodermo", mesoderm: "Mesodermo", eye: "El Ojo" },
    it: { ectoderm: "Ectoderma", endoderm: "Endoderma", mesoderm: "Mesoderma", eye: "L'Occhio" },
    de: { ectoderm: "Ektoderm", endoderm: "Entoderm", mesoderm: "Mesoderm", eye: "Das Auge" },
    zh: { ectoderm: "外胚层", endoderm: "内胚层", mesoderm: "中胚层", eye: "眼睛" },
    ja: { ectoderm: "外胚葉", endoderm: "内胚葉", mesoderm: "中胚葉", eye: "目" }
};

files.forEach(file => {
    const lang = path.basename(file, '.json');
    const filePath = path.join(localesDir, file);

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (content.translation && content.translation.videoLibrary) {
        content.translation.videoLibrary.layers = layerTranslations[lang] || layerTranslations['en'];

        fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
        console.log(`Updated ${file}`);
    }
});
