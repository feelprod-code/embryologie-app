const fs = require('fs');
const _path = require('path');
const dir = './src/locales';

const timelineKeys = {
    "timeline_palpation": {
        "fr": "Palpation", "en": "Palpation", "es": "Palpación", "de": "Palpation", "it": "Palpazione", "zh": "触诊", "ja": "触診"
    },
    "timeline_therapist_posture": {
        "fr": "Posture du thérapeute", "en": "Therapist Posture", "es": "Postura del terapeuta", "de": "Haltung des Therapeuten", "it": "Postura del terapeuta", "zh": "治疗师姿势", "ja": "セラピストの姿勢"
    },
    "timeline_psychosomatic": {
        "fr": "Psychosomatique", "en": "Psychosomatic", "es": "Psicosomática", "de": "Psychosomatik", "it": "Psicosomatica", "zh": "身心", "ja": "心身医学"
    },
    "timeline_layer_perceptions": {
        "fr": "Perceptions des feuillets", "en": "Layer Perceptions", "es": "Percepciones de las capas", "de": "Wahrnehmung der Schichten", "it": "Percezioni dei foglietti", "zh": "层级感知", "ja": "層の知覚"
    },
    "timeline_fulcrums": {
        "fr": "Fulcrums", "en": "Fulcrums", "es": "Fulcros", "de": "Fulcren", "it": "Fulcri", "zh": "支点", "ja": "支点"
    }
};

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.json')) return;
    const lang = file.replace('.json', '');
    const filePath = _path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Fix welcomeMessage
    if (data.chatbot && data.chatbot.welcomeMessage) {
        data.chatbot.welcomeMessage = data.chatbot.welcomeMessage.replace(/\\n\\n/g, '\\n');
    }

    // Add app timeline keys
    if (!data.app) data.app = {};
    for (const [key, translations] of Object.entries(timelineKeys)) {
        if (!data.app[key]) {
            data.app[key] = translations[lang];
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
});
console.log("Done");
