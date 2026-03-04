import type { StageDataV2 } from './embryologie';

const colors = `
classDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;
classDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;
classDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;
classDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;
`;

export const detailedStages: StageDataV2[] = [
    {
        id: "j-0",
        dayLabel: "Before Day 1",
        period: "Pre-conceptual Period & Maturation",
        title: "Polarity, Preparation and Information",
        generalDescription: "The oocyte is not neutral. From its maturation in the follicles, it is bathed in the mother's systemic fluids, absorbing the biochemical and emotional environment.",
        events: [
            {
                order: 1,
                layer: "N/A",
                movement: "Maturation & Transgenerational Imprint",
                description: "The oocyte stock is formed in utero. Emotional shocks and the quality of maternal blood circulation already impregnate these cells. The oocyte integrates the stress of the mother but also of the grandmother."
            },
            {
                order: 2,
                layer: "N/A",
                movement: "Wolpert's Flag (Concentration)",
                description: "Establishment of the asymmetric metabolic axis. Maternal proteins and mRNA polarize, moving the nucleus to the animal pole. This is the appearance of the reference cranio-caudal axis, long before fertilization."
            },
            {
                order: 3,
                layer: "N/A",
                movement: "Assimilative Pole",
                description: "Segregation between the yolk (energy reserves) and morphogen gradients. The cytoskeleton organizes and puts the oocyte under tension for reception."
            }
        ],
        themeColor: "bg-blue-900",
        mermaidCode: `graph TD\n${colors}\n  A[Maturing Oocyte]:::global -->|Maternal Imprint| B(Follicular Fluids & Secretions):::global\n  B --> C[Wolpert's Flag]:::global\n  C --> D(Original Cranio-Caudal Axis):::global\n  D --> E[Synthetic Pole/Nucleus]:::global`
    },
    {
        id: "j-1",
        dayLabel: "Day 1",
        period: "Fertilization",
        title: "The Encounter & The Calcium Wave",
        generalDescription: "At the tubal ampulla, a single spermatozoon will penetrate. It is an energetic explosion and the absolute moment of incarnation.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Key Recognition (ZP3)",
                description: "The oocyte actively 'chooses' through enzymatic recognition via the ZP3 protein of its zona pellucida. A non-reception or short-circuit of this phase (e.g. IVF) does not create the natural electrical scar of D1."
            },
            {
                order: 2,
                layer: "Global",
                movement: "Electromagnetic Shock",
                description: "Upon entry, immediate electrical inversion (blockage of polyspermy) and explosive release of zinc. The oocyte completes its meiosis."
            },
            {
                order: 3,
                layer: "Global",
                movement: "The Massive Calcium Wave",
                description: "Total and lightning reorganization of the cytoskeleton dictated by a surge of calcium. It is the spark of life that freezes the cranio-caudal axis (vestige projected later towards S2/Coccyx, and connected to the Heart)."
            },
            {
                order: 4,
                layer: "L'Oeil",
                movement: "Foundation of Sensory Information",
                description: "Although the physical eye does not exist, the polarity of the central nervous system and diencephalon finds its foundation in the electric field produced at this moment."
            }
        ],
        themeColor: "bg-purple-900",
        mermaidCode: `graph TD\n${colors}\n  A[Fertilization]:::global -->|ZP3 Recognition| B(Electrical Inversion):::global\n  B --> C[Zinc Release]:::global\n  C --> D{Explosive Calcium Wave}:::global\n  D --> E(Cytoskeleton Reorganization):::global\n  D --> F(Crystallization of Central Axis):::global`,
        practicalIntegration: {
            fulcrums: "Epigenetic Origin of the Heart: energetic vestige of fertilization descending to S2/Coccyx. The Heart-Coccyx axis connects the current heart to its conceptional source.",
            generalPalpation: "Cardiac tissue motility diagnosis in the facial space: Facial systole (verticalization, over-action, exhaustion) vs Facial diastole (horizontalization, prostration, search for original energy towards the coccyx).",
            layerPerceptions: [
                { layer: "Global", perception: "Primitive wave, very long amplitude fluctuation oriented along the original longitudinal axis." }
            ],
            therapistPosture: "Lower hand under the pelvis (S2/Coccyx, original location of the axis) and upper hand on the axis of the Heart (angle of Louis). The goal is to reconnect the cardiac tissue to its coccygeal 'blueprint'.",
            psychosomatic: "Verdict = The Encounter and Transgenerational Information. The oocyte recognizes the ZP3 key. This is the moment of the 'original scar'. Treatment by and with the field of the heart."
        }
    },
    {
        id: "j-1-4",
        dayLabel: "Days 1 to 4",
        period: "1st Week",
        title: "Radical Stagnation and Cleavage",
        generalDescription: "The zygote performs a cascade of multiplications by squeezing together, without any increase in total volume.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Prison of the Zona Pellucida",
                description: "The system is enclosed in this shell. The zygote cleaves into 2, then 4, 8, and 16 cells (the Morula). The lack of growth space generates immense latent energetic pressure."
            },
            {
                order: 2,
                layer: "Global",
                movement: "Metabolic Explosion (Surface Increase)",
                description: "At equal volume, the membrane surface is multiplied exponentially. This extreme concentration of membrane multiplies cellular activity and respiration."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Birth of the Blastocoel (Early Digestive Motor)",
                description: "During this cleavage under pressure, the cells reject a fluid exudate (first waste). This fluid pushes the blastomeres apart outward (trophoblast) and forms the blastocoel. This cavity is the very first asymmetric initiation of the digestive system and absorption."
            },
            {
                order: 4,
                layer: "L'Ectoderme",
                movement: "Embryonic Pole and Centralization",
                description: "The cells massed on one side (Embryonic bud) secretly prepare the ground for the famous disk that will become the nervous system and skin."
            },
            {
                order: 5,
                layer: "Global",
                movement: "Rupture and Hatching (D4)",
                description: "The intraluminal pressure of the liquid and multiplication make the situation untenable. The embryo breaks the zona pellucida to emerge, ready to dock to the mother."
            }
        ],
        themeColor: "bg-indigo-900",
        mermaidCode: `graph TD\n${colors}\n  A[Zygote]:::global --> B(Divisions without Volumetric Growth):::global\n  B -->|Membrane Surface Increase| C[Metabolic & Energetic Pressure]:::global\n  C -->|Fluid Exudate Rejection| D(Blastocoel<br/>Endoderm Appearance):::endo\n  D --> E[Embryonic Bud Concentration]:::ecto\n  E --> F{Radical Hatching D4/D5}:::global`,
        practicalIntegration: {
            fulcrums: "Primitive cranio-caudal axis and 'pressure envelopes'. The early Blastocoel as the origin of visceral tensions.",
            generalPalpation: "Metabolic densification without tissue expansion. Perception of a hindered longitudinal fluctuation, and search for 'release/hatching' at deep tissue levels.",
            layerPerceptions: [
                { layer: "Global", perception: "Purely membranous (pellucida) and fluid auto-crine work (pressure fields)." },
                { layer: "L'Endoderme", perception: "Dynamics of fluid accumulation and effusion (the beginning of physiological absorption and endodermal elimination)." }
            ],
            therapistPosture: "Asymmetrical presence position, global hand capturing the whole volume still indistinguishable.",
            psychosomatic: "Verdict = Confinement, expectation and accumulation. Dynamics of restraint before the great 'release'."
        }
    },
    {
        id: "j-5-8",
        dayLabel: "Days 5 to 8",
        period: "End 1st - Early 2nd Week",
        title: "Hatching and Implantation",
        generalDescription: "The embryo arrives in the uterus. Guided by its assimilative pole, it releases an acid to burrow into the uterine mucosa (micro-bleeding).",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Implantation and Exudate",
                description: "Sudden creation of the second cavity by fluid exudate: the amniotic cavity (precursor of CSF and relationship with the mother)."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Topographical Differentiation",
                description: "The embryonic bud separates into a bilaminar disk. The top cells form the Epiblast (future nervous system)."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Topographical Differentiation",
                description: "The cells facing downwards (towards the blastocoel) form the Hypoblast (future direct digestive system)."
            },
            {
                order: 4,
                layer: "L'Oeil",
                movement: "D7: Primitive CSF",
                description: "Appearance of the amniotic cavity. The primitive amniotic fluid will form the first cerebrospinal fluid that will fill the future neural tube and the diencephalon (origin of the Eye)."
            },
            {
                order: 5,
                layer: "L'Oeil",
                movement: "D8: Symbolic Morphology",
                description: "During burying in the mucosa and with the exudate creating the amniotic sac, the shape of the structure symbolically evokes that of an eye."
            }
        ],
        themeColor: "bg-rose-900",
        mermaidCode: `graph TD\n${colors}\n  A[Uterine Burying]:::global --> B(Amniotic Cavity Exudate):::global\n  A --> C{Bilaminar Separation}:::global\n  C --> D[Epiblast<br/>Primitive Ectoderm]:::ecto\n  C --> E[Hypoblast<br/>Primitive Endoderm]:::endo`,
        practicalIntegration: {
            fulcrums: "Zone B (energetic field around the physical body, trace of the original amniotic cavity) and the embryonic stalk.",
            generalPalpation: "Movement of infusion and permeation. Integration of fluids from the periphery (mother) to the center. Appearance of bilateral exudate pressure.",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Upward orientation, towards the clear and protective amniotic fluid, precursor of CSF." },
                { layer: "L'Endoderme", perception: "Downward orientation, tissue seeking nutrition (yolk sac), different fluid density." }
            ],
            therapistPosture: "Listening to the wide envelope (Zone B). Perception of the fluid space surrounding the body and the uterus.",
            psychosomatic: "Verdict = Incarnation in the receptacle and warmth. Deep issue if miscarriage or non-reception. Mucosal cleansing (pelvic gastrin release) to soothe the intrauterine nest."
        }
    },
    {
        id: "j-7-14",
        dayLabel: "Days 7 to 14",
        period: "2nd Week",
        title: "Reticulum and Extraembryonic Coelom",
        generalDescription: "The periphery of the embryo grows extremely fast in the maternal mucosa, causing a relative tearing with the central disk which grows slower.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Differential Growth",
                description: "Appearance of Heuser's membrane and a fibrous space filled by the extraembryonic reticulum under tension."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Creation of the 3rd Chamber",
                description: "The arachnoid network yields under traction, creating the vast exudate of the extraembryonic Coelom. The old blastocoel becomes the primary yolk sac."
            }
        ],
        themeColor: "bg-pink-900",
        mermaidCode: `graph TD\n${colors}\n  A[Differential Peripheral Growth]:::global --> B(Arachnoidal Traction):::meso\n  B --> C[Tearing of the Reticulum]:::meso\n  C --> D(Creation Extra Coelom<br/>Extraembryonic Mesoderm):::meso`
    },
    {
        id: "j-14-21",
        dayLabel: "Days 14 to 21",
        period: "3rd Week",
        title: "Gastrulation and Laterality",
        generalDescription: "Formation of the embryonic stalk focusing trophic intake into a single flow. The embryo takes an S shape.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Notochordal Wave",
                description: "The epiblast forms an S under the effect of nourishing flows. Appearance of the primitive streak (Hensen's node) and the Notochord."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Aspiration and Invagination",
                description: "An aspiration field on the primitive streak sucks in epithelial cells (bottle cells) which invaginate to fill the space between Ecto and Endo: this is the actual birth of the intraembryonic Mesoderm."
            },
            {
                order: 3,
                layer: "Global",
                movement: "Ciliary Rotation",
                description: "At the bottom of Hensen's node, cilia rotate at 60° (nodal flow) pushing signals left, determining the future asymmetry of organs."
            }
        ],
        themeColor: "bg-red-900",
        mermaidCode: `graph TD\n${colors}\n  A[Primitive Streak]:::ecto --> B(Aspiration Field):::ecto\n  B --> C[Bottle Cells Invagination]:::meso\n  C --> D(Birth of Mesoderm 3rd Layer):::meso\n  A --> E[Ciliary Rotation 60°]:::global\n  E --> F(Left-Right Asymmetry):::global`,
        practicalIntegration: {
            fulcrums: "Primitive embryological cranio-sacral axis (Notochord). Tension between two poles: The Zero Point (Fixed fulcrum, Sphenobasilar Synchondrosis / SBS) and the Sacrum Point (Mobile fulcrum, Hensen's node, vestige at S2/Coccyx).",
            generalPalpation: "The 'Wave' (powerful wave of descending notochordal growth) coupled with the 'Rise of the zero point' (upward telencephalization force and straightening of the skull).",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Straight and rigid directional thrust (notochord) tracting the immobile cranial central pole." },
                { layer: "Le Mésoderme", perception: "Perceived as a suction and aspiration field ('loosing field'). The cells plunge violently into the primitive pit." }
            ],
            therapistPosture: "The Laser Beam: Hand under the Occiput in contact with the SBS (Zero Point), hand under the Sacrum (Sacrum Point / Primitive streak). No mechanical manipulation: search for silence ('Wu Wei'), the 'Meeting Point' and the dynamic immobility of the SBS.",
            psychosomatic: "Verdict = The Axis of Health and the Transgenerational. Deviations or blockages freeze ancestral images along the notochord. By reconnecting the mobile point (sacrum) to its fixed reference fulcrum (Zero Point), the therapist perceives the restart of fluctuation and allows the body to disengage from its acquired lesions and reorganize."
        }
    },
    {
        id: "j-21-22",
        dayLabel: "Days 21 to 22",
        period: "Early 4th Week",
        title: "Neurulation, Eye and Heart",
        generalDescription: "The notochord acts as an electrical center slowing down central growth, the ectoderm hollowing into a neural groove. The heart begins to beat.",
        events: [
            {
                order: 1,
                layer: "L'Oeil",
                movement: "Diencephalic Expansion",
                description: "In synchrony with primitive heartbeats, the brain produces a lateral expansion creating the primary optic vesicle."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Early Cardiogenesis",
                description: "The heart begins to form (emergence of primitive aortas and cardinal veins in the apical zone). It will start beating at D21/D22."
            }
        ],
        themeColor: "bg-purple-900",
        mermaidCode: `graph TD\n${colors}\n  A[Notochordal Slowdown]:::global --> B(Neural Groove):::ecto\n  B --> C[Diencephalic Expansion<br/>Future Eyes]:::ecto\n  D[Apical Mesodermal Zone]:::meso --> E(Primitive Aortas):::meso\n  E --> F[Start Beating D21/D22]:::meso`,
        practicalIntegration: {
            fulcrums: "Sphenobasilar Synchondrosis (SBS, Zero Point), the Insula (hitch point of brain tilting), the Anterior Neuropore, and THE HEART.",
            generalPalpation: "The 'Tai-Chi of the Brain'. Perception of a lightning expansion, followed by a first cephalic flexion of paroxysmal rolling up on the central fixed point of the heart.",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Explosiveness, flight and immense lateral and dorsal volumetric expansion (cephalization). Feeling of migratory flow of the Neural Crest towards the face and plexuses." },
                { layer: "Le Mésoderme", perception: "Rigid brake. The two lateral aortas act as moorings (the tissue struggles to follow neural growth). Cardialization violently tracts the entire system towards the center." }
            ],
            therapistPosture: "Absolute neutrality ('Meeting point'). Encompassing cranial hold 'like a bowl of water filled to the brim'. Accompaniment of the CV4 technique (compression of the 4th ventricle) to rebalance the intra and extra cranial CSF (Zone B).",
            psychosomatic: "Verdict = The Informing Heart. The great folding literally deposits the brain, the draft of upper limbs (hands), eyes (optic placodes) and mouth/voice (branchial arch) **directly onto the beating cardiac tissue**. Psychosomatics are major: we look, touch and speak with the in-formation of our own heart."
        }
    },
    {
        id: "j-22-28",
        dayLabel: "Days 22 to 28",
        period: "4th Week",
        title: "The Great Kinetic Cascade",
        generalDescription: "This is the chronological and mechanical order of folding (flexion) of the embryo, caused by vascular resistance to explosive dorsal neural growth.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Central Cephalization",
                description: "The epiblastic ectoderm (future central brain) begins to grow at an explosive rate towards the apical pole."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Cardialization (Vascular Brake)",
                description: "The vascular mesodermal tissue (aortas) grows much slower. Pushed by the amniotic cavity and mechanically braked by this system, the brain curls forward. The powerful flexion brings the two spaced endocardial tubes together, forcing the disappearance of median tissue by a corrosion field (endocardial fusion)."
            },
            {
                order: 3,
                layer: "Le Mésoderme",
                movement: "Cardiac Looping & Diaphragmatization",
                description: "The fused heart has no more space: it makes a three-dimensional volumetric jump (Looping, the ventricular system tilts under the atria). The continuous brain growth literally deposits the head on the heart, which crushes the upper part of the yolk sac. These compressed mesenchymal cells form the septum transversum (draft of the diaphragm)."
            },
            {
                order: 4,
                layer: "L'Endoderme",
                movement: "Desassimilation & Hepatization",
                description: "The newly created diaphragm acts as a barrier. Below, the powerful torrent of vitelline veins accumulates and congests the mesoderm. Local elongation creates a posterior suction vacuum (loosing field) at the intestinal junction. The epithelium of the digestive endoderm is sucked into the congestion and buds/fractals: this is the birth of the Liver (which is first used to capture the exudate of embryonic waste)."
            },
            {
                order: 5,
                layer: "L'Endoderme",
                movement: "Hepatic Peritoneal Engine",
                description: "Organized by flow, the Liver explodes with massive spatial growth exclusively to the right (without pivoting). This enormous thrust becomes the abdominal mechanical engine: it jostles the stomach to the left (giving it a rotation) and helps hollow out the lesser sac of the omentum."
            },
            {
                order: 6,
                layer: "L'Endoderme",
                movement: "Pneumatization & Aspiration Dynamics",
                description: "The straightening of the embryo creates a powerful vacuum (thoracic 'loosing field'). The endodermal epithelium collapses inside the mesoderm (invagination), diverges (main bronchi) then performs a spiral rotary tilt at the level of the future pulmonary hilum (up towards back, down towards front, external rotation)."
            },
            {
                order: 7,
                layer: "Le Mésoderme",
                movement: "Gonadization / Renalization",
                description: "Enormous hepatic spatial growth (coupled with adrenal ascension) forces the genital ridge down and determines the Wolffian and Müllerian ducts forming kidneys and gonads."
            }
        ],
        themeColor: "bg-orange-900",
        mermaidCode: `graph TD\n${colors}\n  A[Explosive Ectodermal Cephalization]:::ecto -->|Aortas Brake| B(Cardialization and Fusion):::meso\n  B -->|Looping & Straightening| C{Compression of the mass and<br/>Diaphragmatization}:::meso\n  C --> D[Inferior Venous Congestion]:::meso\n  D -->|Loosing Field Aspiration| E(Endodermal Fractalization<br/>Hepatization):::endo\n  E -->|Right Spatial Growth| F[Stomach Tilting & Peritoneal Cavity]:::global\n  C -->|New Loosing Field| G(Pulmonary Pneumatization):::endo\n  F --> H[Thrust on Genital Ridge]:::meso`,
        practicalIntegration: {
            fulcrums: "Septum Transversum (future diaphragm/pericardium), the hepatobiliary center of gravity (Liver), the epiploic foramen, and the Pulmonary Hilum (asymmetric articulation center).",
            generalPalpation: "Cascade palpation. Following the spiral sliding of the stomach in the peritoneal arch, the hepatobiliary congestion, then 'air bubble' of the lungs following their tilt (external rotation with top back and bottom forward).",
            layerPerceptions: [
                { layer: "L'Endoderme", perception: "[Thorax/Lung]: Aspiration at pulmonary level. The therapist perceives 'an air balloon' with constant partial pressure, a tissue oxidative exchange between bronchial/air frequency and surrounding fluid space." },
                { layer: "L'Endoderme", perception: "[Abdomen/Digestive]: Aspiration (suction, digestive loosing field), fractal budding phenomenon demanding enormous space for whole abdomen." },
                { layer: "Le Mésoderme", perception: "Vascular mass congested and heavily densified under the diaphragm that stops its progression (Vitelline veins)." }
            ],
            therapistPosture: "Release by Vacuum: encompass lower ribs for digestive tract. For Lung (fulcrum): posterior hand slightly lower than anterior hand to perfectly follow the inclined axis of pulmonary aspiration tilt.",
            psychosomatic: "Verdict = Purification and Unsaid. Naive Liver captures toxicity (unexpressed anger/portal tissue frustration). Lungs (air bubble) become a reserve of old protected sadness, perceptible under hands by specific densities. Stomach absorbs immediate environment by spasm. Releasing this cascade means releasing hypothalamus chemistry."
        }
    },
    {
        id: "j-28",
        dayLabel: "Day 28",
        period: "End of 1st Month",
        title: "The Wonderful Synchronicity",
        generalDescription: "The moment of final global mechanical engagement of the cranio-caudal folding of the embryo.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Marginal Closure",
                description: "Complete closure of the neural tube (Posterior Neuropore)."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Peritoneal Integration",
                description: "EXACTLY at the same time, the extraembryonic coelom is permanently integrated and closed into the internal coelom (primitive peritoneal cavity)."
            }
        ],
        themeColor: "bg-yellow-900",
        mermaidCode: `graph TD\n${colors}\n  A[Terminal Global Folding]:::global --> B(Posterior Neuropore Closure):::ecto\n  A --> C(Final Extra Coelom Integration):::meso`
    },
    {
        id: "j-45",
        dayLabel: "From Day 35 to 2 Months",
        period: "2nd Month",
        title: "Somites, Ribs and Cranial Vault",
        generalDescription: "The musculoskeletal organization densifies around the neural and cardiovascular axis.",
        events: [
            {
                order: 1,
                layer: "Le Mésoderme",
                movement: "Ribs and Mediastinum",
                description: "Densification of mesodermal cells between vessels to form the ribs which lengthen and meet at Day 45 (sternal angle of Louis, closing of the mediastinum)."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Telencephalization",
                description: "Stretching of dural membranes (brain rising) forms the early connective cranial vault (desmocranium)."
            }
        ],
        themeColor: "bg-amber-900",
        mermaidCode: `graph TD\n${colors}\n  A[Ribs approaching Midline]:::meso --> B(Louis Angle Suture D45):::meso\n  A --> C[Mediastinum Closure]:::meso\n  D[Ascending Axis]:::global --> E(Dural Tension):::ecto\n  E --> F[Desmocranium Modeling]:::ecto`
    },
    {
        id: "maturation-12ans",
        dayLabel: "Up to 12 years",
        period: "Post-Natal Maturation",
        title: "Dentition and Vegetative Maturation",
        generalDescription: "Embryology continues in the open air. The child's posture and energetics finalize tissue dynamics.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "External Brain Growth (0-6 months)",
                description: "Neural volume doubles again in the first 6 months, continually modulating reciprocal membranes."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Dental Sensor and Posture (6-10 months)",
                description: "The first teeth act as a fixed mechanical pivot/fulcrum, allowing the child dynamic straightening of their neuro-vertebral axis."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Maxillary Pneumatization (3 years)",
                description: "Maxillary sinuses aerate, adrenals and appendix fully engage in their physiology."
            },
            {
                order: 4,
                layer: "Global",
                movement: "Thyroid Activation (7 years)",
                description: "The thyroid permanently takes over the parental heat radiator (true age of thermogenic reason)."
            },
            {
                order: 5,
                layer: "Global",
                movement: "Pubertal Activation (10-12 years)",
                description: "Active pituitary gland, sphenoidal pneumatization of skull base acts as a screen to integrate adult hormonal functions."
            }
        ],
        themeColor: "bg-emerald-900",
        mermaidCode: `graph TD\n${colors}\n  A[Dentition 6m]:::ecto --> B(Neural Straightening Pivot):::ecto\n  C[Maxillary Pneumatization 3Y]:::endo --> D(Adrenals/Appendix Engagement):::endo\n  E[Thyroid Relay 7Y]:::global --> F(Caloric Autonomy):::global\n  G[Pubertal Pituitary 12Y]:::global --> H(Sphenoidal Pneumatization):::global`
    }
];
