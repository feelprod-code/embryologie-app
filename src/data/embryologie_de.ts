import type { StageDataV2 } from './embryologie';


export const detailedStages: StageDataV2[] = [
    {
        "id": "j-0",
        "dayLabel": "Vor Tag 1",
        "period": "Präkonzeptionelle Phase & Reifung",
        "title": "Polarität, Vorbereitung und Informationen",
        "generalDescription": "Die Eizelle ist nicht neutral. Schon während ihrer Reifung in den Follikeln ist sie in die systemischen Flüssigkeiten der Mutter getaucht und nimmt die biochemische und emotionale Umgebung auf.",
        "events": [
            {
                "order": 1,
                "layer": "N/A",
                "movement": "Reifung & Transgenerationale Prägung",
                "description": "Der Eizellvorrat wird in utero angelegt. Emotionale Schocks und die Qualität der mütterlichen Blutzirkulation prägen diese Zellen bereits. Die Eizelle integriert die Belastungen der Mutter, aber auch der Großmutter."
            },
            {
                "order": 2,
                "layer": "N/A",
                "movement": "Wolpert-Flagge (Konzentration)",
                "description": "Anlage der asymmetrischen Stoffwechselachse. Maternale Proteine und Boten-RNA polarisieren sich und verschieben den Kern zum animalen Pol. Dies ist das Auftreten der kranio-kaudalen Referenzachse, lange vor der Befruchtung."
            },
            {
                "order": 3,
                "layer": "N/A",
                "movement": "Assimilationspol",
                "description": "Trennung zwischen dem Vitellus (Energiereserven) und den morphogenen Gradienten. Das Zytoskelett organisiert sich und versetzt die Eizelle in Spannung für den Empfang."
            }
        ],
        "themeColor": "bg-blue-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ovocyte en Maturation]:::global -->|Empreinte Maternelle| B(Fluides et Sécrétions Folliculaires):::global\n  B --> C[Drapeau de Wolpert]:::global\n  C --> D(Axe Crânio-Caudal Originel):::global\n  D --> E[Pôle Synthétique/Noyau]:::global"
    },
    {
        "id": "j-1",
        "dayLabel": "Tag 1",
        "period": "Befruchtung",
        "title": "Das Treffen & Die Kalziumwelle",
        "generalDescription": "In der Ampulla tubae wird nur ein einziges Spermium eindringen. Dies ist eine energetische Explosion und der absolute Moment der Inkarnation.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Schlüsselerkennung (ZP3)",
                "description": "Die Eizelle „wählt“ aktiv durch enzymatische Erkennung über das ZP3-Protein ihrer Zona pellucida. Eine Nicht-Aufnahme oder ein Kurzschluss dieser Phase (z. B. IVF) erzeugt nicht die natürliche elektrische Narbe von J1."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Elektromagnetischer Schock",
                "description": "Sofort nach dem Eindringen erfolgt eine elektrische Inversion (Blockade der Polyspermie) und eine explosive Freisetzung von Zink. Die Eizelle beendet ihre Meiose."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "Die Massive Kalziumwelle",
                "description": "Totale und blitzartige Reorganisation des Zytoskeletts, diktiert durch eine Flut von Kalzium. Dies ist der Lebensfunke, der die kraniokaudale Achse fixiert (ein Überbleibsel, das später nach S2/Steißbein projiziert und mit dem Herzen verbunden wird)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "Sitz der sensorischen Information",
                "description": "Obwohl das physische Auge nicht existiert, findet die Polarität des zentralen und dienzephalen Nervensystems ihre Grundlage in dem in diesem Moment erzeugten elektrischen Feld."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Fécondation]:::global -->|Reconnaissance ZP3| B(Inversion Électrique):::global\n  B --> C[Libération du Zinc]:::global\n  C --> D{Vague Calcique Explosive}:::global\n  D --> E(Réorganisation Cytosquelette):::global\n  D --> F(Cristallisation de l'Axe Central):::global",
        "practicalIntegration": {
            "fulcrums": "Epigenetischer Ursprung des Herzens: energetisches Überbleibsel der Befruchtung, das bis S2/Steißbein herabsteigt. Die Herz-Steißbein-Achse verbindet das aktuelle Herz mit seiner konzeptionellen Quelle.",
            "generalPalpation": "Diagnose der kardialen Gewebemotilität im Gesichtsbereich: Faziale Systole (Vertikalisierung, Überaktivität, Erschöpfung) vs. Faziale Diastole (Horizontalisierung, Prostration, Suche nach ursprünglicher Energie in Richtung Steißbein).",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Primäre Welle, Fluktuation sehr langer Amplitude, ausgerichtet entlang der ursprünglichen Längsachse."
                }
            ],
            "therapistPosture": "Untere Hand unter dem Becken (S2/Steißbein, ursprünglicher Ort der Achse) und obere Hand auf der Herzachse (Angulus Ludovici). Ziel ist es, das Herzgewebe wieder mit seinem steißbeinigen „Bauplan“ zu verbinden.",
            "psychosomatic": "Verdict = Die Begegnung und die transgenerationale Information. Die Eizelle erkennt den ZP3-Schlüssel. Dies ist der Moment der „ursprünglichen Narbe“. Behandlung durch und mit dem Herzfeld."
        }
    },
    {
        "id": "j-1-4",
        "dayLabel": "Tage 1 bis 4",
        "period": "1. Woche",
        "title": "Radikale Stagnation und Spaltung",
        "generalDescription": "Die Zygote führt eine Kaskade von Multiplikationen durch, indem sie sich zusammenzieht, ohne dass das Gesamtvolumen wächst.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Gefängnis der Zona Pellucida",
                "description": "Das System ist in dieser Hülle eingeschlossen. Die Zygote teilt sich in 2, dann 4, 8 und 16 Zellen (die Morula). Das Fehlen von Wachstumsraum erzeugt einen immensen latenten Energiedruck."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Metabolische Explosion (Oberflächenvergrößerung)",
                "description": "Bei gleichem Volumen vervielfacht sich die Membranoberfläche exponentiell. Diese extreme Membrankonzentration vervielfacht die Zellaktivität und -atmung."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Geburt des Blastozoels (Früher Verdauungsmotor)",
                "description": "Während dieser Druckspaltung stoßen die Zellen ein flüssiges Exsudat (erste Abfallprodukte) aus. Diese Flüssigkeit drängt die Blastomere nach außen (den Trophoblasten) und bildet die Blastozyste. Dieser Hohlraum ist der allererste asymmetrische Ansatz des Verdauungssystems und der Absorption."
            },
            {
                "order": 4,
                "layer": "L'Ectoderme",
                "movement": "Embryonaler Pol und Zentralisierung",
                "description": "Die auf einer Seite massierten Zellen (Embryonalknopf) bereiten insgeheim das Terrain für die berühmte Scheibe vor, die zum Nervensystem und zur Haut werden wird."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Ruptur und Schlüpfen (T4)",
                "description": "Der intra-luminale Flüssigkeitsdruck und die Zellvermehrung machen die Situation unhaltbar. Der Embryo durchbricht die Zona pellucida, um sich daraus zu befreien, bereit, sich an die Mutter anzuheften."
            }
        ],
        "themeColor": "bg-indigo-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Zygote]:::global --> B(Divisions sans Croissance Volumétrique):::global\n  B -->|Augmentation Surface Membranaire| C[Pression Métabolique & Energétique]:::global\n  C -->|Rejet d'Exsudat Liquidien| D(Blastocèle<br/>Apparition Endoderme):::endo\n  D --> E[Concentration du Bouton Embryonnaire]:::ecto\n  E --> F{Éclosion Radicale J4/J5}:::global",
        "practicalIntegration": {
            "fulcrums": "Primitive kraniokaudale Achse und die „Druckhüllen“. Das frühe Blastozöl als Ursprung viszeraler Spannungen.",
            "generalPalpation": "Stoffwechselverdichtung ohne Gewebeexpansion. Wahrnehmung einer behinderten longitudinalen Fluktuation und Suche nach „Entspannung/Entfaltung“ in den tiefen Gewebeschichten.",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Rein membranöse (pelluzide) und autokrine flüssige Arbeit (Druckfelder)."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Dynamik der Flüssigkeitsansammlung und des Flüssigkeitsaustritts (der Beginn der Physiologie der endodermalen Absorption und Elimination)."
                }
            ],
            "therapistPosture": "Asymmetrische Präsenzposition, die globale Hand erfasst das gesamte, noch nicht wahrnehmbare Volumen.",
            "psychosomatic": "Urteil = Das Einschließen, das Warten und die Akkumulation. Dynamik des Zurückhaltens vor der großen „Befreiung“."
        }
    },
    {
        "id": "j-5-8",
        "dayLabel": "Tage 5 bis 8",
        "period": "Ende 1. – Anfang 2. Woche",
        "title": "Das Schlüpfen und die Nidation",
        "generalDescription": "Der Embryo erreicht die Gebärmutter. Gesteuert von seinem assimilativen Pol, setzt er eine Säure frei, um sich in der Gebärmutterschleimhaut einzunisten (Mikroblutungen).",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Nidation und Exsudat",
                "description": "Plötzliche Entstehung der zweiten Höhle durch Flüssigkeitsexsudat: die Amnionhöhle (Vorläufer des Liquors und Beziehung zur Mutter)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Topographische Differenzierung",
                "description": "Der Embryonalknopf teilt sich in die zweiblättrige Keimscheibe. Die oberen Zellen bilden den Epiblasten (zukünftiges Nervensystem)."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Topographische Differenzierung",
                "description": "Die nach unten gerichteten Zellen (zum Blastozele hin) bilden das Hypoblast (zukünftiges direktes Verdauungssystem)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "J7: Primitiver Liquor",
                "description": "Auftreten der Amnionhöhle. Die primitive Amnionflüssigkeit bildet die erste Zerebrospinalflüssigkeit, die das zukünftige Neuralrohr und das Diencephalon (Ursprung des Auges) füllen wird."
            },
            {
                "order": 5,
                "layer": "L'Oeil",
                "movement": "T8: Symbolische Morphologie",
                "description": "Beim Einnisten in die Schleimhaut und mit dem Exsudat, das die Fruchtblase bildet, erinnert die Form der Struktur symbolisch an die eines Auges."
            }
        ],
        "themeColor": "bg-rose-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enfouissement Utérin]:::global --> B(Exsudat Cavité Amniotique):::global\n  A --> C{Séparation Didermique}:::global\n  C --> D[Épiblaste<br/>Ectoderme Primitif]:::ecto\n  C --> E[Hypoblaste<br/>Endoderme Primitif]:::endo",
        "practicalIntegration": {
            "fulcrums": "Die Zone B (Energiefeld um den physischen Körper, Spur der ursprünglichen Amnionhöhle) und der Embryonalstiel.",
            "generalPalpation": "Infusions- und Permeationsbewegung. Integration der Flüssigkeiten von der Peripherie (Mutter) zum Zentrum. Auftreten eines bilateralen Exsudatdrucks.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Ausrichtung nach oben, zur klaren und schützenden Amnionflüssigkeit, dem Vorläufer des Liquor cerebrospinalis."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Orientierung nach unten, Gewebe, das nach Ernährung sucht (Dottersack), unterschiedliche Flüssigkeitsdichte."
                }
            ],
            "therapistPosture": "Lauschen der weiten Hülle (Zone B). Wahrnehmung des flüssigen Raums, der den Körper und die Gebärmutter umgibt.",
            "psychosomatic": "Urteil = Die Inkarnation im Gefäß und die Wärme. Tiefe Bedeutung bei Fehlgeburt oder Nicht-Akzeptanz. Reinigung der Schleimhaut (Freisetzung von pelvinem Gastrin) zur Beruhigung des intrauterinen Nests."
        }
    },
    {
        "id": "j-7-14",
        "dayLabel": "Tage 7 bis 14",
        "period": "2. Woche",
        "title": "Retikulum und äußeres Zölom",
        "generalDescription": "Die Peripherie des Embryos wächst extrem schnell in die mütterliche Schleimhaut hinein, was zu einem relativen Auseinanderreißen mit der langsamer wachsenden zentralen Scheibe führt.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Differenzielles Wachstum",
                "description": "Auftreten der Heuser-Membran und eines faserigen Raums, der mit dem unter Spannung stehenden extraembryonalen Retikulum ausgefüllt ist."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Schaffung der 3. Kammer",
                "description": "Das Arachnoidalnetzwerk gibt unter Zug nach und bildet das ausgedehnte Exsudat des äußeren Zöloms. Die ehemalige Blastozöl wird zum primären Dottersack."
            }
        ],
        "themeColor": "bg-pink-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Croissance Périphérique Différentielle]:::global --> B(Traction Arachnoïdienne):::meso\n  B --> C[Déchirement du Réticulum]:::meso\n  C --> D(Création Cœlome Externe<br/>Mésoderme Extra-Embryonnaire):::meso"
    },
    {
        "id": "j-14-21",
        "dayLabel": "Tage 14 bis 21",
        "period": "3. Woche",
        "title": "Gastrulation und Lateralität",
        "generalDescription": "Bildung des embryonalen Stiels, der die trophische Versorgung in einem einzigen Fluss bündelt. Der Embryo nimmt eine S-Form an.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Vaginale Notochorda",
                "description": "Der Epiblast bildet unter dem Einfluss der nährenden Flüsse ein S. Auftreten des Primitivstreifens (Hensen-Knoten) und der Chorda dorsalis."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Aspiration und Invagination",
                "description": "Ein Aspirationsfeld auf der Primitivrinne saugt Epithelzellen (Flaschenzellen) an, die sich invaginieren, um den Raum zwischen Ekto- und Endoderm zu füllen: Dies ist die eigentliche Geburt des intraembryonalen Mesoderms."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "Ziliäre Rotation",
                "description": "Am Grunde des Hensen-Knotens drehen sich Zilien um 60° (nodaler Fluss) und senden Signale nach links, die die zukünftige Asymmetrie der Organe bestimmen."
            }
        ],
        "themeColor": "bg-red-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ligne Primitive]:::ecto --> B(Champ d'Aspiration):::ecto\n  B --> C[Invagination Bottle Cells]:::meso\n  C --> D(Naissance du Mésoderme 3ème Tissu):::meso\n  A --> E[Rotation Ciliaire 60°]:::global\n  E --> F(Asymétrie Gauche-Droite):::global",
        "practicalIntegration": {
            "fulcrums": "Primitiver embryologischer kraniosakraler Achse (Notochord). Spannung zwischen zwei Polen: Der Nullpunkt (Fixer Fulcrum, Sphenobasiläre Synchondrose / SBS) und der Sakrumpunkt (Mobiler Fulcrum, Hensen-Knoten, Überrest bei S2/Steißbein).",
            "generalPalpation": "Die „Hola“ (mächtige absteigende Welle des Notochordwachstums) gekoppelt mit dem „Aufstieg des Nullpunkts“ (aufsteigende Telencephalon-Kraft und Aufrichtung des Schädels).",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Geradliniger und starrer gerichteter Schub (Chorda dorsalis), der den unbeweglichen kranialen Mittelpol zieht."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Wird als Saug- und Ansaugfeld („loosing field“) wahrgenommen. Die Zellen tauchen heftig in die Primitivgrube ein."
                }
            ],
            "therapistPosture": "Der Laserstrahl: Hand unter dem Hinterhauptbein in Kontakt mit der SSB (Nullpunkt), Hand unter dem Kreuzbein (Kreuzbeinpunkt / Primitive Linie). Keine mechanische Manipulation: Suche nach Stille ('Wu Wei'), dem 'Meeting Point' und der dynamischen Immobilität der SSB.",
            "psychosomatic": "Urteil = Die Gesundheitsachse und das Transgenerationale. Abweichungen oder Blockaden frieren die Ahnenbilder entlang der Chorda dorsalis ein. Indem der Therapeut den mobilen Punkt (Kreuzbein) wieder mit seinem festen Referenz-Fulcrum (Nullpunkt) verbindet, nimmt er die Wiederaufnahme der Fluktuation wahr und ermöglicht es dem Körper, sich von seinen erworbenen Läsionen zu lösen und sich neu zu organisieren."
        }
    },
    {
        "id": "j-21-22",
        "dayLabel": "Tage 21 bis 22",
        "period": "Beginn 4. Woche",
        "title": "Neurulation, Auge und Herz",
        "generalDescription": "Die Chorda dorsalis fungiert als elektrisches Zentrum, das das zentrale Wachstum verlangsamt, wobei sich das Ektoderm zu einer Neuralrinne vertieft. Das Herz beginnt zu schlagen.",
        "events": [
            {
                "order": 1,
                "layer": "L'Oeil",
                "movement": "Dienzephale Expansion",
                "description": "In Synchronizität mit den ursprünglichen Herzschlägen produziert das Gehirn eine laterale Expansion, die die primäre Augenblase bildet."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Frühe Kardiogenese",
                "description": "Das Herz beginnt sich zu bilden (Auftreten der primitiven Aorten und Kardinalvenen im apikalen Bereich). Es wird am Tag 21/22 zu schlagen beginnen."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": [
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ralentissement Notochordal]:::global --> B(Gouttière Neurale):::ecto\n  B --> C[Expansion Diencéphalique<br/>Futurs Yeux]:::ecto",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  D[Zone Apicale Mésodermique]:::meso --> E(Aortes Primitives):::meso\n  E --> F[Début Battements J21/J22]:::meso"
        ],
        "practicalIntegration": {
            "fulcrums": "Sphenobasiläre Synchondrose (SBS, Nullpunkt), die Insel (Hitch Point der zerebralen Kippung), der anteriore Neuroporus und DAS HERZ.",
            "generalPalpation": "Das „Tai-Chi des Gehirns“. Wahrnehmung einer blitzartigen Expansion, gefolgt von einer ersten paroxysmalen zirkulären Kopfflexion um den zentralen Fixpunkt des Herzens.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Explosivität, Flucht und immense laterale und dorsale Volumenausdehnung (Kephalisation). Gefühl eines migratorischen Fließens der Neuralleiste in Richtung Gesicht und Plexus."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Starrer Zügel. Die beiden lateralen Aorten wirken wie Verankerungen (das Gewebe hat Schwierigkeiten, dem neuronalen Wachstum zu folgen). Die Kardialisierung zieht das gesamte System gewaltsam zur Mitte."
                }
            ],
            "therapistPosture": "Absolute Neutralität ('Meeting Point'). Umfassender Schädelgriff 'wie eine randvolle Wasserschale'. Begleitung der CV4-Technik (Kompression des 4. Ventrikels) zum Ausgleich der intra- und extrakraniellen Liquorflüssigkeit (Zone B).",
            "psychosomatic": "Verdict = Das informierende Herz. Die große Faltung legt das Gehirn, die Anlage der oberen Gliedmaßen (die Hände), die Augen (optische Plakoden) und den Mund/die Stimme (Kiemenbogen) **direkt auf das schlagende Herzgewebe**. Die Psychosomatik ist entscheidend: Man schaut, berührt und spricht mit der In-formation des eigenen Herzens."
        }
    },
    {
        "id": "j-22-28",
        "dayLabel": "Tage 22 bis 28",
        "period": "4. Woche",
        "title": "Die Große Kinetische Kaskade",
        "generalDescription": "Dies ist die chronologische und mechanische Reihenfolge der Plicatur (Biegung) des Embryos, verursacht durch den vaskulären Widerstand angesichts des explosiven dorsalen neuronalen Wachstums.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Zentrale Kephalisation",
                "description": "Das epiblastische Ektoderm (zukünftiges Zentralgehirn) beginnt mit explosiver Geschwindigkeit zum apikalen Pol hin zu wachsen."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Kardialisierung (Vaskuläre Bremse)",
                "description": "Das vaskuläre mesodermale Gewebe (Aorten) wächst viel langsamer. Angetrieben von der Amnionhöhle und mechanisch durch dieses System gebremst, rollt sich das Gehirn nach vorne ein. Die starke Beugung führt dazu, dass die beiden auseinanderliegenden Endokardschläuche aufeinandertreffen, was das Verschwinden des mittleren Gewebes durch ein Korrosionsfeld (Endokardfusion) erzwingt."
            },
            {
                "order": 3,
                "layer": "Le Mésoderme",
                "movement": "Herzschleifenbildung & Zwerchfellbildung",
                "description": "Das verschmolzene Herz hat keinen Raum mehr: Es vollzieht einen dreidimensionalen Volumensprung (Looping, das ventrikuläre System kippt unter die Vorhöfe). Das kontinuierliche Wachstum des Gehirns legt den Kopf buchstäblich auf das Herz, das den oberen Teil des Dottersacks zerdrückt. Diese komprimierten mesenchymalen Zellen bilden das Septum transversum (Anlage des Zwerchfells)."
            },
            {
                "order": 4,
                "layer": "L'Endoderme",
                "movement": "Desassimilation & Hepatisation",
                "description": "Das gerade erst entstandene Zwerchfell bildet eine Barriere. Darunter staut sich der mächtige Strom der Dottervenen und überlastet das Mesoderm. Die lokale Verlängerung erzeugt ein posteriores Saugvakuum (Loosing Field) an der Darmkreuzung. Das Epithel des Verdauungsendoderms wird in die Stauung gesaugt und knospt/fraktalisiert: Dies ist die Geburt der Leber (die zunächst dazu dient, das Exsudat der embryonalen Abfälle aufzunehmen)."
            },
            {
                "order": 5,
                "layer": "L'Endoderme",
                "movement": "Hepatisch-Peritonealer Motor",
                "description": "Organisiert durch den Fluss, explodiert die Leber in einem massiven räumlichen Wachstum ausschließlich nach rechts (ohne zu rotieren). Dieser enorme Schub wird zum mechanischen Motor des Abdomens: Er drängt den Magen nach links (wodurch dieser rotiert) und hilft, die hintere Höhle der Omenta auszuhöhlen."
            },
            {
                "order": 6,
                "layer": "L'Endoderme",
                "movement": "Pneumatisation & Aspirationsdynamik",
                "description": "Die Aufrichtung des Embryos erzeugt ein starkes Vakuum (thorakales „Loosing Field“). Das endodermale Epithel stülpt sich in das Mesoderm ein (Invagination), verzweigt sich (Hauptbronchien) und führt dann eine spiralförmige Rotationsschwingung im Bereich des zukünftigen Lungenhilus aus (oben nach hinten, unten nach vorne, Außenrotation)."
            },
            {
                "order": 7,
                "layer": "Le Mésoderme",
                "movement": "Gonadisierung / Renalisierung",
                "description": "Das enorme räumliche Wachstum der Leber (gekoppelt mit dem Aufstieg der Nebenniere) drängt die Genitalleiste nach unten und bestimmt die Wolffschen und Müllerschen Gänge, die Nieren und Gonaden bilden."
            }
        ],
        "themeColor": "bg-orange-900",
        "mermaidCode": [
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Explosive Ektodermale Kephalisation]:::ecto -->|Aortenbremse| B(Kardialisierung und Verschmelzung):::meso\n  B -->|Looping und Aufrichtung| C{Massenkompression und<br/>Zwerchfellbildung}:::meso\n  C --> D[Untere Venöse Stauung]:::meso",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  D[Untere Venöse Stauung]:::meso -->|Saugwirkung Loosing Field| E(Endodermale Fraktalisierung<br/>Hepatisation):::endo\n  E -->|Rechtes Räumliches Wachstum| F[Kippen von Magen und Bauchhöhle]:::global\n  C{Massenkompression und<br/>Zwerchfellbildung}:::meso -->|Neues Loosing Field| G(Lungenpneumatisation):::endo\n  F --> H[Schub auf die Genitalleiste]:::meso"
        ],
        "practicalIntegration": {
            "fulcrums": "Das Septum Transversum (zukünftiges Zwerchfell/Perikard), das hepatobiliäre Gravitationszentrum (Leber), der Hiatus Winslowi (Eingang zur Bursa omentalis) und der Lungenhilus (asymmetrisches Artikulationszentrum).",
            "generalPalpation": "Kaskadenpalpation. Verfolgung des spiralförmigen Gleitens des Magens im Peritonealband, der hepatobiliären Stauung, dann der „Luftblase“ der Lungen, indem man deren Kippen (Außenrotation mit oben nach hinten und unten nach vorne) verfolgt.",
            "layerPerceptions": [
                {
                    "layer": "L'Endoderme",
                    "perception": "[Thorax/Lunge]: Die Aspiration auf pulmonaler Ebene. Der Therapeut nimmt einen „Luftballon“ mit konstantem Partialdruck wahr, einen oxidativen Gewebeaustausch zwischen der bronchialen/luftgefüllten Frequenz und dem umgebenden Flüssigkeitsraum."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "[Abdomen/Verdauung]: Aspiration (Saugen, Lösen des Verdauungsfeldes), fraktales Knospungsphänomen, das dem gesamten Abdomen enorm viel Raum abverlangt."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Vaskuläre Masse, gestaut und stark verdichtet unter dem Zwerchfell, die ihre Progression stoppt (Dottersackvenen)."
                }
            ],
            "therapistPosture": "Freisetzung durch die Leere: Umfassen der unteren Rippen für den Verdauungstrakt. Für die Lunge (Fulcrum): Die hintere Hand ist etwas tiefer als die vordere Hand, um die geneigte Achse der pulmonalen Saugbewegung perfekt zu verfolgen.",
            "psychosomatic": "Verdict = Die Reinigung und das Ungesagte. Die naive Leber fängt die Toxizität ein (unausgedrückte Wut/portale Gewebefrustration). Die Lungen (Luftblase) werden zum Reservoir einer alten, geschützten Traurigkeit, die unter den Händen durch spezifische Dichten wahrnehmbar ist. Der Magen absorbiert die unmittelbare Umgebung durch Spasmen. Diese Kaskade zu befreien bedeutet, die Chemie des Hypothalamus zu befreien."
        }
    },
    {
        "id": "j-28",
        "dayLabel": "Tag 28",
        "period": "Ende des 1. Monats",
        "title": "Die Wunderbare Synchronizität",
        "generalDescription": "Der Zeitpunkt des endgültigen globalen mechanischen Einrastens der kraniokaudalen Einrollung des Embryos.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Marginaler Verschluss",
                "description": "Vollständiger Verschluss des Neuralrohrs (hinterer Neuroporus)."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Peritoneale Integration",
                "description": "GENAU zur gleichen Zeit wird das äußere Zölom endgültig in das innere Zölom (primitive Peritonealhöhle) integriert und geschlossen."
            }
        ],
        "themeColor": "bg-yellow-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enroulement Global Terminal]:::global --> B(Fermeture du Neuropore Postérieur):::ecto\n  A --> C(Intégration Finale du Cœlome Externe):::meso"
    },
    {
        "id": "j-45",
        "dayLabel": "Von Tag 35 bis 2 Monate",
        "period": "2. Monat",
        "title": "Somiten, Rippen und Schädeldach",
        "generalDescription": "Die muskuloskelettale Organisation verdichtet sich um die Nerven- und Herz-Kreislauf-Achse.",
        "events": [
            {
                "order": 1,
                "layer": "Le Mésoderme",
                "movement": "Rippen und Mediastinum",
                "description": "Verdichtung der mesodermalen Zellen zwischen den Gefäßen zur Bildung der Rippen, die sich verlängern und am Tag 45 (Angulus sterni von Louis, Verschluss des Mediastinums) vereinigen."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Telencephalisation",
                "description": "Die Dehnung der Dura mater (Gehirn, das sich aufrichtet) bildet das frühe konjunktive Schädeldach (Desmocranium)."
            }
        ],
        "themeColor": "bg-amber-900",
        "mermaidCode": [
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Rapprochement Côtes Mi-ligne]:::meso --> B(Suture de l'Angle de Louis J45):::meso\n  A --> C[Fermeture du Médiastin]:::meso",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  D[Redressement Axial]:::global --> E(Tension Dure-Mérienne):::ecto\n  E --> F[Modélisation du Desmocrâne]:::ecto"
        ]
    },
    {
        "id": "maturation-12ans",
        "dayLabel": "Bis 12 Jahre",
        "period": "Postnatale Reifung",
        "title": "Zahnen und Vegetative Reifung",
        "generalDescription": "Die Embryologie setzt sich im Freien fort. Die Haltung und die Energetik des Kindes vollenden die Gewebedynamik.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Äußeres Gehirnwachstum (0-6 Monate)",
                "description": "Das neurale Volumen verdoppelt sich in den ersten 6 Monaten nochmals und moduliert kontinuierlich die reziproken Membranen."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Zahnsensor und Haltung (6-10 Monate)",
                "description": "Die ersten Zähne fungieren als fester mechanischer Dreh- und Angelpunkt, der dem Kind die dynamische Aufrichtung seiner neuro-vertebralen Achse ermöglicht."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Pneumatisierung des Oberkiefers (3 Jahre)",
                "description": "Die Kieferhöhlen belüften sich, die Nebennieren und der Appendix nehmen ihre Physiologie voll auf."
            },
            {
                "order": 4,
                "layer": "Global",
                "movement": "Schilddrüsenaktivierung (7 Jahre)",
                "description": "Die Schilddrüse übernimmt endgültig die Rolle des Heizkörpers der elterlichen Wärme (wahres Alter der thermogenetischen Vernunft)."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Pubertäre Aktivierung (10-12 Jahre)",
                "description": "Aktive Hypophyse, Keilbeinhöhlenbildung der Schädelbasis als Schutzschirm zur Integration der adulten Hormonfunktionen."
            }
        ],
        "themeColor": "bg-emerald-900",
        "mermaidCode": [
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Dentition 6m]:::ecto --> B(Pivot de Redressement Neural):::ecto",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  C[Pneumatisation Maxillaire 3A]:::endo --> D(Engagement Appendice/Surrénales):::endo",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  E[Relais Thyroïdien 7A]:::global --> F(Autonomie Calorique):::global",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  G[Hypophyse Pubertaire 12A]:::global --> H(Pneumatisation Sphénoïdale):::global"
        ]
    }
];
