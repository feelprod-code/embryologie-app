import type { StageDataV2 } from './embryologie';


export const detailedStages: StageDataV2[] = [
    {
        "id": "j-0",
        "dayLabel": "Before Day 1",
        "period": "Pre-conceptual Period & Maturation",
        "title": "Polarity, Preparation and Information",
        "generalDescription": "The oocyte is not neutral. From its maturation in the follicles, it is bathed in the mother's systemic fluids, becoming impregnated with the biochemical and emotional environment.",
        "events": [
            {
                "order": 1,
                "layer": "N/A",
                "movement": "Maturation & Transgenerational Imprinting",
                "description": "The stock of oocytes is formed in utero. Emotional shocks and the quality of the mother's blood circulation already permeate these cells. The oocyte integrates the stresses of the mother but also of the grandmother."
            },
            {
                "order": 2,
                "layer": "N/A",
                "movement": "Wolpert's Flag (Concentration)",
                "description": "Establishment of the asymmetrical metabolic axis. Maternal proteins and messenger RNA polarise, shifting the nucleus towards the animal pole. This is the appearance of the reference cranio-caudal axis, well before fertilisation."
            },
            {
                "order": 3,
                "layer": "N/A",
                "movement": "Assimilative Pole",
                "description": "Segregation between the yolk (energy reserves) and morphogen gradients. The cytoskeleton organises and puts the oocyte under tension for reception."
            }
        ],
        "themeColor": "bg-blue-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Maturing Oocyte]:::global -->|Maternal Imprint| B(Follicular Fluids & Secretions):::global\n  B --> C[Wolpert's Flag]:::global\n  C --> D(Original Cranio-Caudal Axis):::global\n  D --> E[Synthetic Pole/Nucleus]:::global"
    },
    {
        "id": "j-1",
        "dayLabel": "Day 1",
        "period": "Fertilisation",
        "title": "The Encounter & The Calcium Wave",
        "generalDescription": "At the ampulla of the fallopian tube, a single spermatozoon will penetrate. This is an energetic explosion and the absolute moment of incarnation.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Key Recognition (ZP3)",
                "description": "The oocyte actively 'chooses' through enzymatic recognition via the ZP3 protein of its zona pellucida. A non-reception or short-circuiting of this phase (e.g. IVF) does not create the natural electrical scar of D1."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Electromagnetic Shock",
                "description": "Upon entry, immediate electrical reversal (polyspermy block) and explosive zinc release. The oocyte completes its meiosis."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "The Massive Calcium Wave",
                "description": "Total and sudden reorganisation of the cytoskeleton dictated by a surge of calcium. This is the spark of life that fixes the cranio-caudal axis (a vestige later projected towards S2/Coccyx, and connected to the Heart)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "Seat of Sensory Information",
                "description": "Although the physical eye does not exist, the polarity of the central and diencephalic nervous system finds its foundation in the electrical field produced at that instant."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Fertilization]:::global -->|ZP3 Recognition| B(Electrical Reversal):::global\n  B --> C[Zinc Release]:::global\n  C --> D{Explosive Calcium Wave}:::global\n  D --> E(Cytoskeleton Reorganization):::global\n  D --> F(Central Axis Crystallization):::global",
        "practicalIntegration": {
            "fulcrums": "Epigenetic Origin of the Heart: energetic vestige of fertilisation descending to S2/Coccyx. The Heart-Coccyx axis connects the current heart to its conceptual source.",
            "generalPalpation": "Diagnosis of cardiac tissue motility in the facial space: Facial systole (verticalisation, over-action, exhaustion) vs Facial diastole (horizontalisation, prostration, search for original energy towards the coccyx).",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Primitive wave, a fluctuation of very long amplitude oriented along the original longitudinal axis."
                }
            ],
            "therapistPosture": "Lower hand under the pelvis (S2/Coccyx, original site of the axis) and upper hand on the Heart axis (angle of Louis). The aim is to reconnect the cardiac tissue to its coccygeal 'blueprint'.",
            "psychosomatic": "Verdict = The Encounter and Transgenerational Information. The oocyte recognises the ZP3 key. This is the moment of the 'original scar'. Treatment by and with the heart field."
        }
    },
    {
        "id": "j-1-4",
        "dayLabel": "Days 1 to 4",
        "period": "1st Week",
        "title": "Radical Stagnation and Cleavage",
        "generalDescription": "The zygote undergoes a cascade of multiplications by compacting, without any increase in total volume.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Prison of the Zona Pellucida",
                "description": "The system is enclosed within this shell. The zygote cleaves into 2, then 4, 8, and 16 cells (the Morula). The absence of growth space generates immense latent energetic pressure."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Metabolic Explosion (Increased Surfaces)",
                "description": "At equal volume, the membrane surface area is multiplied exponentially. This extreme concentration of membrane vastly increases cellular activity and respiration."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Birth of the Blastocoel (Early Digestive Engine)",
                "description": "During this cleavage under pressure, the cells reject a liquid exudate (first waste products). This fluid pushes the blastomeres outwards (the trophoblast) and forms the blastocoel. This cavity is the very first asymmetrical beginning of the digestive system and absorption."
            },
            {
                "order": 4,
                "layer": "L'Ectoderme",
                "movement": "Embryonic Pole and Centralisation",
                "description": "The cells massed on one side (Embryonic Knob) secretly prepare the ground for the famous disc that will become the nervous system and the skin."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Rupture and Hatching (Day 4)",
                "description": "The intraluminal fluid pressure and multiplication make the situation untenable. The embryo breaks through the zona pellucida to emerge, ready to attach to the mother."
            }
        ],
        "themeColor": "bg-indigo-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Zygote]:::global --> B(Divisions without Volumetric Growth):::global\n  B -->|Increased Membrane Surface| C[Metabolic & Energetic Pressure]:::global\n  C -->|Fluid Exudate Release| D(Blastocoel<br/>Endoderm Appearance):::endo\n  D --> E[Embryonic Button Concentration]:::ecto\n  E --> F{Radical Hatching D4/D5}:::global",
        "practicalIntegration": {
            "fulcrums": "Primitive cranio-caudal axis and 'pressure envelopes'. The early blastocoel as the origin of visceral tensions.",
            "generalPalpation": "Metabolic densification without tissue expansion. Perception of impeded longitudinal fluctuation, and search for \"release/hatching\" at deep tissue levels.",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Purely membranous (pellucid) and autocrine fluid (pressure fields) work."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Dynamics of fluid accumulation and effusion (the beginning of endodermal absorption and elimination physiology)."
                }
            ],
            "therapistPosture": "Asymmetrical presence position, global hand capturing the entire, as yet indiscernible, volume.",
            "psychosomatic": "Verdict = Entrapment, waiting, and accumulation. Dynamics of retention before the great 'release'."
        }
    },
    {
        "id": "j-5-8",
        "dayLabel": "Days 5 to 8",
        "period": "End of 1st - Beginning of 2nd Week",
        "title": "Hatching and Implantation",
        "generalDescription": "The embryo arrives in the uterus. Guided by its assimilative pole, it releases an acid to embed itself in the uterine lining (micro-bleeding).",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Nidation and Exudate",
                "description": "Sudden creation by fluid exudate of the second cavity: the amniotic cavity (precursor of the CSF and relationship with the mother)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Topographical Differentiation",
                "description": "The embryonic button separates into a didermic disc. The cells on top form the Epiblast (future nervous system)."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Topographical Differentiation",
                "description": "The cells facing downwards (towards the blastocoel) form the Hypoblast (the future direct digestive system)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "D7: Primitive CSF",
                "description": "Appearance of the amniotic cavity. The primitive amniotic fluid will form the first cerebrospinal fluid that will fill the future neural tube and the diencephalon (origin of the Eye)."
            },
            {
                "order": 5,
                "layer": "L'Oeil",
                "movement": "D8: Symbolic Morphology",
                "description": "When embedding in the mucosa, and with the exudate creating the amniotic sac, the shape of the structure symbolically evokes that of an eye."
            }
        ],
        "themeColor": "bg-rose-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Uterine Embedding]:::global --> B(Amniotic Cavity Exudate):::global\n  A --> C{Didermic Separation}:::global\n  C --> D[Epiblast<br/>Primitive Ectoderm]:::ecto\n  C --> E[Hypoblast<br/>Primitive Endoderm]:::endo",
        "practicalIntegration": {
            "fulcrums": "Zone B (the energetic field around the physical body, a trace of the original amniotic cavity) and the embryonic pedicle.",
            "generalPalpation": "Movement of infusion and permeation. Integration of fluids from the periphery (mother) towards the centre. Appearance of bilateral exudate pressure.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Orientation upwards, towards the clear and protective amniotic fluid, precursor of the CSF."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Downward orientation, tissue seeking nutrition (yolk sac), different fluid density."
                }
            ],
            "therapistPosture": "Listening to the wide envelope (Zone B). Perception of the fluid space surrounding the body and the uterus.",
            "psychosomatic": "Verdict = Incarnation in the receptacle and warmth. Profound issue if miscarriage or non-acceptance. Cleansing of the mucosa (pelvic gastrin release) to soothe the intra-uterine nest."
        }
    },
    {
        "id": "j-7-14",
        "dayLabel": "Days 7 to 14",
        "period": "2nd Week",
        "title": "Reticulum and External Coelom",
        "generalDescription": "The periphery of the embryo grows extremely rapidly into the maternal mucosa, causing a relative tearing with the central disc, which grows more slowly.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Differential Growth",
                "description": "Appearance of Heuser's membrane and a fibrous space filled with the extraembryonic reticulum under tension."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Creation of the 3rd Chamber",
                "description": "The arachnoid network yields under traction, creating the vast exudate of the Exocoelom. The old blastocoel becomes the primary yolk sac."
            }
        ],
        "themeColor": "bg-pink-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Differential Peripheral Growth]:::global --> B(Arachnoid Traction):::meso\n  B --> C[Reticulum Tearing]:::meso\n  C --> D(External Coelom Creation<br/>Extra-Embryonic Mesoderm):::meso"
    },
    {
        "id": "j-14-21",
        "dayLabel": "Days 14 to 21",
        "period": "3rd Week",
        "title": "Gastrulation and Laterality",
        "generalDescription": "Formation of the embryonic stalk, focusing the trophic supply into a single stream. The embryo takes on an S-shape.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Notochordal Wave",
                "description": "The epiblast forms an S under the effect of nourishing flows. Appearance of the primitive streak (Hensen's node) and the Notochord."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Aspiration and Invagination",
                "description": "A field of aspiration on the primitive streak draws in epithelial cells (bottle cells) which invaginate to fill the space between the Ectoderm and Endoderm: this is the true birth of the intra-embryonic Mesoderm."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "Ciliary Rotation",
                "description": "At the bottom of Hensen's node, cilia rotate at 60° (nodal flow), pushing signals to the left, determining the future asymmetry of the organs."
            }
        ],
        "themeColor": "bg-red-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Primitive Streak]:::ecto --> B(Aspiration Field):::ecto\n  B --> C[Bottle Cells Invagination]:::meso\n  C --> D(Birth of Mesoderm 3rd Tissue):::meso\n  A --> E[60° Ciliary Rotation]:::global\n  E --> F(Left-Right Asymmetry):::global",
        "practicalIntegration": {
            "fulcrums": "Primitive embryological cranio-sacral axis (Notochord). Tension between two poles: The Zero Point (Fixed Fulcrum, Sphenobasilar Symphysis / SBS) and the Sacrum Point (Mobile Fulcrum, Hensen's Node, vestige at S2/Coccyx).",
            "generalPalpation": "The 'Hola' (powerful downward notochordal growth wave) coupled with the 'Zero Point Rise' (upward telencephalisation and cranial straightening force).",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Rigid, rectilinear directional thrust (notochord) pulling the immobile central cranial pole."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Perceived as a 'loosing field' of suction and aspiration. The cells plunge violently into the primitive pit."
                }
            ],
            "therapistPosture": "The Laser Beam: Hand under the Occiput in contact with the SBS (Still Point), hand under the Sacrum (Sacrum Point / Primitive Streak). No mechanical manipulation: search for silence ('Wu Wei'), the 'Meeting Point' and the dynamic stillness of the SBS.",
            "psychosomatic": "Verdict = The Axis of Health and the Transgenerational. Deviations or blockages freeze ancestral images along the notochord. By reconnecting the mobile point (sacrum) to its fixed reference fulcrum (Zero Point), the therapist perceives the re-establishment of fluctuation and allows the body to disengage from its acquired lesions and reorganise itself."
        }
    },
    {
        "id": "j-21-22",
        "dayLabel": "Days 21 to 22",
        "period": "Beginning of Week 4",
        "title": "Neurulation, Eye and Heart",
        "generalDescription": "The notochord acts as an electrical centre, slowing central growth, with the ectoderm hollowing out into a neural groove. The heart begins to beat.",
        "events": [
            {
                "order": 1,
                "layer": "L'Oeil",
                "movement": "Diencephalic Expansion",
                "description": "In synchronicity with the primitive heartbeats, the brain produces a lateral expansion creating the primary optic vesicle."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Early Cardiogenesis",
                "description": "The heart begins to form (emergence of the primitive aortae and cardinal veins in the apical region). It will start beating on D21/D22."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Notochordal Slowdown]:::global --> B(Neural Groove):::ecto\n  B --> C[Diencephalic Expansion<br/>Future Eyes]:::ecto\n  B ~~~ D\n  D[Apical Mesodermal Zone]:::meso --> E(Primitive Aortae):::meso\n  E --> F[Heartbeats Start D21/D22]:::meso",
        "practicalIntegration": {
            "fulcrums": "Sphenobasilar Synchondrosis (SBS, Still Point), the Insula (cerebral fulcrum hitch point), the Anterior Neuropore, and THE HEART.",
            "generalPalpation": "The 'Brain Tai-Chi'. Perception of a lightning-fast expansion, followed by a first paroxysmal coiling cephalic flexion around the central fixed point of the heart.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Explosiveness, escape, and immense lateral and dorsal volumetric expansion (cephalisation). Sensation of migratory flow of the Neural Crest towards the face and the plexuses."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Rigid tether. The two lateral aortae act as moorings (the tissue struggles to keep up with neural growth). Cardialisation violently pulls the entire system towards the centre."
                }
            ],
            "therapistPosture": "Absolute neutrality ('Meeting point'). Encompassing cranial hold 'like a bowl filled to the brim with water'. Support for the CV4 technique (compression of the fourth ventricle) to rebalance intra- and extra-cranial CSF (Zone B).",
            "psychosomatic": "Verdict = The Informing Heart. The major plication literally deposits the brain, the upper limb buds (the hands), the eyes (optic placodes), and the mouth/voice (branchial arch) **directly onto the beating cardiac tissue**. The psychosomatic aspect is major: one sees, touches, and speaks with the in-formation of one's own heart."
        }
    },
    {
        "id": "j-22-28",
        "dayLabel": "Days 22 to 28",
        "period": "4th Week",
        "title": "The Great Kinetic Cascade",
        "generalDescription": "This is the chronological and mechanical order of plication (flexion) of the embryo, caused by vascular resistance in the face of explosive dorsal neural growth.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Central Cephalisation",
                "description": "The epiblastic ectoderm (future central brain) begins to grow at an explosive rate towards the apical pole."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Cardialisation (Vascular drag)",
                "description": "The vascular mesodermal tissue (aortae) grows much more slowly. Driven by the amniotic cavity and mechanically restrained by this system, the brain rolls forwards. The powerful flexion causes the two separated endocardial tubes to meet, forcing the disappearance of the median tissue through a corrosion field (endocardial fusion)."
            },
            {
                "order": 3,
                "layer": "Le Mésoderme",
                "movement": "Cardiac Looping & Diaphragmatisation",
                "description": "The fused heart no longer has space: it performs a three-dimensional volumetric leap (Looping, the ventricular system tilts under the atria). The continuous growth of the brain literally deposits the head onto the heart, which crushes the upper part of the yolk sac. These compressed mesenchymal cells form the septum transversum (primordium of the diaphragm)."
            },
            {
                "order": 4,
                "layer": "L'Endoderme",
                "movement": "Disassimilation & Hepatisation",
                "description": "The newly formed diaphragm creates a barrier. Below, the powerful torrent of vitelline veins accumulates and congests the mesoderm. Local lengthening creates a posterior suction vacuum (loosing field) at the junction of the intestines. The epithelium of the digestive endoderm is drawn into the congestion and buds/fractalises: this is the birth of the Liver (which first serves to capture the exudate of embryonic waste)."
            },
            {
                "order": 5,
                "layer": "L'Endoderme",
                "movement": "Hepatic Peritoneal Engine",
                "description": "Organised by the fluid, the Liver explodes with massive spatial growth exclusively to the right (without pivoting). This enormous thrust becomes the mechanical engine of the abdomen: it pushes the stomach to the left (imparting a rotation to it) and helps to hollow out the omental bursa."
            },
            {
                "order": 6,
                "layer": "L'Endoderme",
                "movement": "Pneumatisation & Aspiration Dynamics",
                "description": "The straightening of the embryo creates a powerful vacuum (thoracic 'loosing field'). The endodermal epithelium collapses within the mesoderm (invagination), diverges (main bronchi), then performs a spiral rotational tilt at the future pulmonary hilum (top towards the back, bottom towards the front, external rotation)."
            },
            {
                "order": 7,
                "layer": "Le Mésoderme",
                "movement": "Gonadisation / Renalisation",
                "description": "The enormous spatial growth of the liver (coupled with adrenal ascent) forces the genital ridge downwards and determines the Wolffian and Müllerian ducts forming the kidneys and gonads."
            }
        ],
        "themeColor": "bg-orange-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Explosive Ectodermal Cephalization]:::ecto -->|Aortic Drag| B(Cardialization and Fusion):::meso\n  B -->|Looping & Straightening| C{Mass Compression &<br/>Diaphragmatization}:::meso\n  C --> D[Inferior Venous Congestion]:::meso\n  D -->|Loosing Field Aspiration| E(Endodermal Fractalization<br/>Hepatization):::endo\n  E -->|Spatial Right Growth| F[Stomach & Peritoneal Cavity Tilt]:::global\n  C -->|New Loosing Field| G(Pulmonary Pneumatization):::endo\n  F --> H[Thrust on Genital Ridge]:::meso",
        "practicalIntegration": {
            "fulcrums": "The Septum Transversum (future diaphragm/pericardium), the Hepatobiliary Centre of Gravity (Liver), Winslow's Foramen (entrance to the omental bursa), and the Pulmonary Hilum (asymmetrical articulation centre).",
            "generalPalpation": "Cascade palpation. Following the stomach's spiral glide in the peritoneal arch, hepatobiliary congestion, then the lungs' 'air bubble' by following their tilt (external rotation with the top moving posteriorly and the bottom moving anteriorly).",
            "layerPerceptions": [
                {
                    "layer": "L'Endoderme",
                    "perception": "[Thorax/Lung]: Aspiration at the pulmonary level. The therapist perceives 'a balloon of air' with constant partial pressure, a tissue oxidative exchange between the bronchial/air frequency and the surrounding fluid space."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "[Abdomen/Digestive]: Aspiration (suction, loosening digestive field), fractal budding phenomenon that requires a lot of space throughout the abdomen."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Congested and heavily densified vascular mass under the diaphragm that stops its progression (Vitelline veins)."
                }
            ],
            "therapistPosture": "Release by the Void: encompassing the lower ribs for the digestive tract. For the Lung (fulcrum): posterior hand slightly lower than the anterior hand to perfectly follow the inclined axis of the pulmonary aspiration swing.",
            "psychosomatic": "Verdict = Purification and the Unspoken. The naive Liver captures toxicity (unexpressed anger/portal tissue frustration). The Lungs (air bubble) become the reservoir of old, protected sadness, perceptible under the hands as specific densities. The Stomach absorbs the immediate environment through spasm. Releasing this cascade means releasing the chemistry of the hypothalamus."
        }
    },
    {
        "id": "j-28",
        "dayLabel": "Day 28",
        "period": "End of the 1st Month",
        "title": "The Marvellous Synchronicity",
        "generalDescription": "The moment of final global mechanical engagement of the cranio-caudal coiling of the embryo.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Marginal Closure",
                "description": "Complete closure of the neural tube (Posterior Neuropore)."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Peritoneal Integration",
                "description": "At EXACTLY the same time, the external coelom is definitively integrated and closed into the internal coelom (primitive peritoneal cavity)."
            }
        ],
        "themeColor": "bg-yellow-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Terminal Global Coiling]:::global --> B(Posterior Neuropore Closure):::ecto\n  A --> C(Final Integration of External Coelom):::meso"
    },
    {
        "id": "j-45",
        "dayLabel": "From Day 35 to 2 Months",
        "period": "2nd Month",
        "title": "Somites, Ribs and Cranial Vault",
        "generalDescription": "The musculoskeletal organisation densifies around the neural and cardiovascular axis.",
        "events": [
            {
                "order": 1,
                "layer": "Le Mésoderme",
                "movement": "Ribs and Mediastinum",
                "description": "Densification of the mesodermal cells between the vessels to form the ribs, which lengthen and join at D45 (sternal angle of Louis, closure of the mediastinum)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Telencephalisation",
                "description": "The stretching of the dural membranes (brain rising up) forms the early connective tissue vault of the cranium (desmocranium)."
            }
        ],
        "themeColor": "bg-amber-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Midline Ribs Convergence]:::meso --> B(Louis Angle Suture D45):::meso\n  A --> C[Mediastinum Closure]:::meso\n  A ~~~ D\n  D[Axial Straightening]:::global --> E(Dural Tension):::ecto\n  E --> F[Desmocranium Modeling]:::ecto"
    },
    {
        "id": "maturation-12ans",
        "dayLabel": "Up to 12 years old",
        "period": "Post-Natal Maturation",
        "title": "Dentition and Vegetative Maturation",
        "generalDescription": "Embryology continues in the open air. The child's posture and energetics finalise the tissue dynamics.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "External Brain Growth (0-6 months)",
                "description": "The neural volume doubles again in the first 6 months, continuously modulating the reciprocal membranes."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Dental Sensor and Posture (6-10 months)",
                "description": "The first teeth act as a fixed mechanical pivot/fulcrum, allowing the child dynamic straightening of their neuro-vertebral axis."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Maxillary Pneumatisation (3 years)",
                "description": "The maxillary sinuses aerate, the adrenals and the appendix fully engage in their physiology."
            },
            {
                "order": 4,
                "layer": "Global",
                "movement": "Thyroid Activation (7 years)",
                "description": "The thyroid definitively takes over as the radiator of parental warmth (the true thermogenic age of reason)."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Pubertal Activation (10-12 years)",
                "description": "Active pituitary, sphenoidal pneumatisation of the cranial base as a screen to integrate adult hormonal functions."
            }
        ],
        "themeColor": "bg-emerald-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Dentition 6m]:::ecto --> B(Neural Straightening Pivot):::ecto\n  B ~~~ C\n  C[Maxillary Pneumatization 3Y]:::endo --> D(Appendix/Adrenals Engagement):::endo\n  D ~~~ E\n  E[Thyroid Relay 7Y]:::global --> F(Caloric Autonomy):::global\n  F ~~~ G\n  G[Pubertal Pituitary 12Y]:::global --> H(Sphenoidal Pneumatization):::global"
    }
];
