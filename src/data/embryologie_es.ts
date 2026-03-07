import type { StageDataV2 } from './embryologie';


export const detailedStages: StageDataV2[] = [
    {
        "id": "j-0",
        "dayLabel": "Antes del Día 1",
        "period": "Período Pre-conceptual y Maduración",
        "title": "Polaridad, Preparación e Información",
        "generalDescription": "El ovocito no es neutro. Desde su maduración en los folículos, está bañado en los fluidos sistémicos de la madre, impregnándose del entorno bioquímico y emocional.",
        "events": [
            {
                "order": 1,
                "layer": "N/A",
                "movement": "Maduración y Huella Transgeneracional",
                "description": "El stock de ovocitos se constituye in utero. Los choques emocionales y la calidad de la circulación sanguínea materna ya impregnan estas células. El ovocito integra el estrés de la madre, pero también el de la abuela."
            },
            {
                "order": 2,
                "layer": "N/A",
                "movement": "Bandera de Wolpert (Concentración)",
                "description": "Establecimiento del eje metabólico asimétrico. Las proteínas y el ARN mensajero maternos se polarizan, desplazando el núcleo hacia el polo animal. Esta es la aparición del eje cráneo-caudal de referencia, mucho antes de la fecundación."
            },
            {
                "order": 3,
                "layer": "N/A",
                "movement": "Polo Asimilador",
                "description": "Segregación entre el vitelo (reservas energéticas) y los gradientes morfogenéticos. El citoesqueleto se organiza y pone al ovocito bajo tensión para la recepción."
            }
        ],
        "themeColor": "bg-blue-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ovocito en Maduración]:::global -->|Impronta Materna| B(Fluidos y Secreciones Foliculares):::global\n  B --> C[Bandera de Wolpert]:::global\n  C --> D(Eje Craneocaudal Original):::global\n  D --> E[Polo Sintético/Núcleo]:::global"
    },
    {
        "id": "j-1",
        "dayLabel": "Día 1",
        "period": "Fecundación",
        "title": "El Encuentro y la Ola de Calcio",
        "generalDescription": "En la ampolla tubárica, un solo espermatozoide penetrará. Es una explosión energética y el momento absoluto de la encarnación.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Reconocimiento de la Llave (ZP3)",
                "description": "El ovocito \"elige\" activamente mediante reconocimiento enzimático a través de la proteína ZP3 de su zona pelúcida. Una no-recepción o cortocircuito de esta fase (ej. FIV) no crea la cicatriz eléctrica natural del Día 1."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Choque Electromagnético",
                "description": "Desde la entrada, inversión eléctrica inmediata (bloqueo de la polispermia) y liberación explosiva de zinc. El ovocito termina su meiosis."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "La Ola de Calcio Masiva",
                "description": "Reorganización total y fulminante del citoesqueleto dictada por una avalancha de calcio. Es la chispa de vida que fija el eje cráneo-caudal (vestigio proyectado más tarde hacia S2/Coxis, y conectado al Corazón)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "Asiento de la Información Sensorial",
                "description": "Aunque el ojo físico no existe, la polaridad del sistema nervioso central y diencefálico encuentra su fundamento en el campo eléctrico producido en ese instante."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Fecundación]:::global -->|Reconocimiento ZP3| B(Inversión Eléctrica):::global\n  B --> C[Liberación de Zinc]:::global\n  C --> D{Onda de Calcio Explosiva}:::global\n  D --> E(Reorganización del Citoesqueleto):::global\n  D --> F(Cristalización del Eje Central):::global",
        "practicalIntegration": {
            "fulcrums": "Origen Epigenético del Corazón: vestigio energético de la fecundación que desciende hasta S2/Cóccix. El eje Corazón-Cóccix conecta el corazón actual con su fuente concepcional.",
            "generalPalpation": "Diagnóstico de motilidad tisular cardíaca en el espacio facial: Sístole facial (verticalización, sobreactuación, agotamiento) vs Diástole facial (horizontalización, postración, búsqueda de energía original hacia el cóccix).",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Onda primitiva, fluctuación de amplitud muy larga orientada según el eje longitudinal original."
                }
            ],
            "therapistPosture": "Mano inferior bajo la pelvis (S2/Coxis, lugar original del eje) y mano superior sobre el eje del Corazón (ángulo de Louis). El objetivo es reconectar el tejido cardíaco con su 'blueprint' coccígeo.",
            "psychosomatic": "Veredicto = El Encuentro y la Información Transgeneracional. El ovocito reconoce la clave ZP3. Es el momento de la 'cicatriz original'. Tratamiento por y con el campo del corazón."
        }
    },
    {
        "id": "j-1-4",
        "dayLabel": "Días 1 a 4",
        "period": "1ª Semana",
        "title": "Estancamiento Radical y Hendidura",
        "generalDescription": "El cigoto realiza una cascada de multiplicaciones, compactándose, sin ningún crecimiento del volumen total.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Prisión de la Zona Pelúcida",
                "description": "El sistema está encerrado en esta cáscara. El cigoto se divide en 2, luego 4, 8 y 16 células (la Mórula). La ausencia de espacio para el crecimiento genera una inmensa presión energética latente."
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "Explosión Metabólica (Aumento de Superficies)",
                "description": "A igual volumen, la superficie de la membrana se multiplica exponencialmente. Esta concentración extrema de membrana multiplica la actividad y la respiración celulares."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Nacimiento del Blastocisto (Motor Digestivo Temprano)",
                "description": "Durante esta segmentación bajo presión, las células liberan un exudado líquido (primeros desechos). Este fluido empuja los blastómeros hacia el exterior (el trofoblasto) y forma el blastocele. Esta cavidad es el primer inicio asimétrico del sistema digestivo y de la absorción."
            },
            {
                "order": 4,
                "layer": "L'Ectoderme",
                "movement": "Polo Embrionario y Centralización",
                "description": "Las células agrupadas a un lado (Botón Embrionario) preparan secretamente el terreno del famoso disco que se convertirá en el sistema nervioso y la piel."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Ruptura y Eclosión (Día 4)",
                "description": "La presión intraluminal del líquido y la multiplicación hacen que la situación sea insostenible. El embrión rompe la zona pelúcida para extraerse de ella, listo para anclarse a la madre."
            }
        ],
        "themeColor": "bg-indigo-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Cigoto]:::global --> B(Divisiones sin Crecimiento Volumétrico):::global\n  B -->|Aumento de Superficie Membranal| C[Presión Metabólica y Energética]:::global\n  C -->|Rechazo de Exudado Líquido| D(Blastocelo<br/>Aparición de Endodermo):::endo\n  D --> E[Concentración del Botón Embrionario]:::ecto\n  E --> F{Eclosión Radical D4/D5}:::global",
        "practicalIntegration": {
            "fulcrums": "Eje cráneo-caudal primitivo y las \"envolturas de presión\". El Blastocisto temprano como origen de las tensiones viscerales.",
            "generalPalpation": "Densificación metabólica sin expansión de los tejidos. Percepción de una fluctuación longitudinal obstaculizada, y búsqueda de \"liberación/eclosión\" a niveles tisulares profundos.",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "Trabajo puramente membranoso (pelúcido) y líquido autocrino (campos de presión)."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Dinámica de acumulación y derrame de fluidos (el comienzo de la fisiología de absorción y eliminación endodérmica)."
                }
            ],
            "therapistPosture": "Posición de presencia asimétrica, mano global captando el conjunto del volumen aún indiscernible.",
            "psychosomatic": "Veredicto = El encierro, la espera y la acumulación. Dinámica de contención antes de la gran \"liberación\"."
        }
    },
    {
        "id": "j-5-8",
        "dayLabel": "Días 5 a 8",
        "period": "Finales de la 1ª - Principios de la 2ª Semana",
        "title": "La Eclosión y la Nidación",
        "generalDescription": "El embrión llega al útero. Guiado por su polo asimilador, libera un ácido para incrustarse en la mucosa uterina (micro-sangrados).",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Anidación y Exudado",
                "description": "Creación súbita por exudado líquido de la segunda cavidad: la cavidad amniótica (precursora del LCR y relación con la madre)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Diferenciación Topográfica",
                "description": "El botón embrionario se separa en disco didérmico. Las células superiores forman el Epiblasto (futuro sistema nervioso)."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Diferenciación Topográfica",
                "description": "Las células orientadas hacia abajo (hacia el blastocele) forman el Hipoblasto (futuro sistema digestivo directo)."
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "Día 7: LCR Primitivo",
                "description": "Aparición de la cavidad amniótica. El líquido amniótico primitivo formará el primer líquido cefalorraquídeo que llenará el futuro tubo neural y el diencéfalo (origen del Ojo)."
            },
            {
                "order": 5,
                "layer": "L'Oeil",
                "movement": "Día 8: Morfología Simbólica",
                "description": "Cuando se entierra en la mucosa y con el exudado que crea la bolsa de las aguas, la forma de la estructura evoca simbólicamente la de un ojo."
            }
        ],
        "themeColor": "bg-rose-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Anidación Uterina]:::global --> B(Exudado de Cavidad Amniótica):::global\n  A --> C{Separación Didérmica}:::global\n  C --> D[Epiblasto<br/>Ectodermo Primitivo]:::ecto\n  C --> E[Hipoblasto<br/>Endodermo Primitivo]:::endo",
        "practicalIntegration": {
            "fulcrums": "La Zona B (campo energético alrededor del cuerpo físico, rastro de la cavidad amniótica original) y el pedículo embrionario.",
            "generalPalpation": "Movimiento de infusión y permeación. Integración de los fluidos de la periferia (madre) hacia el centro. Aparición de una presión bilateral del exudado.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Orientación hacia arriba, hacia el líquido amniótico claro y protector, precursor del LCR."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "Orientación hacia abajo, tejido buscando nutrición (saco vitelino), densidad líquida diferente."
                }
            ],
            "therapistPosture": "Escucha de la envoltura amplia (Zona B). Percepción del espacio líquido que rodea el cuerpo y el útero.",
            "psychosomatic": "Veredicto = La encarnación en el receptáculo y el calor. Un problema profundo si hay aborto espontáneo o falta de acogida. Limpieza de la mucosa (liberación de gastrina pélvica) para calmar el nido intrauterino."
        }
    },
    {
        "id": "j-7-14",
        "dayLabel": "Días 7 a 14",
        "period": "2ª Semana",
        "title": "Retículo y Celoma Externo",
        "generalDescription": "La periferia del embrión crece extremadamente rápido en la mucosa materna, provocando un desgarro relativo con el disco central que crece más lentamente.",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "Crecimiento Diferencial",
                "description": "Aparición de la membrana de Heuser y de un espacio fibroso rellenado por el retículo extraembrionario en tensión."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Creación de la 3ª Cámara",
                "description": "La red aracnoidea cede bajo la tracción, creando el vasto exudado del Celoma externo. El antiguo blastocele se convierte en la vesícula vitelina primaria."
            }
        ],
        "themeColor": "bg-pink-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Crecimiento Periférico Diferencial]:::global --> B(Tracción Aracnoidea):::meso\n  B --> C[Desgarro del Retículo]:::meso\n  C --> D(Creación del Celoma Externo<br/>Mesodermo Extraembrionario):::meso"
    },
    {
        "id": "j-14-21",
        "dayLabel": "Días 14 a 21",
        "period": "3ra Semana",
        "title": "Gastrulación y Lateralidad",
        "generalDescription": "Formación del pedículo embrionario que focaliza el aporte trófico en un solo flujo. El embrión toma forma de S.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Vaina Notochordal",
                "description": "El epiblasto forma una S bajo el efecto de los flujos nutritivos. Aparición de la línea primitiva (nódulo de Hensen) y de la Notocorda."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Aspiración e Invaginación",
                "description": "Un campo de aspiración sobre la línea primitiva aspira células epiteliales (células en botella) que se invaginan para llenar el espacio entre Ecto y Endo: este es el nacimiento propio del Mesodermo intraembrionario."
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "Rotación Ciliar",
                "description": "En el fondo del nódulo de Hensen, los cilios giran 60° (flujo nodal) impulsando señales hacia la izquierda, determinando la futura asimetría de los órganos."
            }
        ],
        "themeColor": "bg-red-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Línea Primitiva]:::ecto --> B(Campo de Aspiración):::ecto\n  B --> C[Invaginación Bottle Cells]:::meso\n  C --> D(Nacimiento del Mesodermo 3er Tejido):::meso\n  A --> E[Rotación Ciliar 60°]:::global\n  E --> F(Asimetría Izquierda-Derecha):::global",
        "practicalIntegration": {
            "fulcrums": "Eje craneosacro embriológico primitivo (Notocorda). Tensión entre dos polos: El Punto Cero (Fulcro fijo, Sínfisis Esfenobasilar / SEB) y el Punto Sacro (Fulcro móvil, Nódulo de Hensen, vestigio en S2/Cóccix).",
            "generalPalpation": "La \"Hola\" (potente ola de crecimiento notocordal descendente) acoplada a la \"Subida del punto cero\" (fuerza de telencefalización ascendente y de enderezamiento del cráneo).",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Empuje direccional rectilíneo y rígido (notocorda) traccionando el polo central craneal inmóvil."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Percibido como un campo de succión y aspiración ('loosing field'). Las células se sumergen violentamente en la fosa primitiva."
                }
            ],
            "therapistPosture": "El Rayo Láser: Mano bajo el Occipital en contacto con la SSB (Punto Cero), mano bajo el Sacro (Punto Sacro / Línea primitiva). Sin manipulación mecánica: búsqueda del silencio ('Wu Wei'), del 'Meeting Point' y de la inmovilidad dinámica de la SSB.",
            "psychosomatic": "Veredicto = El Eje de Salud y lo Transgeneracional. Las desviaciones o bloqueos congelan las imágenes ancestrales a lo largo de la notocorda. Al reconectar el punto móvil (sacro) a su fulcro fijo de referencia (Punto Cero), el terapeuta percibe el reinicio de la fluctuación y permite que el cuerpo se desvincule de sus lesiones adquiridas y se reorganice."
        }
    },
    {
        "id": "j-21-22",
        "dayLabel": "Días 21 a 22",
        "period": "Comienzo de la 4ª Semana",
        "title": "Neurulación, Ojo y Corazón",
        "generalDescription": "La notocorda actúa como un centro eléctrico que ralentiza el crecimiento central, el ectodermo se ahueca en un surco neural. El corazón comienza a latir.",
        "events": [
            {
                "order": 1,
                "layer": "L'Oeil",
                "movement": "Expansión Diencefálica",
                "description": "En sincronicidad con los latidos cardíacos primitivos, el cerebro produce una expansión lateral creando la vesícula óptica primaria."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Cardiogénesis Temprana",
                "description": "El corazón comienza a formarse (emergencia de las aortas primitivas y las venas cardinales en la zona apical). Comenzará a latir en el día 21/22."
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ralentización Notocordal]:::global --> B(Canal Neural):::ecto\n  B --> C[Expansión Diencefálica<br/>Futuros Ojos]:::ecto\n  D[Zona Apical Mesodérmica]:::meso --> E(Aortas Primitivas):::meso\n  E --> F[Inicio de Latidos D21/D22]:::meso",
        "practicalIntegration": {
            "fulcrums": "Sínfisis Esfenobasilar (SSB, Punto Cero), la Ínsula (punto de anclaje del balanceo cerebral), el Neuroporo Anterior, y EL CORAZÓN.",
            "generalPalpation": "El 'Tai-Chi del Cerebro'. Percepción de una expansión fulminante, seguida de una primera flexión cefálica de enrollamiento paroxístico sobre el punto fijo central del corazón.",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "Explosividad, fuga e inmensa expansión volumétrica lateral y dorsal (cefalización). Sensación de flujo migratorio de la Cresta Neural hacia la cara y los plexos."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Freno rígido. Las dos aortas laterales actúan como anclajes (el tejido tiene dificultades para seguir el crecimiento neural). La cardialización tracciona violentamente todo el sistema hacia el centro."
                }
            ],
            "therapistPosture": "Neutralidad absoluta (\"Punto de encuentro\"). Toma craneal englobante \"como un cuenco de agua lleno hasta el borde\". Acompañamiento de la técnica CV4 (compresión del 4º ventrículo) para reequilibrar el LCR intracraneal y extracraneal (Zona B).",
            "psychosomatic": "Veredicto = El Corazón Informador. El gran pliegue deposita literalmente el cerebro, el esbozo de los miembros superiores (las manos), los ojos (placodas ópticas) y la boca/voz (arco branquial) **directamente sobre el tejido cardíaco latiendo**. La psicosomática es mayor: uno mira, toca y habla con la in-formación de su propio corazón."
        }
    },
    {
        "id": "j-22-28",
        "dayLabel": "Días 22 a 28",
        "period": "4ª Semana",
        "title": "La Gran Cascada Cinética",
        "generalDescription": "Es el orden cronológico y mecánico de plicatura (flexión) del embrión, causado por la resistencia vascular frente al explosivo crecimiento neural dorsal.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Cefalización Central",
                "description": "El ectodermo epiblástico (futuro cerebro central) comienza a crecer a una velocidad explosiva hacia el polo apical."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Cardialización (Freno vascular)",
                "description": "El tejido mesodérmico vascular (aortas) crece mucho más lentamente. Impulsado por la cavidad amniótica y frenado mecánicamente por este sistema, el cerebro se enrolla hacia adelante. La potente flexión hace que los dos tubos endocárdicos separados se encuentren, forzando la desaparición del tejido mediano por un campo de corrosión (fusión endocárdica)."
            },
            {
                "order": 3,
                "layer": "Le Mésoderme",
                "movement": "Bucle Cardíaco y Diafragmatización",
                "description": "El corazón fusionado ya no tiene espacio: realiza un salto volumétrico tridimensional (Looping, el sistema ventricular bascula bajo las aurículas). El crecimiento continuo del cerebro deposita literalmente la cabeza sobre el corazón, que aplasta la parte superior de la vesícula vitelina. Estas células mesenquimales comprimidas forman el septum transversum (esbozo del diafragma)."
            },
            {
                "order": 4,
                "layer": "L'Endoderme",
                "movement": "Desasimilación y Hepatización",
                "description": "El diafragma recién creado hace de barrera. Debajo, el potente torrente de las venas vitelinas se acumula y congestiona el mesodermo. El alargamiento local crea un vacío de aspiración posterior (loosing field) en la unión de los intestinos. El epitelio del endodermo digestivo es aspirado hacia la congestión y brota/fractaliza: es el nacimiento del Hígado (que sirve primero para captar el exudado de los desechos embrionarios)."
            },
            {
                "order": 5,
                "layer": "L'Endoderme",
                "movement": "Motor Peritoneal Hepático",
                "description": "Organizado por el flujo, el Hígado explota con un crecimiento espacial masivo exclusivamente hacia la derecha (sin pivotar). Este enorme empuje se convierte en el motor mecánico abdominal: empuja el estómago hacia la izquierda (imprimiéndole una rotación) y ayuda a excavar la cavidad posterior de los epiplones."
            },
            {
                "order": 6,
                "layer": "L'Endoderme",
                "movement": "Neumatización y Dinámica de Aspiración",
                "description": "La rectificación del embrión crea un potente vacío ('loosing field' torácico). El epitelio endodérmico se colapsa dentro del mesodermo (invaginación), diverge (bronquios principales) y luego realiza un giro rotatorio espiral a nivel del futuro hilio pulmonar (arriba hacia atrás, abajo hacia adelante, rotación externa)."
            },
            {
                "order": 7,
                "layer": "Le Mésoderme",
                "movement": "Gonadización / Renalización",
                "description": "El enorme crecimiento espacial hepático (junto con la ascensión suprarrenal) fuerza la cresta genital hacia abajo y determina los conductos de Wolff y Müller que forman los riñones y las gónadas."
            }
        ],
        "themeColor": "bg-orange-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Cefalización Explosiva Ectodérmica]:::ecto -->|Freno de las Aortas| B(Cardialización y Fusión):::meso\n  B -->|Bucle y Enderezamiento| C{Compresión de Masa y<br/>Diafragmatización}:::meso\n  C --> D[Congestión Venosa Inferior]:::meso\n  D -->|Aspiración Campo Aflojado| E(Fractalización Endodérmica<br/>Hepatización):::endo\n  E -->|Crecimiento Espacial Derecho| F[Inclinación Estómago y Cavidad Peritoneal]:::global\n  C -->|Nuevo Campo Aflojado| G(Neumatización Pulmonar):::endo\n  F --> H[Empuje en la Cresta Genital]:::meso",
        "practicalIntegration": {
            "fulcrums": "El Septum Transversum (futuro diafragma/pericardio), el Centro de gravedad hepatobiliar (Hígado), el Hiato de Winslow (Entrada a la cavidad epiploica) y el Hilo Pulmonar (centro de articulación asimétrico).",
            "generalPalpation": "Palpación en cascada. Seguimiento del deslizamiento espiral del estómago en el arco peritoneal, de la congestión hepatobiliar, luego la 'burbuja de aire' de los pulmones siguiendo su báscula (rotación externa con la parte superior hacia atrás y la parte inferior hacia adelante).",
            "layerPerceptions": [
                {
                    "layer": "L'Endoderme",
                    "perception": "[Tórax/Pulmón]: La Aspiración a nivel pulmonar. El terapeuta percibe 'un balón de aire' con una presión parcial constante, un intercambio oxidativo tisular entre la frecuencia bronquial/aérea y el espacio líquido circundante."
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "[Abdomen/Digestivo]: Aspiración (succión, aflojamiento del campo digestivo), fenómeno de brote fractal que demanda muchísimo espacio en todo el abdomen."
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "Masa vascular congestionada y densificada bajo el diafragma que detiene su progresión (Venas vitelinas)."
                }
            ],
            "therapistPosture": "Liberación por el Vacío: englobar las costillas inferiores para el tubo digestivo. Para el Pulmón (fulcro): la mano posterior ligeramente más baja que la mano anterior para seguir perfectamente el eje inclinado del balanceo de aspiración pulmonar.",
            "psychosomatic": "Veredicto = La depuración y lo no dicho. El Hígado ingenuo capta la toxicidad (ira no expresada/frustración tisular portal). Los Pulmones (burbuja de aire) se convierten en la reserva de una vieja tristeza protegida, perceptible bajo las manos por densidades específicas. El Estómago absorbe el entorno inmediato por espasmo. Liberar esta cascada es liberar la química del hipotálamo."
        }
    },
    {
        "id": "j-28",
        "dayLabel": "Día 28",
        "period": "Fin del 1er Mes",
        "title": "La Maravillosa Sincronicidad",
        "generalDescription": "El momento del engranaje mecánico global final del enrollamiento cráneo-caudal del embrión.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Cierre Marginal",
                "description": "Cierre completo del tubo neural (Neuroporo Posterior)."
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "Integración Peritoneal",
                "description": "EXACTAMENTE al mismo tiempo, el celoma externo se integra y cierra definitivamente en el celoma interno (cavidad peritoneal primitiva)."
            }
        ],
        "themeColor": "bg-yellow-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enrollamiento Global Terminal]:::global --> B(Cierre del Neuroporo Posterior):::ecto\n  A --> C(Integración Final del Celoma Externo):::meso"
    },
    {
        "id": "j-45",
        "dayLabel": "Del día 35 a los 2 meses",
        "period": "Segundo Mes",
        "title": "Somitas, Costillas y Bóveda Craneal",
        "generalDescription": "La organización musculoesquelética se densifica alrededor del eje nervioso y cardiovascular.",
        "events": [
            {
                "order": 1,
                "layer": "Le Mésoderme",
                "movement": "Costillas y Mediastino",
                "description": "Densificación de las células mesodérmicas entre los vasos para formar las costillas que se alargan y se unen en el día 45 (ángulo esternal de Louis, cierre del mediastino)."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Telencefalización",
                "description": "El estiramiento de las membranas duramadre (cerebro que se yergue) forma la bóveda del cráneo conjuntiva temprana (desmocráneo)."
            }
        ],
        "themeColor": "bg-amber-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Acercamiento de Costillas Línea Media]:::meso --> B(Sutura Ángulo de Louis D45):::meso\n  A --> C[Cierre del Mediastino]:::meso\n  D[Enderezamiento Axial]:::global --> E(Tensión Duramadre):::ecto\n  E --> F[Modelización del Desmocráneo]:::ecto"
    },
    {
        "id": "maturation-12ans",
        "dayLabel": "Hasta los 12 años",
        "period": "Maduración Postnatal",
        "title": "Dentición y Maduración Vegetativa",
        "generalDescription": "La embriología continúa al aire libre. La postura y la energética del niño finalizan la dinámica tisular.",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "Crecimiento Cerebral Externo (0-6 meses)",
                "description": "El volumen neural se duplica nuevamente en los primeros 6 meses, modulando continuamente las membranas recíprocas."
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "Sensor Dental y Postura (6-10 meses)",
                "description": "Los primeros dientes actúan como un punto de pivote/fulcro mecánico fijo, permitiendo al niño la rectificación dinámica de su eje neurovertebral."
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "Neumatización Maxilar (3 años)",
                "description": "Los senos maxilares se airean, las glándulas suprarrenales y el apéndice se comprometen plenamente en su fisiología."
            },
            {
                "order": 4,
                "layer": "Global",
                "movement": "Activación Tiroidea (7 años)",
                "description": "La tiroides asume definitivamente el relevo del radiador del calor parental (verdadera edad de la razón termogénica)."
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "Activación Puberal (10-12 años)",
                "description": "Hipófisis activa, neumatización esfenoidal de la base del cráneo como biombo para integrar las funciones hormonales adultas."
            }
        ],
        "themeColor": "bg-emerald-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Dentición 6m]:::ecto --> B(Pivote de Enderezamiento Neural):::ecto\n  C[Neumatización Maxilar 3A]:::endo --> D(Compromiso Apéndice/Suprarrenales):::endo\n  E[Relevo Tiroideo 7A]:::global --> F(Autonomía Calórica):::global\n  G[Hipófisis Puberal 12A]:::global --> H(Neumatización Esfenoidal):::global"
    }
];
