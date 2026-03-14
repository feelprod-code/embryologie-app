import type { StageDataV2 } from './embryologie';


export const detailedStages: StageDataV2[] = [
    {
        "id": "j-0",
        "dayLabel": "1日目より前",
        "period": "受胎前期間と成熟",
        "title": "極性、準備、情報",
        "generalDescription": "卵母細胞は中立ではありません。卵胞内で成熟するにつれて、それは母親の全身の体液に浸され、生化学的および感情的な環境に染み込みます。",
        "events": [
            {
                "order": 1,
                "layer": "N/A",
                "movement": "成熟と世代を超えたインプリント",
                "description": "卵母細胞のストックは子宮内で形成される。感情的なショックや母体の血流の質は、すでにこれらの細胞に影響を与えている。卵母細胞は、母親だけでなく祖母のストレスも取り込んでいる。"
            },
            {
                "order": 2,
                "layer": "N/A",
                "movement": "ヴォルパートの旗（集中）",
                "description": "非対称な代謝軸の確立。母体のタンパク質とメッセンジャーRNAが極性化し、核を動物極へと移動させる。これは、受精よりもはるか以前に、基準となる頭尾軸が出現することである。"
            },
            {
                "order": 3,
                "layer": "N/A",
                "movement": "同化極",
                "description": "卵黄（エネルギー貯蔵）と形態形成勾配との分離。細胞骨格が組織化され、受容のために卵母細胞を緊張させる。"
            }
        ],
        "themeColor": "bg-blue-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ovocyte en Maturation]:::global -->|Empreinte Maternelle| B(Fluides et Sécrétions Folliculaires):::global\n  B --> C[Drapeau de Wolpert]:::global\n  C --> D(Axe Crânio-Caudal Originel):::global\n  D --> E[Pôle Synthétique/Noyau]:::global"
    },
    {
        "id": "j-1",
        "dayLabel": "1日目",
        "period": "受精",
        "title": "出会いとカルシウム波",
        "generalDescription": "卵管膨大部で、たった1つの精子が侵入します。それはエネルギーの爆発であり、受肉の絶対的な瞬間です。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "鍵の認識（ZP3）",
                "description": "卵母細胞は、その透明帯のZP3タンパク質を介した酵素認識によって積極的に「選択」します。この段階の不受容または短絡（例：体外受精）は、J1の自然な電気的瘢痕を生成しません。"
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "電磁ショック",
                "description": "侵入するとすぐに、即座の電気的反転（多精子受精のブロック）と亜鉛の爆発的な放出が起こる。卵母細胞は減数分裂を完了する。"
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "大規模なカルシウム波",
                "description": "カルシウムの奔流によって指示された、細胞骨格の完全かつ劇的な再編成。これは、頭尾軸（後にS2/尾骨に投射され、心臓に連結される痕跡）を固定する生命の火花である。"
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "感覚情報の座",
                "description": "物理的な眼は存在しないが、中枢神経系と間脳の極性は、この瞬間に生成される電場にその基盤を見出す。"
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Fécondation]:::global -->|Reconnaissance ZP3| B(Inversion Électrique):::global\n  B --> C[Libération du Zinc]:::global\n  C --> D{Vague Calcique Explosive}:::global\n  D --> E(Réorganisation Cytosquelette):::global\n  D --> F(Cristallisation de l'Axe Central):::global",
        "practicalIntegration": {
            "fulcrums": "心臓のエピジェネティックな起源：受精のエネルギー痕跡がS2/尾骨まで下降する。心臓-尾骨軸は、現在の心臓をその受胎源に結びつける。",
            "generalPalpation": "顔面空間における心臓組織の可動性診断：顔面収縮期（垂直化、過活動、疲弊）対 顔面拡張期（水平化、虚脱、尾骨への根源的エネルギーの探求）。",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "原初の波、元々の縦軸に沿って配向された非常に長い振幅の変動。"
                }
            ],
            "therapistPosture": "下側の手は骨盤の下（仙骨2番／尾骨、軸の原点となる場所）に、上側の手は心臓の軸（ルイ角）に置く。目的は、心臓組織をその尾骨の「ブループリント」に再接続することである。",
            "psychosomatic": "評決 = 出会いと世代を超えた情報。卵母細胞はZP3鍵を認識する。これは「原初の傷跡」の瞬間である。心臓のフィールドによる、そして心臓のフィールドを用いた治療。"
        }
    },
    {
        "id": "j-1-4",
        "dayLabel": "1日目から4日目",
        "period": "第1週",
        "title": "根本的な停滞と分裂",
        "generalDescription": "接合子は、全体の体積を増やすことなく、密着しながら一連の増殖を行う。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "透明帯の監獄",
                "description": "システムはこの殻の中に閉じ込められています。接合子は2、次に4、8、16細胞（桑実胚）へと分裂します。成長空間の欠如は、莫大な潜在的エネルギー圧を生み出します。"
            },
            {
                "order": 2,
                "layer": "Global",
                "movement": "代謝爆発（表面積の増加）",
                "description": "体積が同じであれば、膜表面積は指数関数的に増加します。この極端な膜の集中は、細胞の活動と呼吸を飛躍的に高めます。"
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "胚盤胞腔の誕生（初期の消化器系モーター）",
                "description": "この加圧された分裂の間、細胞は液体滲出液（最初の老廃物）を排出します。この液体は割球を外側（栄養膜）に押しやり、胚盤腔を形成します。この腔は、消化器系と吸収の最初の非対称的な始まりです。"
            },
            {
                "order": 4,
                "layer": "L'Ectoderme",
                "movement": "胚の中心軸と集中化",
                "description": "一方に集積した細胞（胚盤）は、後に神経系と皮膚になる有名な円盤の基礎を密かに準備します。"
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "破裂と孵化（4日目）",
                "description": "液体の管腔内圧と増殖により、状況は維持できなくなる。胚は透明帯を破ってそこから脱出し、母体に定着する準備を整える。"
            }
        ],
        "themeColor": "bg-indigo-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Zygote]:::global --> B(Divisions sans Croissance Volumétrique):::global\n  B -->|Augmentation Surface Membranaire| C[Pression Métabolique & Energétique]:::global\n  C -->|Rejet d'Exsudat Liquidien| D(Blastocèle<br/>Apparition Endoderme):::endo\n  D --> E[Concentration du Bouton Embryonnaire]:::ecto\n  E --> F{Éclosion Radicale J4/J5}:::global",
        "practicalIntegration": {
            "fulcrums": "原始的な頭尾軸と「圧力のエンベロープ」。内臓の緊張の起源としての初期の胚盤腔。",
            "generalPalpation": "組織の拡張を伴わない代謝の緻密化。縦方向の変動が妨げられているという知覚、そして深部組織レベルでの「解放/開花」の探求。",
            "layerPerceptions": [
                {
                    "layer": "Global",
                    "perception": "純粋に膜（透明帯）と自己分泌性の液体（圧力場）の働き。"
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "液体の蓄積と流出のダイナミクス（内胚葉の吸収と排泄の生理学の始まり）。"
                }
            ],
            "therapistPosture": "非対称な存在の位置、全体的な手は、まだ識別できないボリューム全体を捉えている。",
            "psychosomatic": "Verdict = 閉じ込め、待機、そして蓄積。大いなる「解放」の前の保持のダイナミクス。"
        }
    },
    {
        "id": "j-5-8",
        "dayLabel": "5日目から8日目",
        "period": "第1週末〜第2週初頭",
        "title": "孵化と着床",
        "generalDescription": "胚は子宮に到達する。同化極に導かれ、酸を放出して子宮粘膜に埋没する（微小出血）。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "着床と滲出液",
                "description": "第二の腔である羊膜腔（脳脊髄液の前駆体であり、母親との関係がある）の液体滲出液による突然の形成。"
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "地形分化",
                "description": "胚盤は二層性胚盤に分離する。上部の細胞はエピブラスト（将来の神経系）を形成する。"
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "地形分化",
                "description": "下向き（胚盤葉下層へ向かう）細胞は、下胚葉（将来の直接的な消化器系）を形成する。"
            },
            {
                "order": 4,
                "layer": "L'Oeil",
                "movement": "J7：原始CSF",
                "description": "羊膜腔の出現。原始羊水は、将来の神経管と間脳（眼の起源）を満たす最初の脳脊髄液を形成する。"
            },
            {
                "order": 5,
                "layer": "L'Oeil",
                "movement": "J8：象徴的形態学",
                "description": "粘膜に埋め込まれ、滲出液が羊膜嚢を形成する際、その構造の形状は象徴的に眼を想起させる。"
            }
        ],
        "themeColor": "bg-rose-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enfouissement Utérin]:::global --> B(Exsudat Cavité Amniotique):::global\n  A --> C{Séparation Didermique}:::global\n  C --> D[Épiblaste<br/>Ectoderme Primitif]:::ecto\n  C --> E[Hypoblaste<br/>Endoderme Primitif]:::endo",
        "practicalIntegration": {
            "fulcrums": "ゾーンB（身体を取り巻くエネルギー場、元の羊膜腔の痕跡）と胚柄。",
            "generalPalpation": "浸透と透過の動き。周辺（母体）から中心への体液の統合。滲出液の両側性圧の出現。",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "上方、澄んだ保護的な羊水、すなわち脳脊髄液の前駆体へと向かう配向。"
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "下方への配向、栄養を求める組織（卵黄嚢）、異なる液体の密度。"
                }
            ],
            "therapistPosture": "広いエンベロープ（ゾーンB）の聴診。身体と子宮を取り巻く液状空間の知覚。",
            "psychosomatic": "評決 = 受容体と熱への受肉。流産または非受容の場合、深い問題となる。子宮内環境を落ち着かせるための粘膜のクレンジング（骨盤ガストリンの放出）。"
        }
    },
    {
        "id": "j-7-14",
        "dayLabel": "7日目から14日目",
        "period": "第2週",
        "title": "網状組織と外体腔",
        "generalDescription": "胚の辺縁は母体粘膜内で非常に速く成長し、よりゆっくりと成長する中心の円盤との相対的な引き裂きを引き起こします。",
        "events": [
            {
                "order": 1,
                "layer": "Global",
                "movement": "分化成長",
                "description": "ハウザー膜と、緊張した胚体外網状組織で満たされた線維性腔の出現。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "第3の部屋の作成",
                "description": "クモ膜網は牽引によって屈服し、広範な外体腔の滲出液を生成する。以前の胚盤腔は一次卵黄嚢となる。"
            }
        ],
        "themeColor": "bg-pink-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Croissance Périphérique Différentielle]:::global --> B(Traction Arachnoïdienne):::meso\n  B --> C[Déchirement du Réticulum]:::meso\n  C --> D(Création Cœlome Externe<br/>Mésoderme Extra-Embryonnaire):::meso"
    },
    {
        "id": "j-14-21",
        "dayLabel": "14日目から21日目",
        "period": "第3週",
        "title": "原腸形成と側性",
        "generalDescription": "胚柄の形成により、栄養供給が単一の流れに集中する。胚はS字型になる。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "脊索の痕跡",
                "description": "外胚葉は、栄養の流れの作用を受けてS字型を形成する。原始線条（ヘンゼン結節）と脊索が出現する。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "吸引と陥入",
                "description": "原線条上の吸引場は、上皮細胞（ボトルセル）を吸引し、それらが陥入して外胚葉と内胚葉の間の空間を埋める。これが胚内中胚葉の固有の誕生である。"
            },
            {
                "order": 3,
                "layer": "Global",
                "movement": "線毛回転",
                "description": "ヘンゼン結節の奥深くでは、繊毛が60°回転し（結節流）、左側にシグナルを送り、将来の臓器の非対称性を決定します。"
            }
        ],
        "themeColor": "bg-red-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ligne Primitive]:::ecto --> B(Champ d'Aspiration):::ecto\n  B --> C[Invagination Bottle Cells]:::meso\n  C --> D(Naissance du Mésoderme 3ème Tissu):::meso\n  A --> E[Rotation Ciliaire 60°]:::global\n  E --> F(Asymétrie Gauche-Droite):::global",
        "practicalIntegration": {
            "fulcrums": "原始的な胚の頭蓋仙骨軸（脊索）。2つの極の間の張力：ゼロ点（固定された支点、蝶形後頭底結合/SSB）と仙骨点（可動支点、ヘンゼン結節、S2/尾骨の痕跡）。",
            "generalPalpation": "「ホラ」（強力な脊索下降成長波）と「ゼロ点の上昇」（上向きの終脳化と頭蓋の直立化の力）の組み合わせ。",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "不動の中心頭極を牽引する、直線的で硬い方向性のある推進力（脊索）。"
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "吸引と吸気の場（「ルージング・フィールド」）として認識される。細胞は原始窩に激しく沈み込む。"
                }
            ],
            "therapistPosture": "レーザーレイ：後頭骨下の手がSSB（ゼロ点）に接触し、仙骨下の手が仙骨（仙骨点／原始線）に接触する。機械的な操作は行わない。「無為」の沈黙、「ミーティングポイント」、そしてSSBの動的静止を追求する。",
            "psychosomatic": "Verdict = 健康軸と世代間。逸脱や閉塞は、脊索に沿った祖先のイメージを凍結させます。可動点（仙骨）をその基準となる固定された支点（ゼロ点）に再接続することで、治療者は変動の再開を知覚し、身体が獲得した損傷から解放され、再編成されることを可能にします。"
        }
    },
    {
        "id": "j-21-22",
        "dayLabel": "21日目から22日目",
        "period": "第4週目開始",
        "title": "神経胚形成、眼、心臓",
        "generalDescription": "脊索は電気的な中心として機能し、中心の成長を遅らせ、外胚葉は神経溝へと陥入する。心臓が拍動を開始する。",
        "events": [
            {
                "order": 1,
                "layer": "L'Oeil",
                "movement": "間脳の拡張",
                "description": "原始の心拍動と同期して、脳は側方への拡張を生み出し、一次視神経胞を形成する。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "初期心臓発生",
                "description": "心臓が形成され始める（原始大動脈と主静脈が頂端領域に出現する）。心臓は21日目/22日目に拍動を開始する。"
            }
        ],
        "themeColor": "bg-purple-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Ralentissement Notochordal]:::global --> B(Gouttière Neurale):::ecto\n  B --> C[Expansion Diencéphalique<br/>Futurs Yeux]:::ecto\n  B ~~~ D\n  D[Zone Apicale Mésodermique]:::meso --> E(Aortes Primitives):::meso\n  E --> F[Début Battements J21/J22]:::meso",
        "practicalIntegration": {
            "fulcrums": "蝶形後頭底結合（SSB、ゼロポイント）、島（脳の傾きのヒッチポイント）、前神経孔、そして心臓。",
            "generalPalpation": "「脳の太極拳」。心臓の中心にある固定点への、雷鳴のような拡張の知覚に続く、発作的な巻き込みによる最初の頭部屈曲。",
            "layerPerceptions": [
                {
                    "layer": "L'Ectoderme",
                    "perception": "爆発性、逃避、そして側方および背方への巨大な体積膨張（頭部形成）。神経堤が顔面と神経叢に向かって移動するような感覚。"
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "硬い手綱。2つの側方大動脈が係留索として機能する（組織は神経の成長に追いつくのに苦労する）。心臓化は、システム全体を中央に向かって激しく牽引する。"
                }
            ],
            "therapistPosture": "絶対的な中立性（「ミーティングポイント」）。「縁まで満たされた水のボウルのように」頭蓋を包み込むような把持。頭蓋内および頭蓋外の脳脊髄液（CSF）のバランスを再調整するためのCV4テクニック（第4脳室圧迫）の補助（ゾーンB）。",
            "psychosomatic": "評決＝情報伝達者としての心臓。大きなひだは、脳、上肢の原基（手）、目（視板）、口/声（鰓弓）を、拍動する心臓組織の上に文字通り沈着させる。心身相関は重要である。人は自分自身の心臓の「情報」をもって見、触れ、話すのである。"
        }
    },
    {
        "id": "j-22-28",
        "dayLabel": "22日目から28日目",
        "period": "第4週",
        "title": "大いなる運動の連鎖",
        "generalDescription": "これは、爆発的な背側神経成長に直面した血管抵抗によって引き起こされる、胚のひだ（屈曲）の時系列的な機械的順序である。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "中心のセファリゼーション",
                "description": "外胚葉性エピブラスト（将来の中枢脳）は、頂端極に向かって爆発的な速度で成長し始める。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "心臓化（血管のフレナム）",
                "description": "中胚葉性血管組織（大動脈）の成長ははるかに遅い。羊膜腔に押され、このシステムによって機械的に抑制されることで、脳は前方に巻き込まれる。強力な屈曲により、離れていた2つの心内膜管が合流し、腐食場（心内膜融合）によって正中組織が消失する。"
            },
            {
                "order": 3,
                "layer": "Le Mésoderme",
                "movement": "心臓のルーピングと横隔膜形成",
                "description": "融合した心臓にはもはや空間がなく、3次元的な体積の跳躍（ルーピング、心室系が心房の下に反転する）を行う。脳の継続的な成長により、頭部は文字通り心臓の上に置かれ、心臓は卵黄嚢の上部を圧迫する。これらの圧迫された間葉系細胞が横中隔（横隔膜の原基）を形成する。"
            },
            {
                "order": 4,
                "layer": "L'Endoderme",
                "movement": "脱同化と肝臓化",
                "description": "形成されたばかりの横隔膜が障壁となる。その下では、卵黄静脈の強力な流れが蓄積し、中胚葉をうっ血させる。局所的な伸長は、腸の接合部に後方吸引の真空（ルージングフィールド）を作り出す。消化管内胚葉の上皮はうっ血に吸い込まれ、芽を出し/フラクタル化する。これが肝臓の誕生である（肝臓はまず胚の老廃物の滲出液を捕捉する役割を果たす）。"
            },
            {
                "order": 5,
                "layer": "L'Endoderme",
                "movement": "肝臓の腹膜モーター",
                "description": "流れによって組織された肝臓は、空間的に大規模な成長を爆発的に起こし、排他的に右側へと向かいます（回転することなく）。この巨大な推進力は、腹部の機械的エンジンとなり、胃を左側へと押しやり（回転を促し）、大網の裏腔を深くするのを助けます。"
            },
            {
                "order": 6,
                "layer": "L'Endoderme",
                "movement": "気化と吸引のダイナミクス",
                "description": "胚の直立化は、強力な真空（胸部の「ルーシングフィールド」）を生み出す。内胚葉上皮は中胚葉内で陥没（陥入）し、分岐（主気管支）した後、将来の肺門部で螺旋状の回転傾斜（上部は後方へ、下部は前方へ、外旋）を行う。"
            },
            {
                "order": 7,
                "layer": "Le Mésoderme",
                "movement": "生殖腺形成／腎臓形成",
                "description": "肝臓の巨大な空間的成長（副腎の上昇と相まって）は、生殖腺稜を下方へ押しやり、ウォルフ管とミュラー管が腎臓と生殖腺を形成するのを決定します。"
            }
        ],
        "themeColor": "bg-orange-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Céphalisation Explosive Ectodermique]:::ecto -->|Frein des Aortes| B(Cardialisation et Fusion):::meso\n  B -->|Looping & Redressement| C{Compression de la masse et<br/>Diaphragmatisation}:::meso\n  C --> D[Congestion Veineuse Inférieure]:::meso\n  D -->|Loosing Field Aspiration| E(Fractalisation Endodermique<br/>Hépatisation):::endo\n  E -->|Croissance spatiale Droite| F[Basculement Estomac & Cavité Péritonéale]:::global\n  C -->|Nouveau Loosing Field| G(Pneumatisation Pulmonaire):::endo\n  F --> H[Poussée sur la Crête Génitale]:::meso",
        "practicalIntegration": {
            "fulcrums": "横中隔（将来の横隔膜／心膜）、肝胆道の重心（肝臓）、ウィンスロー孔（網嚢の入り口）、肺門（非対称な関節の中心）。",
            "generalPalpation": "カスケード触診。胃の腹膜弓内での螺旋状滑動、肝胆道のうっ滞、そして肺の「気泡」（外旋を伴う上部が後方へ、下部が前方への傾き）を追跡する。",
            "layerPerceptions": [
                {
                    "layer": "L'Endoderme",
                    "perception": "[胸郭/肺]: 肺レベルでの吸引。術者は、一定の部分圧を持つ「空気の球」、気管支/気道周波数と周囲の液体空間との間の組織の酸化的交換を知覚する。"
                },
                {
                    "layer": "L'Endoderme",
                    "perception": "[腹部/消化器系]：吸引（吸い込み、消化器系の緩み）、フラクタルな出芽現象で、腹部全体に多大なスペースを必要とする。"
                },
                {
                    "layer": "Le Mésoderme",
                    "perception": "横隔膜の下で鬱血し、重く密になった血管塊がその進行を止めている（卵黄静脈）。"
                }
            ],
            "therapistPosture": "虚空による解放：消化管のために下位肋骨を包み込む。肺（支点）のために：後方の手は、肺の吸引の傾斜軸に完全に沿うように、前方の手よりもわずかに低くする。",
            "psychosomatic": "評決＝浄化と語られないこと。未熟な肝臓は毒性（表現されない怒り／門脈組織のフラストレーション）を捉える。肺（気泡）は、古い保護された悲しみの貯蔵庫となり、それは手の下で特定の密度として知覚される。胃は痙攣によって直接的な環境を吸収する。このカスケードを解放することは、視床下部の化学作用を解放することである。"
        }
    },
    {
        "id": "j-28",
        "dayLabel": "28日目",
        "period": "第1ヶ月の終わり",
        "title": "驚くべき同期性",
        "generalDescription": "胚の頭尾方向への巻き込みの、最終的な全体的機械的開始の瞬間。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "辺縁閉鎖",
                "description": "神経管の完全閉鎖（後神経孔）。"
            },
            {
                "order": 2,
                "layer": "Le Mésoderme",
                "movement": "腹膜の統合",
                "description": "全く同時に、外体腔は最終的に統合され、内体腔（原始腹膜腔）として閉じられる。"
            }
        ],
        "themeColor": "bg-yellow-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Enroulement Global Terminal]:::global --> B(Fermeture du Neuropore Postérieur):::ecto\n  A --> C(Intégration Finale du Cœlome Externe):::meso"
    },
    {
        "id": "j-45",
        "dayLabel": "35日目から2ヶ月まで",
        "period": "2ヶ月目",
        "title": "体節、肋骨、頭蓋冠",
        "generalDescription": "筋骨格系の組織は、神経軸と心血管軸の周囲で密度を高めます。",
        "events": [
            {
                "order": 1,
                "layer": "Le Mésoderme",
                "movement": "肋骨と縦隔",
                "description": "血管間の間葉系細胞の緻密化により肋骨が形成され、肋骨は伸長し、J45で結合する（ルイの胸骨角、縦隔の閉鎖）。"
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "終脳化",
                "description": "硬膜の伸展（立ち上がる脳）は、初期の結合組織性頭蓋冠（膜性頭蓋）を形成する。"
            }
        ],
        "themeColor": "bg-amber-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Rapprochement Côtes Mi-ligne]:::meso --> B(Suture de l'Angle de Louis J45):::meso\n  A --> C[Fermeture du Médiastin]:::meso\n  A ~~~ D\n  D[Redressement Axial]:::global --> E(Tension Dure-Mérienne):::ecto\n  E --> F[Modélisation du Desmocrâne]:::ecto"
    },
    {
        "id": "maturation-12ans",
        "dayLabel": "12歳まで",
        "period": "出生後の成熟",
        "title": "歯列と植物性成熟",
        "generalDescription": "胚発生は、開放された環境で継続する。子供の姿勢とエネルギーは、組織のダイナミクスを完成させる。",
        "events": [
            {
                "order": 1,
                "layer": "L'Ectoderme",
                "movement": "脳の外部成長（0-6ヶ月）",
                "description": "神経の体積は生後6ヶ月でさらに倍増し、相互膜を継続的に調節する。"
            },
            {
                "order": 2,
                "layer": "L'Ectoderme",
                "movement": "歯科センサーと姿勢（生後6～10ヶ月）",
                "description": "最初の歯は、固定された機械的な支点として機能し、子供の神経脊椎軸の動的な直立を可能にします。"
            },
            {
                "order": 3,
                "layer": "L'Endoderme",
                "movement": "上顎洞の含気（3歳）",
                "description": "上顎洞は通気し、副腎と虫垂はその生理機能に完全に係わる。"
            },
            {
                "order": 4,
                "layer": "Global",
                "movement": "甲状腺の活性化（7歳）",
                "description": "甲状腺は、親の熱（真の熱産生的な分別年齢）のラジエーターとしての役割を最終的に引き継ぎます。"
            },
            {
                "order": 5,
                "layer": "Global",
                "movement": "思春期の活性化（10～12歳）",
                "description": "活動的な下垂体、頭蓋底の蝶形骨の気化は、成人のホルモン機能を統合するための衝立となる。"
            }
        ],
        "themeColor": "bg-emerald-900",
        "mermaidCode": "graph TD\n\nclassDef ecto fill:transparent,stroke:#5A9C51,color:#5A9C51,stroke-width:2px,rx:10,ry:10;\nclassDef meso fill:transparent,stroke:#F27D33,color:#F27D33,stroke-width:2px,rx:10,ry:10;\nclassDef endo fill:transparent,stroke:#4171B5,color:#4171B5,stroke-width:2px,rx:10,ry:10;\nclassDef global fill:transparent,stroke:#94a3b8,color:#475569,stroke-width:1px,rx:10,ry:10;\n\n  A[Dentition 6m]:::ecto --> B(Pivot de Redressement Neural):::ecto\n  B ~~~ C\n  C[Pneumatisation Maxillaire 3A]:::endo --> D(Engagement Appendice/Surrénales):::endo\n  D ~~~ E\n  E[Relais Thyroïdien 7A]:::global --> F(Autonomie Calorique):::global\n  F ~~~ G\n  G[Hypophyse Pubertaire 12A]:::global --> H(Pneumatisation Sphénoïdale):::global"
    }
];
