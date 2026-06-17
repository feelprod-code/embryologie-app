import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const knowledgeDir = path.join(projectRoot, 'knowledge');
const conceptsDir = path.join(knowledgeDir, 'concepts');
const referencesDir = path.join(knowledgeDir, 'references');
const outputFile = path.join(projectRoot, 'src/data/knowledge-manifest.json');

function parseYamlFrontMatter(content) {
    const yamlRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(yamlRegex);
    if (!match) return { metadata: {}, body: content };

    const yamlBlock = match[1];
    const body = content.replace(yamlRegex, '').trim();
    const metadata = {};

    yamlBlock.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.slice(0, colonIndex).trim();
        let val = line.slice(colonIndex + 1).trim();

        // Strip quotes
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
            val = val.slice(1, -1);
        }

        // Parse arrays
        if (val.startsWith('[') && val.endsWith(']')) {
            try {
                // Replace single quotes with double quotes for JSON parsing
                const jsonVal = val.replace(/'/g, '"');
                val = JSON.parse(jsonVal);
            } catch (e) {
                val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
            }
        }

        metadata[key] = val;
    });

    return { metadata, body };
}

function buildManifest() {
    console.log("Compilation de la base OKF...");
    const manifest = {
        concepts: [],
        references: [],
        index: null,
        log: null
    };

    // Index
    const indexFile = path.join(knowledgeDir, 'index.md');
    if (fs.existsSync(indexFile)) {
        const { metadata, body } = parseYamlFrontMatter(fs.readFileSync(indexFile, 'utf8'));
        manifest.index = { metadata, body };
    }

    // Log
    const logFile = path.join(knowledgeDir, 'log.md');
    if (fs.existsSync(logFile)) {
        const { metadata, body } = parseYamlFrontMatter(fs.readFileSync(logFile, 'utf8'));
        manifest.log = { metadata, body };
    }

    // Concepts
    if (fs.existsSync(conceptsDir)) {
        fs.readdirSync(conceptsDir).forEach(file => {
            if (file.endsWith('.md')) {
                const content = fs.readFileSync(path.join(conceptsDir, file), 'utf8');
                const { metadata, body } = parseYamlFrontMatter(content);
                manifest.concepts.push({
                    file,
                    metadata,
                    body
                });
            }
        });
    }

    // References
    if (fs.existsSync(referencesDir)) {
        fs.readdirSync(referencesDir).forEach(file => {
            if (file.endsWith('.md')) {
                const content = fs.readFileSync(path.join(referencesDir, file), 'utf8');
                const { metadata, body } = parseYamlFrontMatter(content);
                manifest.references.push({
                    file,
                    metadata,
                    body
                });
            }
        });
    }

    fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
    console.log(`Manifeste généré avec succès dans ${outputFile} !`);
    console.log(`- Concepts compilés : ${manifest.concepts.length}`);
    console.log(`- Références compilées : ${manifest.references.length}`);
}

try {
    buildManifest();
} catch (error) {
    console.error("Erreur lors de la compilation du manifeste :", error);
    process.exit(1);
}
