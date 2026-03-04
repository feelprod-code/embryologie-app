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
        dayLabel: "Antes del Día 1",
        period: "Período Preconceptual y Maduración",
        title: "Polaridad, Preparación e Información",
        generalDescription: "El ovocito no es neutral. Desde su maduración en los folículos, está bañado en los fluidos sistémicos maternos, absorbiendo el entorno bioquímico y emocional.",
        events: [
            {
                order: 1,
                layer: "N/A",
                movement: "Maduración e Impronta Transgeneracional",
                description: "El stock de ovocitos se forma en el útero. Los choques emocionales y la calidad de la circulación sanguínea materna impregnan estas células. El ovocito integra el estrés de la madre, pero también de la abuela."
            },
            {
                order: 2,
                layer: "N/A",
                movement: "Bandera de Wolpert (Concentración)",
                description: "Establecimiento del eje metabólico asimétrico. Las proteínas maternas y el ARNm se polarizan, desplazando el núcleo hacia el polo animal. Es la aparición del eje craneocaudal de referencia, mucho antes de la fecundación."
            },
            {
                order: 3,
                layer: "N/A",
                movement: "Polo Asimilativo",
                description: "Segregación entre el vitelo (reservas de energía) y los gradientes morfógenos. El citoesqueleto se organiza y pone el ovocito bajo tensión para la recepción."
            }
        ],
        themeColor: "bg-blue-900",
        mermaidCode: `graph TD\n${colors}\n  A[Ovocito en Maduración]:::global -->|Impronta Materna| B(Fluidos Foliculares y Secreciones):::global\n  B --> C[Bandera de Wolpert]:::global\n  C --> D(Eje Craneocaudal Original):::global\n  D --> E[Polo Sintético/Núcleo]:::global`
    },
    {
        id: "j-1",
        dayLabel: "Día 1",
        period: "La Fecundación",
        title: "El Encuentro y La Ola de Calcio",
        generalDescription: "A nivel de la ampolla tubárica, penetrará un único espermatozoide. Es una explosión energética y el momento absoluto de la encarnación.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Cerradura de Reconocimiento (ZP3)",
                description: "El ovocito 'elige' activamente a través de un reconocimiento enzimático vía la proteína ZP3 de su zona pelúcida. Una no recepción o cortocircuito de esta fase (ej. FIV) no crea la cicatriz eléctrica natural del D1."
            },
            {
                order: 2,
                layer: "Global",
                movement: "Choque Electromagnético",
                description: "En la penetración, inversión eléctrica inmediata (bloqueo de la polispermia) y liberación explosiva de zinc. El ovocito termina su meiosis."
            },
            {
                order: 3,
                layer: "Global",
                movement: "La Ola Masiva de Calcio",
                description: "Reorganización total y fulgurante del citoesqueleto dictada por un oleaje de calcio. Es la chispa de vida que cristaliza el eje craneocaudal (vestigio proyectado más tarde hacia S2/Cóccix y conectado al Corazón)."
            },
            {
                order: 4,
                layer: "L'Oeil",
                movement: "Fundación de la Información Sensorial",
                description: "Aunque el ojo físico no existe, la polaridad del sistema nervioso central y del diencéfalo encuentra su fundación en el campo eléctrico producido en este momento."
            }
        ],
        themeColor: "bg-purple-900",
        mermaidCode: `graph TD\n${colors}\n  A[Fecundación]:::global -->|Reconocimiento ZP3| B(Inversión Eléctrica):::global\n  B --> C[Liberación de Zinc]:::global\n  C --> D{Ola Explosiva de Calcio}:::global\n  D --> E(Reorganización del Citoesqueleto):::global\n  D --> F(Cristalización del Eje Central):::global`,
        practicalIntegration: {
            fulcrums: "Origen epigenético del Corazón: vestigio energético de la fecundación descendiendo a S2/Cóccix. El eje Corazón-Cóccix reconecta el corazón actual con su fuente concepcional.",
            generalPalpation: "Diagnóstico de la motilidad del tejido cardíaco en el espacio fascial: Sístole fascial (verticalización, hiperacción, agotamiento) vs Diástole fascial (horizontalización, postración, búsqueda de la energía original hacia el cóccix).",
            layerPerceptions: [
                { layer: "Global", perception: "Onda primitiva, fluctuación de amplitud muy larga orientada a lo largo del eje longitudinal original." }
            ],
            therapistPosture: "Mano inferior bajo la pelvis (S2/Cóccix, ubicación original del eje) y mano superior en el eje del Corazón (ángulo de Louis). El objetivo es reconectar el tejido cardíaco a su 'matriz' coccígea.",
            psychosomatic: "Veredicto = El Encuentro y la Información Transgeneracional. El ovocito reconoce la llave ZP3. Este es el momento de la 'cicatriz original'. Tratamiento por y con el campo del corazón."
        }
    },
    {
        id: "j-1-4",
        dayLabel: "Días 1 a 4",
        period: "1ra Semana",
        title: "Estancamiento Radical y Segmentación",
        generalDescription: "El cigoto realiza una cascada de multiplicaciones apretándose, sin ningún aumento de volumen total.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Prisión de la Zona Pelúcida",
                description: "El sistema está encerrado en este caparazón. El cigoto se segmenta en 2, luego 4, 8 y 16 células (la mórula). La falta de espacio para crecer genera una inmensa presión energética latente."
            },
            {
                order: 2,
                layer: "Global",
                movement: "Explosión Metabólica (Aumento de Superficie)",
                description: "A igual volumen, la superficie de la membrana se multiplica de manera exponencial. Esta extrema concentración de membrana multiplica la actividad celular y la respiración."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Nacimiento del Blastocele (Motor Digestivo Temprano)",
                description: "Durante esta segmentación bajo tensión, las células rechazan un exudado fluido (el primer desecho). Este fluido aparta los blastómeros hacia el exterior (trofoblasto) y forma el blastocele. Esta cavidad es la primerísima iniciación asimétrica del sistema digestivo y la absorción."
            },
            {
                order: 4,
                layer: "L'Ectoderme",
                movement: "Polo Embrionario y Centralización",
                description: "Las células agrupadas en un lado (Botón embrionario) preparan en secreto el terreno para el famoso disco que se convertirá en el sistema nervioso y la piel."
            },
            {
                order: 5,
                layer: "Global",
                movement: "Ruptura y Eclosión (D4)",
                description: "La presión intraluminal del líquido y la multiplicación vuelven la situación insostenible. El embrión rompe la zona pelúcida para salir, listo para arrimarse a la madre."
            }
        ],
        themeColor: "bg-indigo-900",
        mermaidCode: `graph TD\n${colors}\n  A[Cigoto]:::global --> B(Divisiones sin Crecimiento Volumétrico):::global\n  B -->|Aumento de Superficie Membranosa| C[Presión Metabólica y Energética]:::global\n  C -->|Rechazo de Exudado Fluido| D(Aparición de Blastocele<br/>Endodermo):::endo\n  D --> E[Concentración del Botón Embrionario]:::ecto\n  E --> F{Eclosión Radical D4/D5}:::global`,
        practicalIntegration: {
            fulcrums: "Eje craneocaudal primitivo y 'sobres de presión'. Blastocele temprano como el origen de las tensiones viscerales.",
            generalPalpation: "Densificación metabólica sin expansión de tejido. Percepción de una fluctuación longitudinal impedida y búsqueda de 'liberación/eclosión' en niveles profundos de tejido.",
            layerPerceptions: [
                { layer: "Global", perception: "Dinámica puramente membranosa (pelúcida) y trabajo autocrino de fluidos (campos de presión)." },
                { layer: "L'Endoderme", perception: "Dinámica de acumulación y efusión de fluidos (el comienzo de la absorción fisiológica y la eliminación endodérmica)." }
            ],
            therapistPosture: "Posición de presencia asimétrica, mano global capturando todo el volumen aún indistinguible.",
            psychosomatic: "Veredicto = Confinamiento, expectativa y acumulación. Dinámica de represión antes de la gran 'liberación'."
        }
    },
    {
        id: "j-5-8",
        dayLabel: "Días 5 a 8",
        period: "Fin 1ra - Principio 2da Semana",
        title: "Implantación y Anidación",
        generalDescription: "El embrión llega al útero. Guiado por su polo asimilativo, libera un ácido para excavar en la mucosa uterina (microsangrado).",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Implantación y Exudado",
                description: "Creación repentina de la segunda cavidad por exudado fluido: la cavidad amniótica (precursor del LCR y relación con la madre)."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Diferenciación Topográfica",
                description: "El botón embrionario se separa en un disco bilaminar. Las células de la parte superior forman el Epiblasto (futuro sistema nervioso)."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Diferenciación Topográfica",
                description: "Las células que miran hacia abajo (hacia el blastocele) forman el Hipoblasto (futuro sistema digestivo directo)."
            },
            {
                order: 4,
                layer: "L'Oeil",
                movement: "D7: LCR Primitivo",
                description: "Aparición de la cavidad amniótica. El líquido amniótico primitivo formará el primer líquido cefalorraquídeo que llenará el futuro tubo neural y el diencéfalo (origen del Ojo)."
            },
            {
                order: 5,
                layer: "L'Oeil",
                movement: "D8: Morfología Simbólica",
                description: "Durante la inmersión en la mucosa y con el exudado creando el saco amniótico, la forma de la estructura evoca simbólicamente a la de un ojo."
            }
        ],
        themeColor: "bg-rose-900",
        mermaidCode: `graph TD\n${colors}\n  A[Inmersión Uterina]:::global --> B(Exudado de la Cavidad Amniótica):::global\n  A --> C{Separación Bilaminar}:::global\n  C --> D[Epiblasto<br/>Ectodermo Primitivo]:::ecto\n  C --> E[Hipoblasto<br/>Endodermo Primitivo]:::endo`,
        practicalIntegration: {
            fulcrums: "Zona B (campo energético alrededor del cuerpo físico, huella de la cavidad amniótica original) y el pedículo embrionario.",
            generalPalpation: "Movimiento de infusión y permeación. Integración de fluidos de la periferia (madre) hacia el centro. Aparición de presión de exudado bilateral.",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Orientación ascendente, hacia el fluido amniótico claro y protector, precursor del LCR." },
                { layer: "L'Endoderme", perception: "Orientación descendente, tejido buscando nutrición (saco vitelino), densidad de fluidos diferente." }
            ],
            therapistPosture: "Escucha del amplio recubrimiento (Zona B). Percepción del espacio de fluido que rodea al cuerpo y el útero.",
            psychosomatic: "Veredicto = Encarnación en el receptáculo y calidez. Problema profundo en caso de aborto o no recepción. Limpieza mucosa (liberación de gastrina pélvica) para aliviar el nido intrauterino."
        }
    },
    {
        id: "j-7-14",
        dayLabel: "Días 7 a 14",
        period: "2da Semana",
        title: "Retículo y Celoma Extraembrionario",
        generalDescription: "La periferia del embrión crece asombrosamente rápido en la mucosa materna, produciendo un desgarro relativo con el disco central que crece mucho más lento.",
        events: [
            {
                order: 1,
                layer: "Global",
                movement: "Crecimiento Diferencial",
                description: "Aparición de la membrana de Heuser y de un espacio fibroso rellenado por el retículo extraembrionario de estiramiento."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Creación de la 3ra Cámara",
                description: "La red aracnoidea cede ante la tracción, creando el vasto exudado del celoma extraembrionario. El antiguo blastocele se convierte en el saco vitelino primario."
            }
        ],
        themeColor: "bg-pink-900",
        mermaidCode: `graph TD\n${colors}\n  A[Crecimiento Periférico Diferencial]:::global --> B(Tracción Aracnoidea):::meso\n  B --> C[Desgarro del Retículo]:::meso\n  C --> D(Creación del Celoma Extraembrionario<br/>Mesodermo Extraembrionario):::meso`
    },
    {
        id: "j-14-21",
        dayLabel: "Días 14 a 21",
        period: "3ra Semana",
        title: "Gastrulación y Lateralidad",
        generalDescription: "Formación del pedículo embrionario que concentra el aporte trófico en un solo flujo. El embrión adopta una forma en S.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Ola Notocordal",
                description: "El epiblasto forma una S por la afluencia nutricia. Aparición de la línea primitiva (nódulo de Hensen) y de la Notocorda."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Aspiración e Invaginación",
                description: "Un campo de aspiración sobre la línea primitiva succiona las células del epitelio (células en botella) que se invaginan para rellenar el espacio entre Ecto y Endo: es el nacimiento del verdadero mesodermo intraembrionario."
            },
            {
                order: 3,
                layer: "Global",
                movement: "Rotación Ciliar",
                description: "Al fondo del nódulo de Hensen, los cilios rotan a 60° (flujo nodal) empujando las señales hacia la izquierda, lo cual determinará la futura asimetría de los órganos."
            }
        ],
        themeColor: "bg-red-900",
        mermaidCode: `graph TD\n${colors}\n  A[Línea Primitiva]:::ecto --> B(Campo de Aspiración):::ecto\n  B --> C[Invaginación de Células en Botella]:::meso\n  C --> D(Nacimiento del Mesodermo <br/>3ra Capa):::meso\n  A --> E[Rotación Ciliar a 60°]:::global\n  E --> F(Asimetría Izquierda-Derecha):::global`,
        practicalIntegration: {
            fulcrums: "Eje craneosacral primitivo (Notocorda). Tensión entre dos polos: El Punto Cero (Punto fijo, Sincondrosis Esfenobasilar / SEB) y el Punto Sacro (Punto móvil, nódulo de Hensen, vestigio en S2/Cóccix).",
            generalPalpation: "La 'Ola' (ola poderosa de crecimiento notocordal descendente) junto el 'Ascenso del punto cero' (fuerza telencefálica ascendente y enderezamiento del cráneo).",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Empuje direccional recto y rígido (notocorda) traccionando el polo central inmovil." },
                { layer: "Le Mésoderme", perception: "Percibido como un punto de succión y campo de aspiración ('loosing field'). Las células se precipitan en la fosa primitiva." }
            ],
            therapistPosture: "El Rayo Láser: Mano bajo el occipital en contacto con la SEB (Punto Cero), mano bajo el sacro (Punto Sacro / Línea Primitiva). Ausencia de manipulación mecánica ('Wu Wei'), búsqueda del punto de encuentro y la quietud dinámica de la SEB.",
            psychosomatic: "Veredicto = El Eje de Salud y lo Transgeneracional. Desviaciones o bloqueos congelan memorias ancestrales a lo largo de la notocorda. Al reconectar el punto móvil (sacro) con su anclaje de referencia de salud (el fluir primario en Punto Cero), se disuelve un punto ciego orgánico."
        }
    },
    {
        id: "j-21-22",
        dayLabel: "Días 21 a 22",
        period: "Principio de la 4ta Semana",
        title: "Neurulación, Ojo y Corazón",
        generalDescription: "La notocorda actúa como centro eléctrico frenando el crecimiento central, formándose el surco neural (ectodermo). El corazón empieza a latir.",
        events: [
            {
                order: 1,
                layer: "L'Oeil",
                movement: "Expansión Diencefálica",
                description: "En sincronía con los latidos del corazón primitivo, el cerebro produce una expansión lateral que crea la vesícula óptica primaria."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Cardiogénesis Temprana",
                description: "El corazón empieza a formarse (nacen las aortas primitivas y las venas cardinales en la zona apical). Comenzará a latir entre el D21 y D22."
            }
        ],
        themeColor: "bg-purple-900",
        mermaidCode: `graph TD\n${colors}\n  A[Freno Notocordal]:::global --> B(Surco Neural):::ecto\n  B --> C[Expansión Diencefálica<br/>Futuros Ojos]:::ecto\n  D[Zona Apical Mesodérmica]:::meso --> E(Aortas Primitivas):::meso\n  E --> F[Latidos en el D21/D22]:::meso`,
        practicalIntegration: {
            fulcrums: "Sincondrosis Esfenobasilar (Punto cero), la ínsula (punto de anclaje de angulación celular), Neuróporo Anterior y EL CORAZÓN.",
            generalPalpation: "El 'Tai Chi Cerebral'. Percepción de veloz expansión neural seguida de una basculación hacia adelante.",
            layerPerceptions: [
                { layer: "L'Ectoderme", perception: "Expansión colosal, fuerza dorsal intensa en aumento (cefalización)." },
                { layer: "Le Mésoderme", perception: "Freno rígido y vascular (tejido vascular tira del neural hacia el centro)." }
            ],
            therapistPosture: "Neutralidad absoluta ('Punto de encuentro'). Apoyo occipito-mastoideo sutil (Bóveda Craneal) sin interferencia. Soporte tipo 'CV4'.",
            psychosomatic: "Veredicto = El Corazón informador. El plegamiento extremo literalmente reposa el cerebro embrionario, los primordios del tracto digestivo superior, los ojos (placodas ópticas) sobre **la zona de origen vibratorio que es el tejido cardíaco**."
        }
    },
    {
        id: "j-22-28",
        dayLabel: "Días 22 a 28",
        period: "4ta Semana",
        title: "La Gran Cascada Cinética",
        generalDescription: "Es el orden mecánico final del plegamiento longitudinal (flexión) del embrión debido a la resistencia vascular hacia el enorme empuje neural dorsal.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Cefalización Central",
                description: "El ectodermo epiblástico (futuro cerebro central) empieza a crecer a gran escala explosiva al polo apical."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Cardialización (Freno Vascular)",
                description: "El tejido vascular (aortas posteriores) avanza a una velocidad más lenta. Empujado por el líquido de la cavidad amniótica y frenado mecánicamente hacia abajo por el bloque del corazón en un arco, el cerebro termina curvándose sobre él. Además, forzada por la presión la línea cardíaca se fusiona y reduce lo sobrante."
            },
            {
                order: 3,
                layer: "Le Mésoderme",
                movement: "Rotación Cardíaca y Diafragmatización",
                description: "El corazón sin espacio para descender voltea volumétricamente en sí mismo obligando al seno y mesénquima subyacente a transformarse en diafragma."
            },
            {
                order: 4,
                layer: "L'Endoderme",
                movement: "Desasimilación y Hepatización",
                description: "El nuevo diafragma sella. Se comprime toda la vasculatura masiva inferior creando por su estasis y flujo rápido un vacío a gran escala desde del intestino digestivo, que colapsa formándose en lo que luego será el Hígado Primitivo."
            },
            {
                order: 5,
                layer: "L'Endoderme",
                movement: "Motor Peritoneal Hepático",
                description: "El crecimiento rotativo hiper veloz de la masa hepática empuja el estómago naciente hacia la izquierda y establece así toda una cavidad rotatoria del sistema."
            },
            {
                order: 6,
                layer: "L'Endoderme",
                movement: "Neumatización y Dinámica de Aspiración",
                description: "Tracción sobre los brotes pulmonares que, estirados, se invaginan asimétricamente configurando luego su dinámica pulmonar rotatoria (arriba-atrás/abajo-adelante)."
            },
            {
                order: 7,
                layer: "Le Mésoderme",
                movement: "Gonadización / Renalización",
                description: "Tracción sobre la cresta para establecer el sistema nefrótico caudal y de gónada empujada por toda la gran masa de hepatización superpuesta."
            }
        ],
        themeColor: "bg-orange-900",
        mermaidCode: `graph TD\n${colors}\n  A[Cephalización Central Explosiva]:::ecto -->|Freno aórtico| B(Cardialización y Fusión):::meso\n  B -->|Looping | C{Bucle Cardíaco y Compresión del Mesénquima}:::meso\n  C --> D[Congestión vascular de las venas vitelinas frente a diafragma]:::meso\n  D -->|Vacuum De Presión| E(Endodermo Epitelial Forma Hepatización):::endo\n  E -->|Crecimiento Expansivo Derecho| F[Vacío Izquierdo para el Estómago y Peritoneo]:::global\n  C -->|Tracción Vacío| G(Neumatización y Respiración Fetal):::endo\n  F --> H[Masas Hepática Empujando al sistema Renal y Genital]:::meso`,
        practicalIntegration: {
            fulcrums: "Septum Transversum (futuro diafragma/pericardio), el hígado, y el hilio pulmonar derecho con rotación.",
            generalPalpation: "Palpación en Cascada. Seguimiento del flujo rotacional estomacal, seguido del hígado como una congestión, seguido a su vez por burbujas aéreas.",
            layerPerceptions: [
                { layer: "L'Endoderme", perception: "[Tórax]: 'Globos llenos' de una presión casi atmosférica constante (los pulmones)." },
                { layer: "L'Endoderme", perception: "[Abdomen]: Presión, vacío de succión, fuerza inmensa vegetativa." },
                { layer: "Le Mésoderme", perception: "Masa vascular pesada detenida (congestión venosa)." }
            ],
            therapistPosture: "Mecánica a nivel global e individual: Soltando las compresiones cruzando órganos para relajar su memoria embriológica tensional de la cuarta semana.",
            psychosomatic: "Veredicto = Hepatización Emocional Primitiva: Todo bloqueo, vacío orgánico o compresión subyacente está atado y se retiene desde este movimiento explosivo fundante y un reseteo o limpieza devuelve su forma original sin patologías adquiridas posteriores."
        }
    },
    {
        id: "j-28",
        dayLabel: "Día 28",
        period: "Final 1er Mes",
        title: "La Sincronicidad Maravillosa",
        generalDescription: "Momento global terminal del plegamiento definitivo de la estructura.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Cierre Marginal",
                description: "Cierre definitivo y completo de los tubos neurales (Neuroporo posterior cierre completo)."
            },
            {
                order: 2,
                layer: "Le Mésoderme",
                movement: "Integración Peritoneal",
                description: "Exácto en el mismo milisegundo anterior, la cavidad se cierra con ella hacia su versión del celoma mesenquimatoso permanentemente asimilado."
            }
        ],
        themeColor: "bg-yellow-900",
        mermaidCode: `graph TD\n${colors}\n  A[Envoltura Plegamiento Global Neural]:::global --> B(Cierre Terminal de la Cola):::ecto\n  A --> C(Cierre Coelom Extra Intra Total Y Simultanea):::meso`
    },
    {
        id: "j-45",
        dayLabel: "Del Día 35 al 2do Mes",
        period: "2do Mes",
        title: "Somitas, Costillas y Bóveda Craneal",
        generalDescription: "A lo largo de su nuevo caparazón, la bóveda y tejido denso conectivo envuelve.",
        events: [
            {
                order: 1,
                layer: "Le Mésoderme",
                movement: "Costilla y Sternalización Cierre Posterior y Angular (Ángulo D45)",
                description: "Concentración del mesodermo entre la pared neural forma al fin su protección de costillas uniendo esternón."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Telencefalización y Desmocraneo",
                description: "Al elevar y generar fuerzas de sujeción se modelan a medida del embrión todas formas primitivas óseas."
            }
        ],
        themeColor: "bg-amber-900",
        mermaidCode: `graph TD\n${colors}\n  A[Costillas Crecimiento Medio]:::meso --> B(Ángulo Esternón Día 45):::meso\n  A --> C[Estabilización Cardíaca Mediastinal]:::meso\n  D[Alza Nerviosa]:::global --> E(Tension Dural):::ecto\n  E --> F[Primer modelo de Cráneo Bóveda]:::ecto`
    },
    {
        id: "maturation-12ans",
        dayLabel: "Hasta los 12 años",
        period: "Maduración Postnatal",
        title: "Dentición y Maduración Vegetativa Final",
        generalDescription: "Múltiples de los ritmos terminan por concretarse biológicamente después al aire libre.",
        events: [
            {
                order: 1,
                layer: "L'Ectoderme",
                movement: "Crecimiento Cerebral Extrauterino (0-6 meses)",
                description: "Volúmenes y envolturas neuronales densas triplicando el perímetro craneal en adaptación veloz."
            },
            {
                order: 2,
                layer: "L'Ectoderme",
                movement: "Sensor Dental Y Enderezamiento (6-10 meses)",
                description: "El estímulo en incisivos genera un mecanismo para verticalizar y formar todo control posicional y motor axial de la cabeza."
            },
            {
                order: 3,
                layer: "L'Endoderme",
                movement: "Senos Maxilares Y Glande (3 años)",
                description: "Aire se implanta como el eje primario al hueso y el conjunto inmunológico apéndice sintoniza el equilibrio interno."
            },
            {
                order: 4,
                layer: "Global",
                movement: "Madurez Tiroides (7 años)",
                description: "Habilidad térmica propia estabilizada dejando depender biológicamente de sus ancestros y madres a su grado homeostático normal."
            },
            {
                order: 5,
                layer: "Global",
                movement: "Final Glande De Asentamiento Hipofiseal (12 Años Y Luego Pubertad Final)",
                description: "Con toda neumática estabilizada, en especial senos paranasales/esfenoidal la silla acoge ritmos más directos reproductores y adultos de hormonalidad máxima."
            }
        ],
        themeColor: "bg-emerald-900",
        mermaidCode: `graph TD\n${colors}\n  A[Incisivos y Dientes 6m]:::ecto --> B(Punto Central del Eje Dorsal Postura Humana Pura):::ecto\n  C[Formas Areas Respiradoras Maxila 3a]:::endo --> D(Apendice Suprerrenal Endodermo Adaptivo):::endo\n  E[Termodinámica Tiroides 7a]:::global --> F(Soltura de Matriz Térmica Paterna Indendientemente):::global\n  G[Pleno Funcionamiento Pubertad Hormonal Eje 12 a más]:::global --> H(Maduración Neumatica Cráneo base Centralización Esfenoides Hipófisis):::global`
    }
];
