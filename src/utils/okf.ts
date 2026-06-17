import knowledgeManifest from '../data/knowledge-manifest.json';

export interface OKFCard {
    file: string;
    metadata: {
        type: string;
        title: string;
        description: string;
        tags: string[];
        timestamp: string;
        [key: string]: any;
    };
    body: string;
}

/**
 * Searches the compiled OKF knowledge base for relevant concept and reference cards.
 */
export function searchKnowledge(query: string, limit: number = 5): OKFCard[] {
    if (!query || !query.trim()) return [];

    const searchTerms = query
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .split(/\s+/)
        .filter(term => term.length > 2); // Only keep terms with length > 2

    if (searchTerms.length === 0) return [];

    const scores: Map<OKFCard, number> = new Map();

    const allCards: OKFCard[] = [
        ...(knowledgeManifest.concepts as OKFCard[]),
        ...(knowledgeManifest.references as OKFCard[])
    ];

    for (const card of allCards) {
        let score = 0;
        const titleNormalized = (card.metadata.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const descriptionNormalized = (card.metadata.description || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const tagsNormalized = (card.metadata.tags || []).map(t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        const bodyNormalized = (card.body || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        for (const term of searchTerms) {
            // Title match (highest weight)
            if (titleNormalized.includes(term)) {
                score += 15;
            }
            // Tags match (high weight)
            if (tagsNormalized.some(tag => tag.includes(term))) {
                score += 10;
            }
            // Description match (medium weight)
            if (descriptionNormalized.includes(term)) {
                score += 5;
            }
            // Body match (low weight)
            if (bodyNormalized.includes(term)) {
                // Count occurrences
                const occurrences = (bodyNormalized.split(term).length - 1);
                score += Math.min(occurrences * 1, 5); // max 5 points for body frequency
            }
        }

        if (score > 0) {
            scores.set(card, score);
        }
    }

    // Sort by score descending
    const sorted = [...scores.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    return sorted.slice(0, limit);
}

/**
 * Generates the context string to be injected into the LLM system prompt
 */
export function getOKFContext(query: string, limit: number = 4): string {
    const results = searchKnowledge(query, limit);

    if (results.length === 0) {
        return "AUCUNE FICHE DE COURS DIRECTEMENT PERTINENTE TROUVÉE POUR CETTE REQUÊTE.";
    }

    let context = "FICHE(S) DU COURS DE MARC DAMOISEAUX SÉLECTIONNÉE(S) :\n\n";

    results.forEach((card, idx) => {
        context += `--- FICHE ${idx + 1}: ${card.metadata.title} (Type: ${card.metadata.type}) ---\n`;
        if (card.metadata.description) {
            context += `Description: ${card.metadata.description}\n`;
        }
        if (card.metadata.tags && card.metadata.tags.length > 0) {
            context += `Mots-clés: ${card.metadata.tags.join(', ')}\n`;
        }
        if (card.metadata.videoId) {
            context += `ID_VIDEO: ${card.metadata.videoId}\n`;
        }
        context += `\n${card.body}\n`;
        context += `------------------------------------------------------\n\n`;
    });

    return context;
}

/**
 * Returns all core stages concepts of Marc Damoiseaux as baseline context.
 * This is very light (~30KB) and represents the full stages course curriculum.
 */
export function getCoreStagesContext(): string {
    let context = "CONCEPTS DES STADES D'EMBRYOLOGIE DE MARC DAMOISEAUX :\n\n";
    knowledgeManifest.concepts.forEach((card, idx) => {
        context += `--- STADE ${idx + 1}: ${card.metadata.title} ---\n`;
        context += `Mots-clés: ${card.metadata.tags.join(', ')}\n`;
        context += `${card.body}\n`;
        context += `------------------------------------------------------\n\n`;
    });
    return context;
}
