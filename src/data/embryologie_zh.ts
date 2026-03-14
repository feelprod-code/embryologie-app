import type { StageDataV2 } from './embryologie';


export const detailedStages: StageDataV2[] = [
    {
        "id": "j-0",
        "dayLabel": "第1天之前",
        "period": "概念前时期与成熟",
        "title": "极性、准备和信息",
        "generalDescription": "卵母细胞并非中性。从其在卵泡中成熟开始，它就浸泡在母体的全身液中，吸收着生物化学和情感环境。",
        "events": [
            {
                "order": 1,
                "layer": "N/A",
                "movement": "成熟与跨代印记",
                "description": "卵母细胞库在子宫内形成。情绪冲击和母体血液循环的质量已经浸染了这些细胞。卵母细胞整合了母亲和祖母的压力。"
            },
            {
                "order": 2,
                "layer": "N/A",
                "movement": "沃尔珀特旗（集中）",
                "description": "不对称代谢轴的建立。母体蛋白质和信使RNA极化，将细胞核推向动物极。这是参考的颅尾轴的出现，远在受精之前。"
            },
            {
                "order": 3,
                "layer": "N/A",
                "movement": "同化极",
                "description": "卵黄（能量储备）和形态发生梯度之间的分离。细胞骨架组织起来，使卵母细胞处于接收的张力之下。"
            }
        ],
        "themeColor": "bg-blue-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ovocyte en Maturation]:::global -->|Empreinte Maternelle| B(Fluides et Sécrétions Folliculaires):::global\n  B --> C[Drapeau de Wolpert]:::global\n  C --> D(Axe Crânio-Caudal Originel):::global\n  D --> E[Pôle Synthétique/Noyau]:::global"
    },
    {
        "id": "j-1",
        "dayLabel": "第一天",
        "period": "受精",
        "title": "相遇与钙波",
        "generalDescription": "在输卵管壶腹部，只有一个精子会穿透。这是一个能量的爆发，是受肉的绝对时刻。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "识别关键（ZP3）",
                "description": "卵母细胞通过其透明带的ZP3蛋白酶识别主动“选择”精子。如果这一阶段没有被接受或被短路（例如体外受精），就不会产生第一天的自然电学瘢痕。"
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "电磁冲击",
                "description": "进入后，立即发生电逆转（阻止多精入卵）和锌的爆发性释放。卵母细胞完成减数分裂。"
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "钙质巨浪",
                "description": "细胞骨架在钙离子激增的驱动下发生彻底而迅猛的重组。这是生命的火花，它固定了颅尾轴（后来投射到S2/尾骨并与心脏相连的遗迹）。"
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "感官信息的基质",
                "description": "虽然肉眼不存在，但中枢神经系统和间脑的极性却是在那一刻产生的电场中找到其基础的。"
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Fécondation]:::global -->|Reconnaissance ZP3| B(Inversion Électrique):::global\n  B --> C[Libération du Zinc]:::global\n  C --> D{Vague Calcique Explosive}:::global\n  D --> E(Réorganisation Cytosquelette):::global\n  D --> F(Cristallisation de l'Axe Central):::global",
        "practicalIntegration": {
            "fulcrums": "心脏的表观遗传起源：从受精作用到骶骨S2/尾骨的能量遗迹。心-尾轴将当前的心脏与其受孕源头连接起来。",
            "generalPalpation": "面部空间中心脏组织能动性诊断：面部收缩（垂直化、过度活动、衰竭）与面部舒张（水平化、虚脱、寻求朝向尾骨的原始能量）。",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "原始波，沿原始纵轴定向的超长振幅波动。"
                }
            ],
            "therapistPosture": "下方的双手置于骨盆下方（骶骨2/尾骨，中轴的原始位置），上方的双手置于心脏中轴（路易氏角）。目的是将心脏组织与其尾骨的“蓝图”重新连接。",
            "psychosomatic": "判决 = 相遇与跨代信息。卵母细胞识别 ZP3 钥匙。这是“原始疤痕”的时刻。通过心之场进行治疗。"
        }
    },
    {
        "id": "j-1-4",
        "dayLabel": "第1天至第4天",
        "period": "第一周",
        "title": "根本性停滞与分裂",
        "generalDescription": "受精卵通过紧密地进行一系列的倍增，但总体积没有增长。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "透明带的囚禁",
                "description": "系统被封闭在这个外壳中。受精卵分裂成2个、4个、8个和16个细胞（桑椹胚）。生长空间的缺乏产生了巨大的潜在能量压力。"
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "代谢爆发（表面积增加）",
                "description": "在体积相同的情况下，膜表面积呈指数级增长。这种极端的膜集中成倍地增加了细胞的活动和呼吸。"
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "囊胚腔的诞生（早期消化动力）",
                "description": "在压力劈裂过程中，细胞会排出液体渗出物（最初的废物）。这种液体将卵裂球推向外部（滋养层），并形成囊胚腔。这个腔体是消化系统和吸收功能最早的不对称萌芽。"
            },
            {
                "order": 4,
                "layer": "L'Ectoderme",
                "movement": "胚胎极与中心化",
                "description": "一侧堆积的细胞（胚胎结）秘密地为著名的圆盘准备场地，该圆盘将发育成神经系统和皮肤。"
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "破裂与孵化（第4天）",
                "description": "腔内液体的压力和增殖使情况变得难以维持。胚胎冲破透明带，从中挣脱出来，准备好附着在母亲身上。"
            }
        ],
        "themeColor": "bg-indigo-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Zygote]:::global --> B(Divisions sans Croissance Volumétrique):::global\n  B -->|Augmentation Surface Membranaire| C[Pression Métabolique & Energétique]:::global\n  C -->|Rejet d'Exsudat Liquidien| D(Blastocèle<br/>Apparition Endoderme):::endo\n  D --> E[Concentration du Bouton Embryonnaire]:::ecto\n  E --> F{Éclosion Radicale J4/J5}:::global",
        "practicalIntegration": {
            "fulcrums": "原始颅尾轴和“压力包层”。早期胚泡是内脏张力的起源。",
            "generalPalpation": "组织在没有扩张的情况下进行代谢致密化。感知到纵向波动的受阻，并寻求深层组织层面的“放松/萌发”。",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "纯膜性（透明带）工作和自分泌液性（压力场）工作。"
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "液体积聚和溢出动力学（内胚层吸收和消除生理学的开始）。"
                }
            ],
            "therapistPosture": "不对称的临在姿势，整体之手捕捉着尚未可辨的全部体积。",
            "psychosomatic": "结论 = 禁锢、等待和积聚。大“释放”前的保持动力。"
        }
    },
    {
        "id": "j-5-8",
        "dayLabel": "第5至8天",
        "period": "第1周末 - 第2周初",
        "title": "孵化和着床",
        "generalDescription": "胚胎进入子宫。在其同化极的引导下，它释放一种酸，以植入子宫内膜（微量出血）。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "着床与渗出",
                "description": "通过液体渗出突然形成第二个腔：羊膜腔（脑脊液的前体，并与母亲相关）。"
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "地形分化",
                "description": "胚胎结节分裂成双胚层盘。上层细胞形成外胚层（未来的神经系统）。"
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "地形分化",
                "description": "朝下（朝向胚泡腔）的细胞形成下胚层（未来的直接消化系统）。"
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "第七天：原始脑脊液",
                "description": "羊膜腔的出现。原始羊水将形成第一个脑脊液，它将充满未来的神经管和间脑（眼睛的起源）。"
            },
            {
                "order": 5,
                "layer": "L'Oeil",
                "movement": "第8天：象征性形态",
                "description": "当埋入黏膜中，以及渗出液形成羊水囊时，结构的形状象征性地唤起了眼睛的形象。"
            }
        ],
        "themeColor": "bg-rose-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enfouissement Utérin]:::global --> B(Exsudat Cavité Amniotique):::global\n  A --> C{Séparation Didermique}:::global\n  C --> D[Épiblaste<br/>Ectoderme Primitif]:::ecto\n  C --> E[Hypoblaste<br/>Endoderme Primitif]:::endo",
        "practicalIntegration": {
            "fulcrums": "B区（围绕身体的能量场，原始羊膜腔的痕迹）和胚胎蒂。",
            "generalPalpation": "灌注和渗透运动。液体从外周（母亲）向中心整合。渗出液出现双向压力。",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "向上，朝向清澈、有保护作用的羊水，它是脑脊液的前身。"
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "向下定向，组织寻求营养（卵黄囊），不同的液体密度。"
                }
            ],
            "therapistPosture": "聆听宽泛的包层（B区）。感知身体和子宫周围的液体空间。",
            "psychosomatic": "结论 = 在容器和热量中的具身。如果流产或不接受，则存在深层问题。清洁粘膜（释放盆腔胃泌素）以安抚子宫内巢。"
        }
    },
    {
        "id": "j-7-14",
        "dayLabel": "第7至14天",
        "period": "第二周",
        "title": "网膜和外体腔",
        "generalDescription": "胚胎的周边在母体黏膜中生长极快，导致与生长较慢的中央盘之间发生相对撕裂。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "差异性生长",
                "description": "出现Heuser膜和充满张力性胚外网的纤维空间。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "第三心室的创建",
                "description": "蛛网膜网络在牵拉下屈服，形成广阔的体腔渗出液。旧的胚泡腔成为初级卵黄囊。"
            }
        ],
        "themeColor": "bg-pink-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Croissance Périphérique Différentielle]:::global --> B(Traction Arachnoïdienne):::meso\n  B --> C[Déchirement du Réticulum]:::meso\n  C --> D(Création Cœlome Externe<br/>Mésoderme Extra-Embryonnaire):::meso"
    },
    {
        "id": "j-14-21",
        "dayLabel": "第14至21天",
        "period": "第三周",
        "title": "原肠胚形成与侧向性",
        "generalDescription": "胚胎柄的形成将滋养流集中成单一流。胚胎呈S形。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "脊索波",
                "description": "在外来营养流的作用下，外胚层形成一个S形。出现原条（Hensen节）和脊索。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "吸入与内陷",
                "description": "原条上的一个吸引场吸入上皮细胞（瓶状细胞），这些细胞内陷以填充外胚层和内胚层之间的空间：这是胚内中胚层本身的诞生。"
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "纤毛旋转",
                "description": "在Hensen结的底部，纤毛以60°旋转（节流），向左推动信号，决定了器官未来的不对称性。"
            }
        ],
        "themeColor": "bg-red-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ligne Primitive]:::ecto --> B(Champ d'Aspiration):::ecto\n  B --> C[Invagination Bottle Cells]:::meso\n  C --> D(Naissance du Mésoderme 3ème Tissu):::meso\n  A --> E[Rotation Ciliaire 60°]:::global\n  E --> F(Asymétrie Gauche-Droite):::global",
        "practicalIntegration": {
            "fulcrums": "原始胚胎颅骶轴（脊索）。两极之间的张力：零点（固定支点，蝶枕结合/SSB）和骶骨点（移动支点，亨森结，S2/尾骨处的残迹）。",
            "generalPalpation": "“Hola”（强大的脊索下行生长波）与“零点上升”（端脑化上行力量和颅骨扶正）相结合。",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "笔直而僵硬的定向推力（脊索）牵引着不动的颅中央极。"
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "被视为一个吸吮和吸引的场域（“松弛场”）。细胞猛烈地沉入原条。"
                }
            ],
            "therapistPosture": "激光束：手放在枕骨下方，与蝶枕结合（零点）接触，另一只手放在骶骨下方（骶骨点/原始线）。没有机械操作：寻求寂静（“无为”）、“汇合点”和蝶枕结合的动态不动性。",
            "psychosomatic": "结论 = 健康轴和跨代。偏差或阻塞会冻结脊索上的祖先图像。通过将活动点（骶骨）重新连接到其固定的参考支点（零点），治疗师感知到波动的重新启动，并允许身体摆脱其获得的损伤并重新组织。"
        }
    },
    {
        "id": "j-21-22",
        "dayLabel": "第21至22天",
        "period": "第4周开始",
        "title": "神经管形成，眼睛和心脏",
        "generalDescription": "脊索作为电中心，减缓了中央生长，外胚层凹陷形成神经沟。心脏开始跳动。",
        "events": [
            {
                "order": 1,
                "layer": "L'Oeil",
                "movement": "间脑扩张",
                "description": "与原始心跳同步，大脑产生横向扩张，形成原发性视泡。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "早期心血管生成",
                "description": "心脏开始形成（原始主动脉和基底静脉在顶区出现）。它将在第21/22天开始跳动。"
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": [
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ralentissement Notochordal]:::global --> B(Gouttière Neurale):::ecto\n  B --> C[Expansion Diencéphalique<br/>Futurs Yeux]:::ecto",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  D[Zone Apicale Mésodermique]:::meso --> E(Aortes Primitives):::meso\n  E --> F[Début Battements J21/J22]:::meso"
        ],
        "practicalIntegration": {
            "fulcrums": "蝶骨大孔（SSB，零点）、脑岛（大脑倾斜的连接点）、前神经孔和心脏。",
            "generalPalpation": "“大脑太极”。感知到闪电般的扩张，随后是头部第一次骤然弯曲，围绕心脏的中心固定点盘绕。",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "爆发性、逃逸性以及巨大的侧向和背向体积扩张（头化）。神经嵴向面部和神经丛迁移流动的感受。"
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "僵硬的缰索。两条外侧主动脉起到系带的作用（组织难以跟上神经的生长）。心脏化将整个系统猛烈地拉向中心。"
                }
            ],
            "therapistPosture": "绝对中立（“交汇点”）。包容性颅骨抓持，“如同盛满水的碗”。辅助CV4（第四脑室压缩）技术，以重新平衡颅内和颅外脑脊液（B区）。",
            "psychosomatic": "Verdict = 信息的中心——心脏。大的褶皱将大脑、上肢（手）的原基、眼睛（视板）和嘴巴/声音（鳃弓）**直接放置在跳动的心脏组织上**。身心关联是主要的：我们用自己心脏的内在信息去看、去触摸和去说话。"
        }
    },
    {
        "id": "j-22-28",
        "dayLabel": "第22至28天",
        "period": "第四周",
        "title": "大动力瀑布",
        "generalDescription": "这是胚胎折叠（弯曲）的时间和机械顺序，由血管阻力对抗背侧神经的爆发性生长引起。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "中央头化",
                "description": "外胚层上胚层（未来的中枢大脑）开始以爆炸性的速度向顶极生长。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "心脏化（血管制动）",
                "description": "血管中胚层组织（主动脉）的生长速度要慢得多。在羊膜腔的推动和该系统的机械制动下，大脑向前卷曲。强烈的屈曲使两个分开的心内膜管相遇，通过腐蚀场（心内膜融合）迫使中线组织消失。"
            },
            {
                "order": 3,
                "layer": "Le Mésoderme",
                "movement": "心脏环化与膈化",
                "description": "融合的心脏不再有空间：它进行三维体积跳跃（循环，心室系统翻转到心房下方）。大脑的持续生长将头部字面上放在心脏上，心脏压迫卵黄囊的上部。这些受压的间充质细胞形成横膈膜（膈肌的雏形）。"
            },
            {
                "order": 4,
                "layer": "L'Endoderme",
                "movement": "解离与肝化",
                "description": "新形成的膈肌形成了一道屏障。在其下方，强大的卵黄静脉洪流汇集并充血于中胚层。局部拉长在肠道连接处后方形成了一个抽吸真空（松弛场）。消化内胚层的上皮被吸入充血区并出芽/分形：这就是肝脏的诞生（肝脏首先用于捕获胚胎废物的渗出物）。"
            },
            {
                "order": 5,
                "layer": "L'Endoderme",
                "movement": "肝脏腹膜马达",
                "description": "由流体组织，肝脏以巨大的空间生长向右（不旋转）爆发。这种巨大的推力成为腹部的机械动力：它将胃推向左侧（使其旋转），并有助于形成网膜囊的后腔。"
            },
            {
                "order": 6,
                "layer": "L'Endoderme",
                "movement": "气化与吸入动力学",
                "description": "胚胎的伸直创造了一个强大的真空（胸腔“松弛场”）。内胚层上皮在中胚层内塌陷（内陷），分化（主支气管），然后在未来的肺门处进行螺旋旋转倾斜（上部向后，下部向前，外旋）。"
            },
            {
                "order": 7,
                "layer": "Le Mésoderme",
                "movement": "性腺化/肾脏化",
                "description": "巨大的肝脏空间生长（伴随着肾上腺的上升）迫使生殖嵴向下，并决定了形成肾脏和性腺的 Wolff 管和 Müller 管。"
            }
        ],
        "themeColor": "bg-orange-900",
        "mermaidCode": [
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Céphalisation Explosive Ectodermique]:::ecto -->|Frein des Aortes| B(Cardialisation et Fusion):::meso\n  B -->|Looping & Redressement| C{Compression de la masse et<br/>Diaphragmatisation}:::meso\n  C --> D[Congestion Veineuse Inférieure]:::meso",
            "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  D[Congestion Veineuse Inférieure]:::meso -->|Loosing Field Aspiration| E(Fractalisation Endodermique<br/>Hépatisation):::endo\n  E -->|Croissance spatiale Droite| F[Basculement Estomac & Cavité Péritonéale]:::global\n  C{Compression de la masse et<br/>Diaphragmatisation}:::meso -->|Nouveau Loosing Field| G(Pneumatisation Pulmonaire):::endo\n  F --> H[Poussée sur la Crête Génitale]:::meso"
        ],
        "practicalIntegration": {
            "fulcrums": "横膈膜（未来的膈肌/心包）、肝胆重心（肝脏）、Winslow孔（网膜囊入口）和肺门（不对称的关节中心）。",
            "generalPalpation": "级联触诊。追踪胃在腹膜弓内的螺旋滑动，肝胆淤血，然后是肺部的“气泡”，跟随它们的倾斜（外旋，上部向后，下部向前）。",
            "layerPerceptions": [
                {
                    "layer": "L'Endoderme",
                    "perception": "[胸廓/肺]：肺部的吸气。治疗师感知到一个“气球”，其具有恒定的分压，在支气管/气道频率和周围液体空间之间进行组织氧化交换。"
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "[腹部/消化系统]：抽吸（吸吮，消化系统松弛场），分形萌芽现象，需要整个腹部提供巨大的空间。"
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "膈下血管团充血并严重致密，阻碍其进展（卵黄静脉）。"
                }
            ],
            "therapistPosture": "通过虚空释放：包容下肋骨以处理消化道。对于肺（支点）：后手略低于前手，以完美跟随肺部吸气倾斜轴。",
            "psychosomatic": "诊断 = 净化与未言之物。幼稚的肝脏吸收毒性（未表达的愤怒/门静脉组织挫败感）。肺部（气泡）成为受保护的旧悲伤的储存库，通过特定的密度在手下可感知。胃通过痉挛吸收即时环境。释放这个级联反应就是释放下丘脑的化学物质。"
        }
    },
    {
        "id": "j-28",
        "dayLabel": "第28天",
        "period": "第1个月末",
        "title": "奇妙的同步性",
        "generalDescription": "胚胎头尾卷曲的最终整体机械啮合时刻。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "边缘闭合",
                "description": "神经管完全闭合（后神经孔）。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "腹膜整合",
                "description": "与此同时，外体腔最终被整合并闭合为内体腔（原始腹膜腔）。"
            }
        ],
        "themeColor": "bg-yellow-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enroulement Global Terminal]:::global --> B(Fermeture du Neuropore Postérieur):::ecto\n  A --> C(Intégration Finale du Cœlome Externe):::meso"
    },
    {
        "id": "j-45",
        "dayLabel": "第35天至第2个月",
        "period": "第二个月",
        "title": "体节、肋骨和颅顶",
        "generalDescription": "肌肉骨骼组织围绕神经和心血管轴线致密化。",
        "events": [
            {
                "order": 1,
                "layer": "Le Mésoderme",
                "movement": "肋骨和纵膈",
                "description": "中胚层细胞在血管之间致密化，形成肋骨，肋骨在第45天（胸骨角，纵隔闭合）延长并汇合。"
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "端脑化",
                "description": "硬脑膜的拉伸（大脑的竖立）形成了早期结缔组织颅顶（膜性颅骨）。"
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
        "dayLabel": "直至12岁",
        "period": "产后成熟",
        "title": "出牙与植物性成熟",
        "generalDescription": "胚胎学在开放空间中延续。儿童的姿势和能量学使组织动力学最终定型。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "大脑外部生长（0-6个月）",
                "description": "在最初的6个月里，神经体积会再次翻倍，持续调节着相互膜。"
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "牙齿传感器与姿势（6-10个月）",
                "description": "第一颗牙齿充当固定的机械支点/枢轴，使儿童能够动态地矫正其神经-椎体轴。"
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "上颌骨气化（3岁）",
                "description": "上颌窦充气，肾上腺和阑尾充分发挥其生理功能。"
            },
            {
                "order": 4,
                "layer": "Global",
                "movement": "甲状腺激活（7岁）",
                "description": "甲状腺最终接管了父母热量的散热器（真正的生热理性年龄）。"
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "青春期激活（10-12岁）",
                "description": "活跃的垂体，蝶骨的颅底气化，作为整合成人激素功能的屏障。"
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
