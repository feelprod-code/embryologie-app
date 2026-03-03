export type EmbryoLayer = "L'Ectoderme" | "Le Mésoderme" | "L'Endoderme" | "L'Oeil" | "Global" | "N/A";

export interface EventDetail {
    order?: number; // Ordre précis de la cascade
    layer: EmbryoLayer;
    movement: string; // ex: "Cardialisation", "Vague Calcique"
    description: string;
}

export interface LayerPerception {
    layer: EmbryoLayer;
    perception: string;
}

export interface PracticalIntegration {
    fulcrums: string;
    generalPalpation: string;
    layerPerceptions?: LayerPerception[]; // optionnel si pas de différenciation spécifique
    therapistPosture: string;
    psychosomatic: string;
}

export interface StageDataV2 {
    id: string;
    dayLabel: string; // Ex: "Jour 1", "Jours 22 à 28"
    period: string; // Ex: "Période Pré-conceptuelle"
    title: string;
    generalDescription: string;
    events: EventDetail[];
    themeColor: string;
    mermaidCode?: string;
    practicalIntegration?: PracticalIntegration;
}

const colors = `
classDef ecto fill:#1e3a8a,stroke:#3b82f6,color:#bfdbfe,stroke-width:2px;
classDef meso fill:#14532d,stroke:#22c55e,color:#bbf7d0,stroke-width:2px;
classDef endo fill:#7f1d1d,stroke:#ef4444,color:#fecaca,stroke-width:2px;
classDef global fill:#1f2937,stroke:#4b5563,color:#d1d5db,stroke-width:2px;
`;

export const detailedStages: StageDataV2[] = [
    {
        id: "j-0",
        dayLabel: "Avant Jour 1",
        period: "Période Pré-conceptuelle",
        title: "Polarité et Préparation",
        generalDescription: "L'ovocyte possède une polarité dictée par les cellules folliculaires et nourricières.",
        events: [
            {
                order: 1,
                layer: "N/A",
                movement: "Drapeau de Wolpert",
                description: "Mise en place des concentrations moléculaires dans l'ovocyte, déterminant le pôle assimilateur (métabolique) et un noyau excentré."
            }
        ],
        themeColor: "bg-blue-900",
        mermaidCode: `graph TD\n${colors}\n  A[Ovocyte]:::global -->|Influence Folliculaire| B(Drapeau de Wolpert<br/>Polarité Moléculaire):::global\n  B --> C[Pôle Assimilateur]:::global`
    },
    {
        id: "j-1",
        dayLabel: "Jour 1",
        period: "Fécondation",
        title: "Fécondation et Vague Calcique",
        generalDescription: "Le spermatozoïde traverse la zone pellucide par reconnaissance de la protéine ZP3.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Vague Calcique",
                description: "Réorganisation totale du cytosquelette et de l'axe crânio-caudal de l'ovule suite à la pénétration. Un champ électromagnétique primitif s'installe."
            },
            {
                order: 2,
                layer: "L'Oeil",
                movement: "Ancrage Énergétique et Polarité",
                description: "L'organisation temporelle du premier jour induit un champ métabolique et une polarité. L'Oeil y trouve sa première assise dans le schéma organisationnel global."
            }
        ],
        themeColor: "bg-purple-900",
        mermaidCode: `graph TD\n${colors}\n  A[Fécondation]:::global -->|Pénétration Sp.| B(Vague Calcique Massive):::global\n  B --> C[Champ Électromagnétique Primitif]:::global\n  B --> D[Réorganisation Crânio-Caudale]:::global`,
        practicalIntegration: {
            fulcrums: "Origine Épigénétique du Cœur : vestige énergétique de la fécondation descendant jusqu'à S2/Coccyx. L'axe Cœur-Coccyx relie le cœur actuel à sa source conceptionnelle.",
            generalPalpation: "Diagnostic de motilité tissulaire cardiaque dans l'espace facial : Systole faciale (verticalisation, sur-action, épuisement) vs Diastole faciale (horizontalisation, prostration, recherche d'énergie originelle vers le coccyx).",
            therapistPosture: "Main inférieure sous le bassin (S2/Coccyx, lieu originel de l'axe) et main supérieure sur l'axe du Cœur (angle de Louis). Le but est de reconnecter le tissu cardiaque à son 'blueprint' coccygien.",
            psychosomatic: "Verdict = La Rencontre et l'Information Transgénérationnelle. L'ovocyte reconnaît la clé ZP3. Les FIV/ICSI (sans reconnaissance enzymatique) créent une 'fausse cicatrice' à J1. C'est l'omission de cette étape qui crée un manque de reconnaissance. Le thérapeute répare cette lésion en regardant et en touchant littéralement 'avec l'in-formation de son propre cœur'."
        }
    },
    {
        id: "j-1-4",
        dayLabel: "Jours 1 à 4",
        period: "1ère Semaine",
        title: "Le Clivage et l'Endoderme Primitif",
        generalDescription: "Le zygote subit le processus de clivage. Une explosion métabolique a lieu dans un espace confiné (membrane pellucide) sans croissance volumétrique globale.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Stagnation Volumétrique & Explosion Métabolique",
                description: "L'embryon se multiplie en de nombreux blastomères mais ne grandit pas en volume. Chaque division augmente exponentiellement la surface membranaire par rapport au volume, générant une énorme concentration d'énergie."
            },
            {
                order: 2,
                layer: "L'Endoderme",
                movement: "Création du Blastocèle (Endoderme Précoce)",
                description: "Une petite perte d'eau (exsudat) se produit à chaque clivage. L'accumulation de cet exsudat liquidien repousse les cellules et forme la toute première cavité liquidienne de l'embryon : le blastocèle. Ce blastocèle excentré est la toute première image du système digestif (l'endoderme très précoce) et l'ébauche de la future vésicule vitelline."
            },
            {
                order: 3,
                layer: "Global",
                movement: "L'Éclosion",
                description: "Vers J3-J4, la puissance métabolique, la multiplication et la pression liquidienne font céder la zone pellucide. L'embryon se retrouve libre, avec un pôle embryonnaire dense prêt pour la nidation."
            },
            {
                order: 4,
                layer: "L'Oeil",
                movement: "Concentration Métabolique",
                description: "Dans cette masse en division (stade morula), l'énergie métabolique s'affine. L'organisation topographique commence à esquisser la future ligne médiane et le pôle céphalique (dont dérivera l'Oeil)."
            }
        ],
        themeColor: "bg-indigo-900",
        mermaidCode: `graph TD\n${colors}\n  A[Zygote]:::global --> B(Divisions sans Croissance<br/>Blastomères):::global\n  B -->|Stagnation spatiale| C[Explosion Métabolique Membranaire]:::global\n  C -->|Pression & Exsudats| D(Blastocèle<br/>Endoderme Précoce):::endo\n  D --> E{Éclosion de la Zone Pellucide<br/>J3-J4}:::global\n  E --> F[Prêt pour Nidation]:::global`,
        practicalIntegration: {
            fulcrums: "Axe crânio-caudal primitif (projeté entre Cœur et Coccyx) et l'Ombilic (pédicule originel).",
            generalPalpation: "Densification métabolique sans croissance spatiale. Fluctuation longitudinale primitive et l'exsudat liquidien excentré du blastocèle.",
            layerPerceptions: [
                { layer: "Global", perception: "Travail purement membranaire (pellucide) et liquidien autocrine (champs de pression)." }
            ],
            therapistPosture: "Position de présence asymétrique, main globale captant l'ensemble du volume (non encore différencié).",
            psychosomatic: "Verdict = La reconnaissance. L'ovocyte reconnaît la clé ZP3 du spermatozoïde. En cas de FIV/ICSI (absence de reconnaissance naturelle menant à une « fausse cicatrice »), le traitement passe par le Cœur pour restaurer cette étape originelle d'acceptation de l'incarnation."
        }
    },
    {
        id: "j-5-8",
        dayLabel: "Jours 5 à 8",
        period: "Fin 1ère - Début 2e Semaine",
        title: "L'Éclosion et la Nidation",
        generalDescription: "L'embryon arrive dans l'utérus. Guidé par son pôle assimilateur, il libère un acide pour s'enfouir dans la muqueuse utérine (micro-saignements).",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Nidation et Exsudat",
                description: "Création soudaine par exsudat liquidien de la deuxième cavité : la cavité amniotique (précurseur du LCR et relation avec la mère)."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Différenciation Topographique",
                description: "Le bouton embryonnaire se sépare en disque didermique. Les cellules du dessus forment l'Épiblaste (futur système nerveux)."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Différenciation Topographique",
                description: "Les cellules tournées vers le bas (vers le blastocèle) forment l'Hypoblaste (futur système digestif direct)."
            },
            {
                order: 4,
                layer: "L'Oeil",
                movement: "J7 : LCR Primitif",
                description: "Apparition de la cavité amniotique. Le liquide amniotique primitif formera le premier liquide céphalo-rachidien qui remplira le futur tube neural et le diencéphale (origine de l'Oeil)."
            },
            {
                order: 5,
                layer: "L'Oeil",
                movement: "J8 : Morphologie Symbolique",
                description: "Lors de l'enfouissement dans la muqueuse et avec l'exsudat créant la poche des eaux, la forme de la structure évoque symboliquement celle d'un oeil."
            }
        ],
        themeColor: "bg-rose-900",
        mermaidCode: `graph TD\n${colors}\n  A[Enfouissement Utérin]:::global --> B(Exsudat Cavité Amniotique):::global\n  A --> C{Séparation Didermique}:::global\n  C --> D[Épiblaste<br/>Ectoderme Primitif]:::ecto\n  C --> E[Hypoblaste<br/>Endoderme Primitif]:::endo`,
        practicalIntegration: {
            fulcrums: "La Zone B (champ énergétique autour du corps physique, trace de la cavité amniotique originelle) et le pédicule embryonnaire.",
            generalPalpation: "Mouvement d'infusion et de perméation. Intégration des fluides de la périphérie (mère) vers le centre. Apparition d'une pression bilatérale de l'exsudat.",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Orientation vers le haut, vers le fluide amniotique clair et protecteur, précurseur du LCR." },
                { layer: "L'Endoderme", perception: "Orientation vers le bas, tissu cherchant la nutrition (vésicule vitelline), densité liquidienne différente." }
            ],
            therapistPosture: "Écoute de l'enveloppe large (Zone B). Perception de l'espace liquidien entourant le corps et l'utérus.",
            psychosomatic: "Verdict = L'incarnation dans le réceptacle et la chaleur. Enjeu profond si fausse couche ou non-accueil. Nettoyage de la muqueuse (libération gastrine pelvienne) pour apaiser le nid intra-utérin."
        }
    },
    {
        id: "j-7-14",
        dayLabel: "Jours 7 à 14",
        period: "2e Semaine",
        title: "Réticulum et Cœlome Externe",
        generalDescription: "La périphérie de l'embryon grandit extrêmement vite dans la muqueuse maternelle, provoquant un déchirement relatif avec le disque central qui grandit plus lentement.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Croissance Différentielle",
                description: "Apparition de la membrane de Heuser et d'un espace fibreux comblé par le réticulum extra-embryonnaire en tension."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Création de la 3e Chambre",
                description: "Le réseau arachnoïdien cède sous la traction, créant le vaste exsudat du Cœlome externe. L'ancien blastocèle devient la vésicule vitelline primaire."
            }
        ],
        themeColor: "bg-pink-900",
        mermaidCode: `graph TD\n${colors}\n  A[Croissance Périphérique Différentielle]:::global --> B(Traction Arachnoïdienne):::meso\n  B --> C[Déchirement du Réticulum]:::meso\n  C --> D(Création Cœlome Externe<br/>Mésoderme Extra-Embryonnaire):::meso`
    },
    {
        id: "j-14-21",
        dayLabel: "Jours 14 à 21",
        period: "3e Semaine",
        title: "Gastrulation et Latéralité",
        generalDescription: "Formation du pédicule embryonnaire focalisant l'apport trophique en un seul flux. L'embryon prend une forme de S.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Vague Notochordale",
                description: "L'épiblaste forme un S sous l'effet des flux nourriciers. Apparition de la ligne primitive (nœud de Hensen) et de la Notochorde."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Aspiration et Invagination",
                description: "Un champ d'aspiration sur la ligne primitive aspire des cellules épithéliales (bottle cells) qui s'invaginent pour combler l'espace entre Ecto et Endo : c'est la naissance propre du Mésoderme intra-embryonnaire."
            },
            {
                order: 3,
                layer: "Global",
                movement: "Rotation Ciliaire",
                description: "Au fond du nœud de Hensen, des cils tournent à 60° (flux nodal) poussant des signaux à gauche, determining la future asymétrie des organes."
            }
        ],
        themeColor: "bg-red-900",
        mermaidCode: `graph TD\n${colors}\n  A[Ligne Primitive]:::ecto --> B(Champ d'Aspiration):::ecto\n  B --> C[Invagination Bottle Cells]:::meso\n  C --> D(Naissance du Mésoderme 3ème Tissu):::meso\n  A --> E[Rotation Ciliaire 60°]:::global\n  E --> F(Asymétrie Gauche-Droite):::global`,
        practicalIntegration: {
            fulcrums: "Axe crânio-sacré embryologique primitif (Notochorde). Tension entre deux pôles : Le Point Zéro (Fulcrum fixe, Symphyse Sphéno-Basilaire / SSB) et le Point Sacrum (Fulcrum mobile, Nœud de Hensen, vestige à S2/Coccyx).",
            generalPalpation: "La 'Hola' (puissante vague de croissance notochordale descendante) couplée à la 'Montée du point zéro' (force de télencéphalisation ascendante et de redressement du crâne).",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Poussée directionnelle rectiligne et rigide (notochorde) tractant le pôle central crânien immobile." },
                { layer: "Le Mésoderme", perception: "Perçu comme un champ de succion et d'aspiration ('loosing field'). Les cellules plongent violemment dans la fosse primitive." }
            ],
            therapistPosture: "Le Rayon Laser : Main sous l'Occiput en contact avec la SSB (Point Zéro), main sous le Sacrum (Point Sacrum / Ligne primitive). Pas de manipulation mécanique : recherche du silence ('Wu Wei'), du 'Meeting Point' et de l'immobilité dynamique de la SSB.",
            psychosomatic: "Verdict = L'Axe de Santé et le Transgénérationnel. Les déviations ou blocages gèlent les images ancestrales le long de la notochorde. En reconnectant le point mobile (sacrum) à son fulcrum fixe de référence (Point Zéro), le thérapeute perçoit la relance de la fluctuation et permet au corps de se désengager de ses lésions acquises et de se réorganiser."
        }
    },
    {
        id: "j-21-22",
        dayLabel: "Jours 21 à 22",
        period: "Début 4e Semaine",
        title: "Neurulation, Oeil et Cœur",
        generalDescription: "La notochorde agit comme centre électrique ralentissant la croissance centrale, l'ectoderme se creusant en gouttière neurale. Le cœur commence à battre.",
        events: [
            {
                order: 1,
                layer: "L'Oeil",
                movement: "Expansion Diencéphalique",
                description: "En synchronicité avec les battements cardiaques primitifs, le cerveau produit une expansion latérale créant la vésicule optique primaire."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Cardiogenèse Précoce",
                description: "Le cœur commence à se former (émergence des aortes primitives et des veines cardinales dans la zone apicale). Il va commencer à battre au J21/J22."
            }
        ],
        themeColor: "bg-purple-900",
        mermaidCode: `graph TD\n${colors}\n  A[Ralentissement Notochordal]:::global --> B(Gouttière Neurale):::ecto\n  B --> C[Expansion Diencéphalique<br/>Futurs Yeux]:::ecto\n  D[Zone Apicale Mésodermique]:::meso --> E(Aortes Primitives):::meso\n  E --> F[Début Battements J21/J22]:::meso`,
        practicalIntegration: {
            fulcrums: "Symphyse Sphéno-Basilaire (SSB, Point Zéro), l'Insula (hitch point de la bascule cérébrale), le Neuropore Antérieur, et LE CŒUR.",
            generalPalpation: "Le 'Tai-Chi du Cerveau'. Perception d'une expansion foudroyante, suivie d'une première flexion céphalique d'enroulement paroxystique sur le point fixe central du cœur.",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Explosivité, fuite et immense expansion volumétrique latérale et dorsale (céphalisation). Sensation de coulée migratoire de la Crête Neurale vers la face et les plexus." },
                { layer: "Le Mésoderme", perception: "Frein rigide. Les deux aortes latérales agissent comme des amarrages (le tissu a du mal à suivre la croissance neurale). La cardialisation tracte violemment tout le système vers le centre." }
            ],
            therapistPosture: "Neutralité absolue ('Meeting point'). Prise crânienne englobante 'comme un bol d'eau rempli à ras bord'. Accompagnement de la technique CV4 (compression du 4ème ventricule) pour rééquilibrer les LCR intra et extra crâniens (Zone B).",
            psychosomatic: "Verdict = Le Cœur Informateur. La grande plicature dépose littéralement le cerveau, l'ébauche des membres supérieurs (les mains), les yeux (placodes optiques) et la bouche/voix (arc branchial) **directement sur le tissu cardiaque en battement**. La psychosomatique est majeure : on regarde, on touche et on parle avec l'in-formation de son propre cœur."
        }
    },
    {
        id: "j-22-28",
        dayLabel: "Jours 22 à 28",
        period: "4e Semaine",
        title: "La Grande Cascade Cinétique",
        generalDescription: "C'est l'ordre chronologique et mécanique de plicature (flexion) de l'embryon, causé par la résistance vasculaire face à l'explosive croissance neurale dorsale.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Céphalisation Centrale",
                description: "L'ectoderme épiblastique (futur cerveau central) se met à grandir à une vitesse explosive vers le pôle apical."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Cardialisation (Frein vasculaire)",
                description: "Le tissu mésodermique vasculaire (aortes) grandit beaucoup moins vite. Poussé par la cavité amniotique et freiné mécaniquement par ce système, le cerveau s'enroule vers l'avant. La puissante flexion fait se rencontrer les deux tubes endocardiques écartés, forçant la disparition du tissu médian par un champ de corrosion (fusion endocardique)."
            },
            {
                order: 3,
                layer: "Le Mésoderme",
                movement: "Looping Cardiaque & Diaphragmatisation",
                description: "Le cœur fusionné n'a plus d'espace: il effectue un saut volumétrique tridimensionnel (Looping, le système ventriculaire bascule sous les oreillettes). La croissance continue du cerveau dépose littéralement la tête sur le cœur, qui écrase la partie supérieure de la vésicule vitelline. Ces cellules mésenchymateuses comprimées forment le septum transversum (ébauche du diaphragme)."
            },
            {
                order: 4,
                layer: "L'Endoderme",
                movement: "Désassimilation & Hépatisation",
                description: "Le diaphragme tout juste créé fait barrière. En dessous, le puissant torrent des veines vitellines s'accumule et congestionne le mésoderme. L'allongement local crée un vide d'aspiration postérieur (loosing field) à la jonction des intestins. L'épithélium de l'endoderme digestif est aspiré dans la congestion et bourgeonne/fractalise : c'est la naissance du Foie (qui sert d'abord à capter l'exsudat des déchets embryonnaires)."
            },
            {
                order: 5,
                layer: "L'Endoderme",
                movement: "Moteur Péritonéal Hépatique",
                description: "Organisé par le flux, le Foie explose d'une croissance spatiale massive exclusivement vers la droite (sans pivoter). Cette énorme poussée devient le moteur mécanique abdominal : elle bouscule l'estomac sur la gauche (lui imprimant une rotation) et aide à creuser l'arrière-cavité des épiplons."
            },
            {
                order: 6,
                layer: "L'Endoderme",
                movement: "Pneumatisation & Dynamique d'Aspiration",
                description: "Le redressement de l'embryon crée un puissant vide ('loosing field' thoracique). L'épithélium endodermique s'effondre à l'intérieur du mésoderme (invagination), diverge (bronches souches) puis effectue une bascule rotatoire spirale au niveau du futur hile pulmonaire (haut vers l'arrière, bas vers l'avant, rotation externe)."
            },
            {
                order: 7,
                layer: "Le Mésoderme",
                movement: "Gonadisation / Rénalisation",
                description: "L'énorme croissance spatiale hépatique (couplée à la l'ascension surrénalienne) force la crête génitale vers le bas et détermine les canaux de Wolff et Müller formants reins et gonades."
            }
        ],
        themeColor: "bg-orange-900",
        mermaidCode: `graph TD\n${colors}\n  A[Céphalisation Explosive Ectodermique]:::ecto -->|Frein des Aortes| B(Cardialisation et Fusion):::meso\n  B -->|Looping & Redressement| C{Compression de la masse et<br/>Diaphragmatisation}:::meso\n  C --> D[Congestion Veineuse Inférieure]:::meso\n  D -->|Loosing Field Aspiration| E(Fractalisation Endodermique<br/>Hépatisation):::endo\n  E -->|Croissance spatiale Droite| F[Basculement Estomac & Cavité Péritonéale]:::global\n  C -->|Nouveau Loosing Field| G(Pneumatisation Pulmonaire):::endo\n  F --> H[Poussée sur la Crête Génitale]:::meso`,
        practicalIntegration: {
            fulcrums: "Le Septum Transversum (futur diaphragme/péricarde), le Centre de gravité hépatobiliaire (Foie), l'Hiatus de Winslow (Entrée cavité épiploon) et le Hile Pulmonaire (centre d'articulation asymétrique).",
            generalPalpation: "Palpation en cascade. Suivi du glissement spiralé de l'estomac dans l'arceau péritonéal, de la congestion hépatobiliaire, puis 'bulle d'air' des poumons en suivant leur bascule (rotation externe avec haut vers l'arrière et bas vers l'avant).",
            layerPerceptions: [
                { layer: "L'Endoderme", perception: "[Thorax/Poumon] : L'Aspiration au niveau pulmonaire. Le thérapeute perçoit 'un ballon d'air' avec une pression partielle constante, un échange oxydatif tissulaire entre la fréquence bronchique/aérienne et l'espace liquidien environnant." },
                { layer: "L'Endoderme", perception: "[Abdomen/Digestif] : Aspiration (succion, loosing field digestif), phénomène de bourgeonnement fractal qui demande énormément d'espace à tout l'abdomen." },
                { layer: "Le Mésoderme", perception: "Masse vasculaire congestionnée et lourdement densifiée sous le diaphragme qui stoppe sa progression (Veines vitellines)." }
            ],
            therapistPosture: "Libération par le Vide : englober les basses côtes pour le tube digestif. Pour le Poumon (fulcrum) : main postérieure légèrement plus basse que la main antérieure pour suivre parfaitement l'axe incliné de la bascule d'aspiration pulmonaire.",
            psychosomatic: "Verdict = L'Épuration et le Non-dit. Le Foie naïf capte la toxicité (colère non exprimée/frustration tissulaire portal). Les Poumons (bulle d'air) deviennent la réserve d'une vieille tristesse protégée, perceptible sous les mains par des densités spécifiques. L'Estomac absorbe l'environnement immédiat par spasme. Libérer cette cascade, c'est libérer la chimie de l'hypothalamus."
        }
    },
    {
        id: "j-28",
        dayLabel: "Jour 28",
        period: "Fin du 1er Mois",
        title: "La Merveilleuse Synchronicité",
        generalDescription: "Le moment d'enclenchement mécanique global final de l'enroulement crânio-caudal de l'embryon.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Fermeture Marginale",
                description: "Fermeture complète du tube neural (Neuropore Postérieur)."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Intégration Péritonéale",
                description: "EXACTEMENT en même temps, le cœlome externe est définitivement intégré et fermé en cœlome interne (cavité péritonéale primitive)."
            }
        ],
        themeColor: "bg-yellow-900",
        mermaidCode: `graph TD\n${colors}\n  A[Enroulement Global Terminal]:::global --> B(Fermeture du Neuropore Postérieur):::ecto\n  A --> C(Intégration Finale du Cœlome Externe):::meso`
    },
    {
        id: "j-45",
        dayLabel: "De Jour 35 à 2 Mois",
        period: "2e Mois",
        title: "Somites, Côtes et Voûte Crânienne",
        generalDescription: "L'organisation musculo-squelettique se densifie autour de l'axe nerveux et cardiovasculaire.",
        events: [
            {
                order: 1,
                layer: "Le Mésoderme",
                movement: "Côtes et Médiastin",
                description: "Densification des cellules mésodermiques entre les vaisseaux pour former les côtes qui s'allongent et se rejoignent au J45 (angle sternal de Louis, fermeture du médiastin)."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Télencéphalisation",
                description: "L'étirement des membranes dure-mériennes (cerveau qui se dresse) forme la voûte du crâne conjonctive précoce (desmocrâne)."
            }
        ],
        themeColor: "bg-amber-900",
        mermaidCode: `graph TD\n${colors}\n  A[Rapprochement Côtes Mi-ligne]:::meso --> B(Suture de l'Angle de Louis J45):::meso\n  A --> C[Fermeture du Médiastin]:::meso\n  D[Redressement Axial]:::global --> E(Tension Dure-Mérienne):::ecto\n  E --> F[Modélisation du Desmocrâne]:::ecto`
    },
    {
        id: "maturation-12ans",
        dayLabel: "Jusqu'à 12 ans",
        period: "Maturation Post-Natale",
        title: "Dentition et Maturation Végétative",
        generalDescription: "L'embryologie continue à l'air libre. La posture et l'énergétique de l'enfant finalisent la dynamique tissulaire.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Croissance Cérébrale Externe (0-6 mois)",
                description: "Le volume neural double encore dans les 6 premiers mois, modulant continuellement les membranes réciproques."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Capteur Dentaire et Posture (6-10 mois)",
                description: "Les premières dents agissent comme un point de pivot/fulcrum mécanique fixe, permettant à l'enfant le redressement dynamique de son axe neuro-vertébral."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Pneumatisation Maxillaire (3 ans)",
                description: "Les sinus maxillaires s'aèrent, les surrénales et l'appendice s'engagent pleinement dans leur physiologie."
            },
            {
                order: 4,
                layer: "Global",
                movement: "Activation Thyroïdienne (7 ans)",
                description: "La thyroïde prend définitivement le relais radiateur de la chaleur parentale (véritable âge de raison thermogénique)."
            },
            {
                order: 5,
                layer: "Global",
                movement: "Activation Pubertaire (10-12 ans)",
                description: "Hypophyse active, pneumatisation sphénoïdale de la base du crâne paravent pour intégrer les fonctions hormonales adultes."
            }
        ],
        themeColor: "bg-emerald-900",
        mermaidCode: `graph TD\n${colors}\n  A[Dentition 6m]:::ecto --> B(Pivot de Redressement Neural):::ecto\n  C[Pneumatisation Maxillaire 3A]:::endo --> D(Engagement Appendice/Surrénales):::endo\n  E[Relais Thyroïdien 7A]:::global --> F(Autonomie Calorique):::global\n  G[Hypophyse Pubertaire 12A]:::global --> H(Pneumatisation Sphénoïdale):::global`
    }
];
