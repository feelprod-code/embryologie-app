export interface BiblioItem {
  id: string;
  text: string;
}

export interface BiblioCategory {
  id: string;
  title: string;
  items: BiblioItem[];
}

export const bibliographieData: BiblioCategory[] = [
  {
    id: "fondamentaux",
    title: "I. Ouvrages fondamentaux d’embryologie, développement et anatomie",
    items: [
      { id: "f1", text: "Drews U. Atlas de poche d’embryologie. Paris : Médecine-Sciences Flammarion." },
      { id: "f2", text: "Gilbert SF, Barresi MJF. Developmental Biology. Sunderland : Sinauer Associates." },
      { id: "f3", text: "Larsen WJ. Human Embryology. Philadelphia : Elsevier." },
      { id: "f4", text: "Moore KL, Persaud TVN, Torchia MG. The Developing Human: Clinically Oriented Embryology. Philadelphia : Elsevier." },
      { id: "f5", text: "O’Rahilly R, Müller F. The Embryonic Human Brain: An Atlas of Developmental Stages. Hoboken : Wiley-Liss." },
      { id: "f6", text: "Sadler TW. Langman’s Medical Embryology. Philadelphia : Wolters Kluwer." },
      { id: "f7", text: "Schoenwolf GC, Bleyl SB, Brauer PR, Francis-West PH. Larsen’s Human Embryology. Philadelphia : Elsevier." },
      { id: "f8", text: "Wolpert L, Tickle C, Arias AM. Principles of Development / Biologie du développement. Oxford : Oxford University Press." },
      { id: "f9", text: "Bouchet A, Cuilleret J. Anatomie humaine. Tome 1 : Ostéologie - articulations. Paris : Elsevier Masson." },
      { id: "f10", text: "Bouchet A, Cuilleret J. Anatomie humaine. Tome 2 : Myologie. Paris : Elsevier Masson." },
      { id: "f11", text: "Bouchet A, Cuilleret J. Anatomie humaine. Tome 3 : Splanchnologie. Paris : Elsevier Masson." },
      { id: "f12", text: "Netter FH. Atlas of Human Anatomy. Philadelphia : Elsevier." },
      { id: "f13", text: "Pansky B. Embryologie humaine. Paris : Maloine." },
      { id: "f14", text: "Milaire J. Embryologie humaine. Bruxelles : Université libre de Bruxelles." },
      { id: "f15", text: "Tuchmann-Duplessis H. Embryologie. Paris : Masson." },
      { id: "f16", text: "Martal J. L’embryon chez l’homme et chez l’animal. Paris : INRA / Masson." },
      { id: "f17", text: "Hinrichsen KV. The Face in the Human Embryo. Berlin : Springer." },
      { id: "f18", text: "Chorlton W. Voyage au centre du corps humain. Paris : Éditions du Chêne." },
      { id: "f19", text: "Embryologie humaine. PCEM intensif. Paris : Éditions médicales." },
      { id: "f20", text: "Embryos, Genes and Birth Defects. Référence conservée d’après les notes de cours originales." }
    ]
  },
  {
    id: "blechschmidt",
    title: "II. Blechschmidt, embryologie morphodynamique et forces formatrices",
    items: [
      { id: "b1", text: "Blechschmidt E. Biokinetics and Biodynamics of Human Differentiation: Principles and Applications. Springfield : Charles C Thomas Publisher." },
      { id: "b2", text: "Blechschmidt E. The Ontogenetic Basis of Human Anatomy: A Biodynamic Approach to Development from Conception to Birth. Berkeley : North Atlantic Books." },
      { id: "b3", text: "Blechschmidt E, Gasser RF. Biokinetics of Human Development: Principles and Applications. Springfield : Charles C Thomas Publisher." },
      { id: "b4", text: "Blechschmidt E. Anatomie und Ontogenese des Menschen. Heidelberg : Quelle & Meyer." },
      { id: "b5", text: "Blechschmidt E. Wie beginnt das menschliche Leben? Stuttgart : Urachhaus." },
      { id: "b6", text: "Blechschmidt E. Vom Ei zum Embryo. Stuttgart : Urachhaus." },
      { id: "b7", text: "Blechschmidt E. Comment commence la vie humaine. Paris : Éditions du Triades." },
      { id: "b8", text: "Blechschmidt E. The Stages of Human Development before Birth. Textes et planches. Philadelphia / Stuttgart : Karger." },
      { id: "b9", text: "Blechschmidt E. Sein und Werden. Stuttgart : Urachhaus." },
      { id: "b10", text: "Blechschmidt E. Die Frühentwicklung des Menschen. Stuttgart : Urachhaus." },
      { id: "b11", text: "Blechschmidt E. Die pränatalen Organsysteme des Menschen. Stuttgart : Hippokrates." },
      { id: "b12", text: "Blechschmidt E. Die Erhaltung der Individualität. Stuttgart : Urachhaus." },
      { id: "b13", text: "Blechschmidt E. Das Wunder des Kleinen. Stuttgart : Urachhaus." },
      { id: "b14", text: "Göbel T. Les forces formatrices du développement embryonnaire humain. Référence de cours." },
      { id: "b15", text: "Göbel T. À propos de la constitution du crâne humain. Référence de cours." },
      { id: "b16", text: "Girardin M, Höppner JP. Homunculus osteopathicus embryologicae. Support de cours ostéopathique." },
      { id: "b17", text: "Höppner JP. Séminaire sur le développement du système nerveux. Support pédagogique." },
      { id: "b18", text: "Van den Heede P. Séminaires d’embryologie. Notes et supports pédagogiques." }
    ]
  },
  {
    id: "articles-matrice",
    title: "III. Articles scientifiques - lamina basalis, membranes basales et matrice extracellulaire",
    items: [
      { id: "m1", text: "Yurchenco PD. Basement membranes: cell scaffoldings and signaling platforms. Cold Spring Harbor Perspectives in Biology. 2011;3(2):a004911." },
      { id: "m2", text: "Hohenester E, Yurchenco PD. Laminins in basement membrane assembly. Cell Adhesion & Migration. 2013;7(1):56-63." },
      { id: "m3", text: "Pöschl E, Schlötzer-Schrehardt U, Brachvogel B, Saito K, Ninomiya Y, Mayer U. Collagen IV is essential for basement membrane stability but dispensable for initiation of its assembly during early development. Development. 2004;131(7):1619-1628." },
      { id: "m4", text: "Aumailley M, Bruckner-Tuderman L, Carter WG, et al. A simplified laminin nomenclature. Matrix Biology. 2005;24(5):326-332." },
      { id: "m5", text: "Jayadev R, Sherwood DR. Basement membranes. Current Biology. 2017;27(6):R207-R211." },
      { id: "m6", text: "Jayadev R, Sherwood DR. Basement membranes in development, homeostasis and regeneration. Current Biology. 2017;27(6):R207-R211." },
      { id: "m7", text: "Kalluri R. Basement membranes: structure, assembly and role in tumour angiogenesis. Nature Reviews Cancer. 2003;3(6):422-433." },
      { id: "m8", text: "LeBleu VS, MacDonald B, Kalluri R. Structure and function of basement membranes. Experimental Biology and Medicine. 2007;232(9):1121-1129." },
      { id: "m9", text: "Gumbiner BM. Cell adhesion: the molecular basis of tissue architecture and morphogenesis. Cell. 1996;84(3):345-357." },
      { id: "m10", text: "Rozario T, DeSimone DW. The extracellular matrix in development and morphogenesis: a dynamic view. Developmental Biology. 2010;341(1):126-140." },
      { id: "m11", text: "Iozzo RV, Schaefer L. Proteoglycan form and function: a comprehensive nomenclature of proteoglycans. Matrix Biology. 2015;42:11-55." },
      { id: "m12", text: "Sherwood DR, Butler MT. Basement membrane mechanics and cell movement in development. Nature Cell Biology. 2014;16(12):1117-1119." },
      { id: "m13", text: "Khalilgharibi N, Mao Y. To form and function: on the role of basement membrane mechanics in tissue development, homeostasis and disease. Open Biology. 2021;11:200360." },
      { id: "m14", text: "Olsen AL, Follonier Castella L, Ziegler M, et al. Basement membrane stiffness and mechanotransduction. Matrix Biology. 2021." }
    ]
  },
  {
    id: "articles-polarite",
    title: "IV. Articles scientifiques - polarité, épithélium, régénération, cicatrisation et organoïdes",
    items: [
      { id: "p1", text: "Liang Y, et al. Integrin-mediated adhesion on laminin restores epithelial polarity. Journal of Cell Biology. 2016." },
      { id: "p2", text: "Rousselle P, Montmasson M, Garnier C. The basement membrane in epidermal polarity, stemness and regeneration. American Journal of Physiology - Cell Physiology. 2022." },
      { id: "p3", text: "Breitkreutz D, Koxholt I, Thiemann K, Nischt R. Skin basement membrane: the foundation of epidermal integrity - BM functions and diverse roles of bridging molecules nidogen and perlecan. BioMed Research International. 2013." },
      { id: "p4", text: "Fässler R, et al. Integrins and basement membrane remodeling in wound repair. Journal of Cell Science. 2017." },
      { id: "p5", text: "Li J, Chen J, Kirsner R. Pathophysiology of acute wound healing. Clinics in Dermatology / Journal of Surgical Research. 2003." },
      { id: "p6", text: "Wilson SE. Injury and defective regeneration of the epithelial basement membrane in corneal fibrosis: a paradigm for fibrosis in other organs? Experimental Eye Research. 2017;161:56-62." },
      { id: "p7", text: "Ramos-Lewis W, Page-McCaw A. Basement membrane mechanics shape development: lessons from the fly. Developmental Biology. 2018." },
      { id: "p8", text: "Halfter W, et al. The retinal basement membrane: structure and role in development and repair. Matrix Biology. 2015." },
      { id: "p9", text: "Kamalden TA, et al. Basement membrane and retinal regeneration. Experimental Eye Research. 2016." },
      { id: "p10", text: "Miner JH. The glomerular basement membrane. Experimental Cell Research. 2012;318(9):973-978." },
      { id: "p11", text: "Kalluri R. Basement membranes and kidney regeneration. Kidney International. 2003." },
      { id: "p12", text: "Patton BL. Basal lamina and the organization of neuromuscular synapses. Journal of Cell Science. 2000." },
      { id: "p13", text: "Sanes JR. The basement membrane/basal lamina of skeletal muscle. Nature Reviews Neuroscience. 2003." },
      { id: "p14", text: "Rayagiri SS, Ranaldi D, Raven A, et al. Basal lamina remodeling at the skeletal muscle stem cell niche mediates stem cell self-renewal. Nature Communications. 2018;9:1075." },
      { id: "p15", text: "Ishii G, et al. Recapitulation of extracellular laminin environment maintains stemness of satellite cells in vitro. Stem Cell Reports. 2018." },
      { id: "p16", text: "Jain N, et al. Mimicking the natural basement membrane for advanced tissue engineering. Biomacromolecules. 2022." },
      { id: "p17", text: "Perugini V, et al. A substrate-mimicking basement membrane drives expansion and function of mesenchymal stem cells. Frontiers in Cell and Developmental Biology. 2021." },
      { id: "p18", text: "Chrisnandy A, et al. An extracellular matrix niche secreted by epithelial cells supports de novo organoid formation. Developmental Cell. 2025." }
    ]
  },
  {
    id: "articles-notochorde",
    title: "V. Articles scientifiques - notochorde, axe embryonnaire, polarité et morphogenèse",
    items: [
      { id: "n1", text: "Corallo D, Trapani V, Bonaldo P. The notochord: structure and functions. Cellular and Molecular Life Sciences. 2015;72(16):2989-3008." },
      { id: "n2", text: "Trapani V, Bonaldo P, Corallo D. Role of the ECM in notochord formation, function and disease. Journal of Cell Science. 2017;130(19):3203-3211." },
      { id: "n3", text: "Kryvi H, Nordvik K, Fjelldal PG, et al. Heads and tails: the notochord develops differently in the cranium and caudal fin of Atlantic salmon (Salmo salar L.). The Anatomical Record. 2021." },
      { id: "n4", text: "Seleit A, et al. Development and regeneration dynamics of the medaka notochord. Developmental Biology. 2020;463(1):11-25." },
      { id: "n5", text: "Lu Q, et al. Ciona embryonic tail bending is driven by asymmetrical notochord contractility and coordinated by epithelial proliferation. Development. 2020." },
      { id: "n6", text: "Wang F, Zhang C, Shi R, et al. The embryonic and evolutionary boundaries between notochord and cartilage: a new look at nucleus pulposus-specific markers. Osteoarthritis and Cartilage. 2018;26(10):1274-1282." },
      { id: "n7", text: "Raffaelli A, Stern CD. Signaling events regulating embryonic polarity and formation of the primitive streak in the chick embryo. Current Topics in Developmental Biology. 2020;136:85-111." },
      { id: "n8", text: "Vincent S. Left-right asymmetry: Notch acts upstream of Nodal. Médecine/Sciences. 2003;19(12):1188-1190." },
      { id: "n9", text: "Sefton EM, Gallardo M, Kardon G. Developmental origin and morphogenesis of the diaphragm, an essential mammalian muscle. Developmental Biology. 2018;440(2):64-73." },
      { id: "n10", text: "Teh WT, McBain J, Rogers P. What is the contribution of embryo-endometrial asynchrony to implantation failure? Journal of Assisted Reproduction and Genetics. 2016;33(11):1419-1430." },
      { id: "n11", text: "Gordts S, Koninckx P, Brosens I. Pathogenesis of deep endometriosis. Fertility and Sterility. 2017;108(6):872-885.e1." }
    ]
  },
  {
    id: "mecanobiologie",
    title: "VI. Mécanobiologie, tensegrité et devenir cellulaire",
    items: [
      { id: "t1", text: "Ingber DE. Tensegrity I. Cell structure and hierarchical systems biology. Journal of Cell Science / Annual Review of Biomedical Engineering. 2003." },
      { id: "t2", text: "Discher DE, Janmey P, Wang YL. Tissue cells feel and respond to the stiffness of their substrate. Science. 2005;310(5751):1139-1143." },
      { id: "t3", text: "Hay ED, editor. Cell Biology of Extracellular Matrix. New York : Springer." }
    ]
  },
  {
    id: "osteopathie",
    title: "VII. Ostéopathie, clinique, posture et références complémentaires",
    items: [
      { id: "o1", text: "Still AT. Autobiography of Andrew T. Still. Kirksville : 1908." },
      { id: "o2", text: "Still AT. Philosophy of Osteopathy. Kirksville : A.T. Still." },
      { id: "o3", text: "Still AT. Philosophy and Mechanical Principles of Osteopathy. Kirksville : A.T. Still." },
      { id: "o4", text: "Hartman LS. Handbook of Osteopathic Technique. Cheltenham : Stanley Thornes." },
      { id: "o5", text: "Helsmoortel J, Hirth T, Wührl P. Lehrbuch der viszeralen Osteopathie. Stuttgart : Haug Verlag." },
      { id: "o6", text: "Perronneau-Ferré. Ostéopathie cranio-pelvienne. Paris : Maloine." },
      { id: "o7", text: "Fient M, Williame C. Dynamique viscérale. Support d’enseignement ostéopathique." },
      { id: "o8", text: "Lignon A. Le puzzle crânien. Paris : Sully." },
      { id: "o9", text: "Cambier J. Propédeutique neurologique. Paris : Masson." },
      { id: "o10", text: "Gray, Toghill. Sémiologie médicale. Paris : Masson." },
      { id: "o11", text: "Waligora J, Perlemuter L. Anatomie. Paris : Masson." },
      { id: "o12", text: "Carton P. Diagnostic et conduite des tempéraments. Paris : Maloine." },
      { id: "o13", text: "Girardin M. Evolutionary Physiology. Support de cours." },
      { id: "o14", text: "Concept ostéopathique de la posture. Support pédagogique." },
      { id: "o15", text: "Auberville A, Aubin A. La motilité en ostéopathie : nouveau concept basé sur l’embryologie. Paris : Elsevier Masson ; 2015." },
      { id: "o16", text: "Van den Heede P. Osteopathic Medicine: Holonomic Keys for Treatment. Munich : Urban & Fischer / Elsevier ; 2016." },
      { id: "o17", text: "Van den Heede P, Danjon JL. Das kardiovaskuläre System in der Osteopathie: Entwicklungsdynamik, Funktionsdynamik, Behandlung. Munich : Urban & Fischer / Elsevier ; 2012." },
      { id: "o18", text: "Liem T, Van den Heede P, editors. Foundations of Morphodynamics in Osteopathy: An Integrative Approach to Cranium, Nervous System, and Emotions. Edinburgh : Handspring Publishing ; 2017." },
      { id: "o19", text: "Van den Heede P. The Emotional Landscape in the Osteopathic Field: The Role of the Body in Installing an Emotional State. Soest : Boekscout ; 2023." },
      { id: "o20", text: "Höppner JP. Life as a Verb. Morphologicum ; s.d." },
      { id: "o21", text: "Nilsson L. Le miracle de la vie. Film documentaire / DVD." }
    ]
  }
];
