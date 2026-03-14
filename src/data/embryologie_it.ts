import type { StageDataV2 } from './embryologie';


export const detailedStages: StageDataV2[] = [
    {
        "id": "j-0",
        "dayLabel": "Prima del Giorno 1",
        "period": "Periodo Pre-concezionale & Maturazione",
        "title": "Polarità, Preparazione e Informazioni",
        "generalDescription": "L'ovocita non è neutro. Fin dalla sua maturazione nei follicoli, è immerso nei fluidi sistemici della madre, impregnandosi dell'ambiente biochimico ed emotivo.",
        "events": [
            {
                "order": 1,
                "layer": "N/A",
                "movement": "Maturazione e Impronta Transgenerazionale",
                "description": "La riserva di ovociti si forma in utero. Gli shock emotivi e la qualità della circolazione sanguigna materna impregnano già queste cellule. L'ovocita integra gli stress della madre ma anche della nonna."
            },
            {
                "order": 2,
                "layer": "N/A",
                "movement": "Bandiera di Wolpert (Concentrazione)",
                "description": "Instaurazione dell'asse metabolico asimmetrico. Le proteine e l'RNA messaggero materni si polarizzano, spostando il nucleo verso il polo animale. Questa è la comparsa dell'asse cranio-caudale di riferimento, ben prima della fecondazione."
            },
            {
                "order": 3,
                "layer": "N/A",
                "movement": "Polo Assimilatore",
                "description": "Segregazione tra il vitello (riserve energetiche) e i gradienti morfogenetici. Il citoscheletro si organizza e mette l'ovocita sotto tensione per la ricezione."
            }
        ],
        "themeColor": "bg-blue-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ovocita in Maturazione]:::global -->|Impronta Materna| B(Fluidi e Secrezioni Follicolari):::global\n  B --> C[Bandiera di Wolpert]:::global\n  C --> D(Asse Cranio-Caudale Originale):::global\n  D --> E[Polo Sintetico/Nucleo]:::global"
    },
    {
        "id": "j-1",
        "dayLabel": "Giorno 1",
        "period": "Fecondazione",
        "title": "L'Incontro & L'Onda Calcica",
        "generalDescription": "Nell'ampolla tubarica, un solo spermatozoo penetrerà. È un'esplosione energetica e il momento assoluto dell'incarnazione.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Riconoscimento della Chiave (ZP3)",
                "description": "L'ovocita 'sceglie' attivamente tramite riconoscimento enzimatico attraverso la proteina ZP3 della sua zona pellucida. Una mancata accoglienza o un cortocircuito di questa fase (es. FIV) non crea la cicatrice elettrica naturale del G1."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Shock Elettromagnetico",
                "description": "All'ingresso, immediata inversione elettrica (blocco della polispermia) e rilascio esplosivo di zinco. L'ovocita completa la sua meiosi."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "L'Onda Calcica Massiva",
                "description": "Riorganizzazione totale e fulminante del citoscheletro dettata da un'ondata di calcio. È la scintilla di vita che fissa l'asse cranio-caudale (vestigio proiettato più tardi verso S2/Coccige, e collegato al Cuore)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "Sede dell'Informazione Sensoriale",
                "description": "Sebbene l'occhio fisico non esista, la polarità del sistema nervoso centrale e diencefalico trova il suo fondamento nel campo elettrico prodotto in quell'istante."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Fecondazione]:::global -->|Riconoscimento ZP3| B(Inversione Elettrica):::global\n  B --> C[Rilascio di Zinco]:::global\n  C --> D{Onda di Calcio Esplosiva}:::global\n  D --> E(Riorganizzazione del Citoscheletro):::global\n  D --> F(Cristallizzazione dell'Asse Centrale):::global",
        "practicalIntegration": {
            "fulcrums": "Origine Epigenetica del Cuore: vestigia energetica della fecondazione che discende fino a S2/Coccige. L'asse Cuore-Coccige collega il cuore attuale alla sua sorgente concezionale.",
            "generalPalpation": "Diagnosi di motilità tissutale cardiaca nello spazio fasciale: Sistole fasciale (verticalizzazione, sovra-azione, esaurimento) vs Diastole fasciale (orizzontalizzazione, prostrazione, ricerca di energia originaria verso il coccige).",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Onda primitiva, fluttuazione di ampiezza molto lunga orientata lungo l'asse longitudinale originale."
                }
            ],
            "therapistPosture": "Mano inferiore sotto il bacino (S2/Coccige, luogo originale dell'asse) e mano superiore sull'asse del Cuore (angolo di Louis). Lo scopo è ricollegare il tessuto cardiaco al suo \"blueprint\" coccigeo.",
            "psychosomatic": "Verdetto = L'Incontro e l'Informazione Transgenerazionale. L'ovocita riconosce la chiave ZP3. È il momento della \"cicatrice originale\". Trattamento attraverso e con il campo del cuore."
        }
    },
    {
        "id": "j-1-4",
        "dayLabel": "Giorni da 1 a 4",
        "period": "1a Settimana",
        "title": "Stagnazione Radicale e Scissione",
        "generalDescription": "Lo zigote effettua una cascata di moltiplicazioni serrandosi, senza alcuna crescita del volume totale.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Prigione della Zona Pellucida",
                "description": "Il sistema è racchiuso in questo guscio. Lo zigote si divide in 2, poi 4, 8 e 16 cellule (la Morula). L'assenza di spazio di crescita genera un'immensa pressione energetica latente."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Esplosione Metabolica (Aumento delle Superfici)",
                "description": "A parità di volume, la superficie della membrana si moltiplica esponenzialmente. Questa estrema concentrazione di membrana moltiplica l'attività e la respirazione cellulare."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Nascita del Blastocele (Motore Digestivo Precoce)",
                "description": "Durante questa scissione sotto pressione, le cellule rilasciano un essudato liquido (i primi scarti). Questo fluido spinge i blastomeri verso l'esterno (il trofoblasto) e forma il blastocele. Questa cavità è il primissimo inizio asimmetrico del sistema digestivo e dell'assorbimento."
            },
            {
                "order": 4,
                "layer": "L'Ectoderme",
                "movement": "Polo Embrionale e Centralizzazione",
                "description": "Le gruppo di cellule da un lato (Bottone Embrionale) prepara segretamente il terreno per il famoso disco che diventerà il sistema nervoso e la pelle."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Rottura e Schiusa (G4)",
                "description": "La pressione intraluminale del fluido e la moltiplicazione rendono la situazione insostenibile. L'embrione rompe la zona pellucida per estrarne, pronto ad ancorarsi alla madre."
            }
        ],
        "themeColor": "bg-indigo-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Zigote]:::global --> B(Divisioni senza Crescita Volumetrica):::global\n  B -->|Aumento Superficie Membranosa| C[Pressione Metabolica ed Energetica]:::global\n  C -->|Rilascio di Essudato Liquido| D(Blastoceli<br/>Comparsa dell'Endoderma):::endo\n  D --> E[Concentrazione del Bottone Embrionale]:::ecto\n  E --> F{Schiusa Radicale G4/G5}:::global",
        "practicalIntegration": {
            "fulcrums": "Asse cranio-caudale primitiva e gli \"involucri di pressione\". Il Blastocele precoce come origine delle tensioni viscerali.",
            "generalPalpation": "Densificazione metabolica senza espansione dei tessuti. Percezione di una fluttuazione longitudinale ostacolata e ricerca di \"rilascio/schiusura\" a livelli tissutali profondi.",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Lavoro puramente membranoso (pellucido) e liquido autocrino (campi di pressione)."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Dinamica di accumulo e versamento liquido (l'inizio della fisiologia di assorbimento ed eliminazione endodermica)."
                }
            ],
            "therapistPosture": "Posizione di presenza asimmetrica, mano globale che capta l'intero volume ancora indistinguibile.",
            "psychosomatic": "Verdetto = Il confinamento, l'attesa e l'accumulo. Dinamica di contenimento prima della grande \"liberazione\"."
        }
    },
    {
        "id": "j-5-8",
        "dayLabel": "Giorni da 5 a 8",
        "period": "Fine 1a - Inizio 2a Settimana",
        "title": "L'Eclosione e l'Annidamento",
        "generalDescription": "L'embrione arriva nell'utero. Guidato dal suo polo assimilatore, rilascia un acido per annidarsi nella mucosa uterina (micro-sanguinamenti).",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Nidazione ed Essudato",
                "description": "Creazione improvvisa per essudato liquido della seconda cavità: la cavità amniotica (precursore del liquor cerebrospinale e relazione con la madre)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Differenziazione Topografica",
                "description": "Il bottone embrionale si separa in disco didermico. Le cellule superiori formano l'Epiblasto (futuro sistema nervoso)."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Differenziazione Topografica",
                "description": "Le cellule rivolte verso il basso (verso il blastocele) formano l'Ipoblasto (futuro sistema digerente diretto)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "G7: LCR Primitivo",
                "description": "Comparsa della cavità amniotica. Il liquido amniotico primitivo formerà il primo liquido cerebrospinale che riempirà il futuro tubo neurale e il diencefalo (origine dell'occhio)."
            },
            {
                "order": 5,
                "layer": "L'Oeil",
                "movement": "J8: Morfologia Simbolica",
                "description": "Quando si annida nella mucosa e con l'essudato che crea la sacca amniotica, la forma della struttura evoca simbolicamente quella di un occhio."
            }
        ],
        "themeColor": "bg-rose-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Annidamento Uterino]:::global --> B(Essudato della Cavità Amniotica):::global\n  A --> C{Separazione Didermica}:::global\n  C --> D[Epiblasto<br/>Ectoderma Primitivo]:::ecto\n  C --> E[Ipoblasto<br/>Endoderma Primitivo]:::endo",
        "practicalIntegration": {
            "fulcrums": "La Zona B (campo energetico attorno al corpo fisico, traccia della cavità amniotica originale) e il peduncolo embrionale.",
            "generalPalpation": "Movimento di infusione e permeazione. Integrazione dei fluidi dalla periferia (madre) verso il centro. Comparsa di una pressione bilaterale dell'essudato.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Orientamento verso l'alto, verso il fluido amniotico chiaro e protettivo, precursore del liquor."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Orientamento verso il basso, tessuto che cerca nutrimento (sacco vitellino), diversa densità del fluido."
                }
            ],
            "therapistPosture": "Ascolto dell'involucro ampio (Zona B). Percezione dello spazio liquido che circonda il corpo e l'utero.",
            "psychosomatic": "Verdetto = L'incarnazione nel ricettacolo e il calore. Profonda posta in gioco in caso di aborto spontaneo o non accoglienza. Pulizia della mucosa (rilascio di gastrina pelvica) per placare il nido intrauterino."
        }
    },
    {
        "id": "j-7-14",
        "dayLabel": "Giorni da 7 a 14",
        "period": "Seconda Settimana",
        "title": "Reticolo e Celoma Esterno",
        "generalDescription": "La periferia dell'embrione cresce estremamente velocemente nella mucosa materna, provocando una relativa lacerazione con il disco centrale che cresce più lentamente.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Crescita Differenziale",
                "description": "Apparizione della membrana di Heuser e di uno spazio fibroso riempito dal reticolo extraembrionale in tensione."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Creazione della 3a Camera",
                "description": "La rete aracnoidea cede sotto la trazione, creando il vasto essudato del Celoma esterno. L'antica blastocisti diventa la vescicola vitellina primaria."
            }
        ],
        "themeColor": "bg-pink-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Crescita Periferica Differenziale]:::global --> B(Trazione Aracnoidea):::meso\n  B --> C[Lacerazione del Reticolo]:::meso\n  C --> D(Creazione Celoma Esterno<br/>Mesoderma Extra-Embrionale):::meso"
    },
    {
        "id": "j-14-21",
        "dayLabel": "Giorni da 14 a 21",
        "period": "Terza Settimana",
        "title": "Gastrulazione e Lateralità",
        "generalDescription": "Formazione del peduncolo embrionale che focalizza l'apporto trofico in un unico flusso. L'embrione assume una forma a S.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Vago Notochordale",
                "description": "L'epiblasto forma una S sotto l'effetto dei flussi nutritivi. Apparizione della linea primitiva (nodo di Hensen) e della notocorda."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Aspirazione e Invaginazione",
                "description": "Un campo di aspirazione sulla linea primitiva aspira le cellule epiteliali (bottle cells) che si invaginano per riempire lo spazio tra Ecto ed Endo: questa è la nascita propria del Mesoderma intra-embrionale."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "Rotazione Ciliare",
                "description": "In fondo al nodo di Hensen, delle ciglia ruotano a 60° (flusso nodale) spingendo dei segnali a sinistra, determinando la futura asimmetria degli organi."
            }
        ],
        "themeColor": "bg-red-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Linea Primitiva]:::ecto --> B(Campo di Aspirazione):::ecto\n  B --> C[Invaginazione Bottle Cells]:::meso\n  C --> D(Nascita del Mesoderma 3° Tessuto):::meso\n  A --> E[Rotazione Ciliare a 60°]:::global\n  E --> F(Asimmetria Sinistra-Destra):::global",
        "practicalIntegration": {
            "fulcrums": "Asse cranio-sacrale embriologico primitivo (Notocorda). Tensione tra due poli: Il Punto Zero (Fulcro fisso, Sinfisi Sfeno-Basilare / SSB) e il Punto Sacro (Fulcro mobile, Nodo di Hensen, vestigio a S2/Coccige).",
            "generalPalpation": "La \"Hola\" (potente onda di crescita notocordale discendente) accoppiata alla \"Salita del punto zero\" (forza di telencefalizzazione ascendente e di raddrizzamento del cranio).",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Spinta direzionale rettilinea e rigida (notocorda) che trascina il polo centrale cranico immobile."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Percepito come un campo di suzione e aspirazione (\"loosing field\"). Le cellule si immergono violentemente nella fossa primitiva."
                }
            ],
            "therapistPosture": "Il Raggio Laser: Mano sotto l'Occipite a contatto con la SSB (Punto Zero), mano sotto il Sacro (Punto Sacro / Linea primitiva). Nessuna manipolazione meccanica: ricerca del silenzio ('Wu Wei'), del 'Meeting Point' e dell'immobilità dinamica della SSB.",
            "psychosomatic": "Verdetto = L'Asse della Salute e il Transgenerazionale. Le deviazioni o i blocchi congelano le immagini ancestrali lungo la notocorda. Riconnettendo il punto mobile (sacro) al suo fulcro fisso di riferimento (Punto Zero), il terapeuta percepisce la ripresa della fluttuazione e permette al corpo di disimpegnarsi dalle lesioni acquisite e di riorganizzarsi."
        }
    },
    {
        "id": "j-21-22",
        "dayLabel": "Giorni 21-22",
        "period": "Inizio 4a Settimana",
        "title": "Neurulazione, Occhio e Cuore",
        "generalDescription": "La notocorda agisce come centro elettrico rallentando la crescita centrale, l'ectoderma si scava in doccia neurale. Il cuore inizia a battere.",
        "events": [
            {
                "order": 1,
                "layer": "L'Oeil",
                "movement": "Espansione Diencefalica",
                "description": "In sincronia con i battiti cardiaci primitivi, il cervello produce un'espansione laterale creando la vescicola ottica primaria."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Cardiogenesi Precoce",
                "description": "Il cuore inizia a formarsi (emergenza delle aorte primitive e delle vene cardinali nella zona apicale). Inizierà a battere al G21/G22."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Rallentamento Notochordale]:::global --> B(Doccia Neurale):::ecto\n  B --> C[Espansione Diencefalica<br/>Futuri Occhi]:::ecto\n  B ~~~ D\n  D[Zona Apicale Mesodermica]:::meso --> E(Aorte Primitive):::meso\n  E --> F[Inizio Battiti G21/G22]:::meso",
        "practicalIntegration": {
            "fulcrums": "Sinfisi Sfeno-Basilare (SSB, Punto Zero), l'Insula (punto di aggancio della bascula cerebrale), il Neuroporo Anteriore, e IL CUORE.",
            "generalPalpation": "Il \"Tai-Chi del Cervello\". Percezione di un'espansione fulminea, seguita da una prima flessione cefalica di avvolgimento parossistico sul punto fisso centrale del cuore.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Esplosività, fuga e immensa espansione volumetrica laterale e dorsale (cefalizzazione). Sensazione di scorrimento migratorio della Cresta Neurale verso il viso e i plessi."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Freno rigido. Le due aorte laterali agiscono come ormeggi (il tessuto ha difficoltà a seguire la crescita neurale). La cardializzazione trascina violentemente l'intero sistema verso il centro."
                }
            ],
            "therapistPosture": "Neutralità assoluta (\"Meeting point\"). Presa craniale avvolgente \"come una ciotola d'acqua riempita fino all'orlo\". Accompagnamento della tecnica CV4 (compressione del 4° ventricolo) per riequilibrare il LCR intra ed extra cranico (Zona B).",
            "psychosomatic": "Verdetto = Il Cuore Informatore. La grande plicatura deposita letteralmente il cervello, l'abbozzo degli arti superiori (le mani), gli occhi (placodi ottici) e la bocca/voce (arco branchiale) **direttamente sul tessuto cardiaco pulsante**. La psicosomatica è fondamentale: si guarda, si tocca e si parla con l'in-formazione del proprio cuore."
        }
    },
    {
        "id": "j-22-28",
        "dayLabel": "Giorni da 22 a 28",
        "period": "Quarta Settimana",
        "title": "La Grande Cascata Cinetica",
        "generalDescription": "Questo è l'ordine cronologico e meccanico di plicatura (flessione) dell'embrione, causato dalla resistenza vascolare di fronte all'esplosiva crescita neurale dorsale.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Cefalizzazione Centrale",
                "description": "L'ectoderma epiblastico (futuro cervello centrale) inizia a crescere a una velocità esplosiva verso il polo apicale."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Cardializzazione (Freno vascolare)",
                "description": "Il tessuto mesodermico vascolare (aorte) cresce molto più lentamente. Spinto dalla cavità amniotica e frenato meccanicamente da questo sistema, il cervello si avvolge in avanti. La potente flessione fa incontrare i due tubi endocardici divaricati, forzando la scomparsa del tessuto mediano attraverso un campo di corrosione (fusione endocardica)."
            },
            {
                "order": 3,
                "layer": "Le Mésoderme",
                "movement": "Looping Cardiaco & Diaframmatizzazione",
                "description": "Il cuore fuso non ha più spazio: effettua un salto volumetrico tridimensionale (Looping, il sistema ventricolare si ribalta sotto gli atri). La crescita continua del cervello deposita letteralmente la testa sul cuore, che schiaccia la parte superiore della vescicola vitellina. Queste cellule mesenchimali compresse formano il setto trasverso (abbozzo del diaframma)."
            },
            {
                "order": 4,
                "layer": "L'Endoderme",
                "movement": "Deassimilazione ed Epatizzazione",
                "description": "Il diaframma appena creato fa da barriera. Al di sotto, il potente torrente delle vene vitelline si accumula e congestiona il mesoderma. L'allungamento locale crea un vuoto di aspirazione posteriore (loosing field) alla giunzione degli intestini. L'epitelio dell'endoderma digestivo viene aspirato nella congestione e germoglia/frattalizza: è la nascita del Fegato (che serve prima di tutto a captare l'essudato dei rifiuti embrionari)."
            },
            {
                "order": 5,
                "layer": "L'Endoderme",
                "movement": "Motore Peritoneale Epatico",
                "description": "Organizzato dal flusso, il Fegato esplode con una massiccia crescita spaziale esclusivamente verso destra (senza ruotare). Questa enorme spinta diventa il motore meccanico addominale: sposta lo stomaco a sinistra (imprimendogli una rotazione) e aiuta a scavare la borsa omentale."
            },
            {
                "order": 6,
                "layer": "L'Endoderme",
                "movement": "Pneumatizzazione e Dinamica di Aspirazione",
                "description": "Il raddrizzamento dell'embrione crea un potente vuoto ('loosing field' toracico). L'epitelio endodermico collassa all'interno del mesoderma (invaginazione), diverge (bronchi principali) quindi effettua un'oscillazione rotatoria a spirale a livello del futuro ilo polmonare (alto verso dietro, basso verso avanti, rotazione esterna)."
            },
            {
                "order": 7,
                "layer": "Le Mésoderme",
                "movement": "Gonadizzazione / Renalizzazione",
                "description": "L'enorme crescita spaziale epatica (accoppiata all'ascensione surrenale) spinge la cresta genitale verso il basso e determina i canali di Wolff e Müller che formano reni e gonadi."
            }
        ],
        "themeColor": "bg-orange-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Cefalizzazione Esplosiva Ectodermica]:::ecto -->|Freno delle Aorte| B(Cardializzazione e Fusione):::meso\n  B -->|Looping e Raddrizzamento| C{Compressione della Massa e<br/>Diaframmatizzazione}:::meso\n  C --> D[Congestione Venosa Inferiore]:::meso\n  D -->|Aspirazione Loosing Field| E(Frattalizzazione Endodermica<br/>Epatizzazione):::endo\n  E -->|Crescita Spaziale Destra| F[Riallineamento Stomaco e Cavità Peritoneale]:::global\n  C -->|Nuovo Loosing Field| G(Pneumatizzazione Polmonare):::endo\n  F --> H[Spinta sulla Cresta Genitale]:::meso",
        "practicalIntegration": {
            "fulcrums": "Il Setto Trasverso (futuro diaframma/pericardio), il Centro di gravità epatobiliare (Fegato), l'Hiatus di Winslow (Entrata della cavità omentale) e l'Ilo Polmonare (centro di articolazione asimmetrico).",
            "generalPalpation": "Palpazione a cascata. Seguire lo scivolamento a spirale dello stomaco nell'arco peritoneale, la congestione epatobiliare, quindi la 'bolla d'aria' dei polmoni seguendo la loro rotazione (rotazione esterna con la parte superiore all'indietro e la parte inferiore in avanti).",
            "layerPerceptions": [
                {
                    "layer": "L'Endoderme",
                    "perception": "[Torace/Polmone]: L'Aspirazione a livello polmonare. Il terapeuta percepisce \"un pallone d'aria\" con una pressione parziale costante, uno scambio ossidativo tissutale tra la frequenza bronchiale/aerea e lo spazio liquido circostante."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "[Addome/Digerente]: Aspirazione (suzione, allentamento del campo digestivo), fenomeno di gemmazione frattale che richiede un enorme spazio a tutto l'addome."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Massa vascolare congestionata e pesantemente densificata sotto il diaframma che ne blocca la progressione (Vene vitelline)."
                }
            ],
            "therapistPosture": "Rilascio tramite il Vuoto: inglobare le coste inferiori per il tubo digerente. Per il Polmone (fulcro): la mano posteriore leggermente più in basso rispetto alla mano anteriore per seguire perfettamente l'asse inclinato della bascula di aspirazione polmonare.",
            "psychosomatic": "Verdetto = L'Epuration e il Non Detto. Il Fegato ingenuo capta la tossicità (rabbia inespressa/frustrazione tissutale portale). I Polmoni (bolla d'aria) diventano la riserva di una vecchia tristezza protetta, percepibile sotto le mani tramite densità specifiche. Lo Stomaco assorbe l'ambiente immediato tramite spasmo. Liberare questa cascata significa liberare la chimica dell'ipotalamo."
        }
    },
    {
        "id": "j-28",
        "dayLabel": "Giorno 28",
        "period": "Fine del 1° Mese",
        "title": "La Meravigliosa Sincronicità",
        "generalDescription": "Il momento di innesto meccanico globale finale dell'avvolgimento cranio-caudale dell'embrione.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Chiusura Marginale",
                "description": "Chiusura completa del tubo neurale (Neuroporo Posteriore)."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Integrazione Peritoneale",
                "description": "ESATTAMENTE nello stesso momento, il celoma esterno è definitivamente integrato e chiuso nel celoma interno (cavità peritoneale primitiva)."
            }
        ],
        "themeColor": "bg-yellow-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Avvolgimento Globale Terminale]:::global --> B(Chiusura del Neuroporo Posteriore):::ecto\n  A --> C(Integrazione Finale del Celoma Esterno):::meso"
    },
    {
        "id": "j-45",
        "dayLabel": "Dal Giorno 35 a 2 Mesi",
        "period": "Secondo Mese",
        "title": "Somiti, Coste e Volta Cranica",
        "generalDescription": "L'organizzazione muscolo-scheletrica si densifica attorno all'asse nervoso e cardiovascolare.",
        "events": [
            {
                "order": 1,
                "layer": "Le Mésoderme",
                "movement": "Coste e Mediastino",
                "description": "Densificazione delle cellule mesodermiche tra i vasi per formare le coste che si allungano e si uniscono al 45° giorno (angolo sternale di Louis, chiusura del mediastino)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Telencefalizzazione",
                "description": "Lo stiramento delle membrane durali (cervello che si erge) forma la volta cranica congiuntiva precoce (desmocranio)."
            }
        ],
        "themeColor": "bg-amber-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ravvicinamento Coste Linea Mediana]:::meso --> B(Sutura dell'Angolo di Louis G45):::meso\n  A --> C[Chiusura del Mediastino]:::meso\n  A ~~~ D\n  D[Raddrizzamento Assiale]:::global --> E(Tensione Duramerale):::ecto\n  E --> F[Modellizzazione del Desmocraneo]:::ecto"
    },
    {
        "id": "maturation-12ans",
        "dayLabel": "Fino a 12 anni",
        "period": "Maturazione Post-Natale",
        "title": "Dentizione e Maturazione Vegetativa",
        "generalDescription": "L'embriologia continua all'aria aperta. La postura e l'energetica del bambino finalizzano la dinamica tissutale.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Crescita Cerebrale Esterna (0-6 mesi)",
                "description": "Il volume neurale raddoppia ancora nei primi 6 mesi, modulando continuamente le membrane reciproche."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Sensore Dentale e Postura (6-10 mesi)",
                "description": "I primi denti agiscono come un punto di perno/fulcro meccanico fisso, consentendo al bambino il raddrizzamento dinamico del suo asse neuro-vertebrale."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Pneumatizzazione Mascellare (3 anni)",
                "description": "I seni mascellari si aerano, le surrenali e l'appendice si impegnano pienamente nella loro fisiologia."
            },
            {
                "order": 4,
                "layer": "Global",
                "movement": "Attivazione Tiroidea (7 anni)",
                "description": "La tiroide assume definitivamente il ruolo di radiatore del calore parentale (vera età della ragione termogenica)."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Attivazione Puberale (10-12 anni)",
                "description": "Ipofisi attiva, pneumatizzazione sfenoidale della base del cranio come paravento per integrare le funzioni ormonali adulte."
            }
        ],
        "themeColor": "bg-emerald-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Dentizione 6m]:::ecto --> B(Perno di Raddrizzamento Neurale):::ecto\n  B ~~~ C\n  C[Pneumatizzazione Mascellare 3A]:::endo --> D(Aggancio Appendice/Surrenali):::endo\n  D ~~~ E\n  E[Relè Tiroideo 7A]:::global --> F(Autonomia Calorica):::global\n  F ~~~ G\n  G[Ipofisi Puberale 12A]:::global --> H(Pneumatizzazione Sfenoidea):::global"
    }
];
