export type PodcastItem = {
    id: string;
    title: string;
    author: string;
    description: string;
    aushaId?: string;       // Utilisé pour embarquer le lecteur Ausha
    audioUrl?: string;      // Utilisé si l'audio est hebergé localement ou ailleurs
    thumbnailUrl: string;   // Image CARREE
    isHighlight?: boolean;  // Pour mettre en avant certains contenus
    transcript?: string;    // Zone de texte défilante pour le PodcastPlayerPage
    externalLink?: string;  // Utilisé pour faire un lien direct (ex: site web) sans ouvrir le lecteur
};

export const podcastsData: PodcastItem[] = [
    {
        id: "pod-tdt-1",
        title: "Techniques Douces Tissulaires avec Philippe Guillaume",
        author: "Marc Damoiseaux",
        description: `Marc Damoiseaux, ostéopathe, a intégré l’embryologie au cœur de l’ostéopathie biodynamique en la rendant vivante, accessible et expérientielle. Dans cet épisode, nous retraçons son parcours singulier, marqué par l’appel du soin et la rencontre déterminante avec Patrick Van Den Heede, dont l’enseignement repose sur la construction du vivant à travers le mouvement et sur la connaissance de soi par la méditation. Cette double approche donne naissance à un véritable chemin d’apprentissage intérieur, où la compréhension du développement embryologique rejoint l’expérience sensible du thérapeute.

C’est une vision à rebours des voies traditionnelles, qui part de la polarité des fluides pour aller jusqu’à la structure, et qui fait naturellement le trait d’union avec l’ostéopathie biodynamique : écouter le mouvement inhérent du vivant pour percevoir le mouvement émergent des tissus. Une cohérence s’installe alors entre l’étude du vivant, la présence méditative et l’art du toucher.

Marc redéfinit des notions essentielles comme le juste pattern, qui consiste à remettre le corps dans sa juste fonction, et le Fulcrum, non plus envisagé comme un levier mais comme un centre organisationnel. Il évoque la puissance embryonnaire encore présente en chacun de nous, qui serait notre homéostasie d’aujourd’hui. Enfin, il nous conduit vers l’axe vital – la ligne primitive, la notochorde – pour y retrouver les principes d’unité, cette dynamique qui relie la chronologie des systèmes, les synchronicités et la lumière du vivant.

Un dialogue rare et inspirant, où l’embryologie devient un art d’écoute du monde intérieur.`,
        aushaId: "6r2X8f6LVNAp",
        audioUrl: "https://audio.ausha.co/6r2X8f6LVNAp.mp3",
        thumbnailUrl: "https://images.ausha.co/covers/0V3K7h4bQpRl/400x400.jpg",
        isHighlight: true,
        transcript: `
00:09 Philippe Guillaume
Bonjour à tous et bienvenue sur le podcast des techniques douces
tissulaires. Je suis Philippe Guillaume, kinésithérapeute et
biokinergiste. Dans cette saison de podcast, je partage avec vous des
approches innovantes qui ont vraiment façonné ma pratique.
Aujourd'hui, je reçois Marc Damoiseau. Marc Damoiseau est un
ostéopathe qui a particulièrement développé l'embryologie au sein
de l'ostéopathie biodynamique. Ce qui est remarquable avec Marc,
c'est qu'il a développé une façon d'enseigner l'embryologie qui la
rend vraiment accessible, compréhensible et vivante. Alors Marc,
bonjour !
00:49 Marc Damoiseaux
Bonjour Guillaume.
00:50 Philippe Guillaume
Comment tu vas ?
00:51 Marc Damoiseaux
Je vais bien, très heureux de partager ce podcast avec toi.
00:55 Philippe Guillaume
plaisir hautement partagé. Pour commencer, est-ce que tu peux
présenter ton approche ?
01:01 Marc Damoiseaux
Mon approche est une étude d'abord de l'embryologie en
mouvement. C'est la morphodynamique. C'est une dynamique qui
permet de comprendre comment le corps se développe à partir d'une
petite cellule dans un processus de croissance et de voir comment ça
peut s'impliquer dans notre pratique.


01:18 Philippe Guillaume
Qu'est-ce qui t'a amené vers le soin ?
01:21 Marc Damoiseaux
Je pense que c'est quelque chose que j'ai toujours eu, que j'ai
toujours voulu. Je ne sais pas l'expliquer, mais c'est quelque chose
qui fait partie de ma qualité d'être. Vers l'âge de 10-12 ans, j'ai eu la
chance d'avoir eu mal au dos. Mon père ou ma maman, je ne me
souviens plus exactement, m'ont amené chez un ostéopathe. Et
quand je suis sorti de cette séance d'ostéopathie, j'ai encore cette
vision sur la route où tout d'un coup, j'ai eu un moment lumineux. Et
je me suis dit, un jour, je serai ostéopathe. C'était devenu clair. Après,
une fois que tu as ce choix qui s'est fait, tout s'est organisé pour que
ça se mette sur mon chemin. Très vite, j'ai pu rencontrer des
personnes adéquates.
02:03 Marc Damoiseaux
J'ai commencé d'abord par faire la kinésithérapie. Ça s'enseigne à
l'université en Belgique, en 6 ans.
02:08 Philippe Guillaume
Qu'est-ce que tu en as tiré de tes études de kinésithérapie ?
02:11 Marc Damoiseaux
La découverte de la main, la découverte de la base, la kiné, nous
amènent aussi à un traitement merveilleux. Mais on travaille avec les
mouvements majeurs, tandis que l'ostéopathie nous amène à traiter
les mouvements mineurs. Et ça, c'est très important parce que c'est
les mouvements mineurs qui, fondamentalement, vont permettre la


dynamique du mouvement majeur. Et donc, ça allait retraiter parfois
simplement une articulation ou un point spécifique afin de redonner
la fluidité du mouvement. Donc, la grande différence avec l'approche
ostéopathique, c'est qu'elle m'a amené à découvrir des choses de
plus en plus fines et plus précises, parce que ça, ça prend du temps.
02:51 Philippe Guillaume
Je crois d'ailleurs que tu as fait une rencontre qui pour toi a tout
changé.
02:55 Marc Damoiseaux
J'ai eu la chance de rencontrer un mentor ou mon maître en
ostéopathie qui s'appelle Patrick Van Den Heide.
03:01 Philippe Guillaume
Patrick, il enseignait quoi exactement en ostéopathie ?
03:04 Marc Damoiseaux
Lui, il enseignait le viscéral. J'ai découvert que c'était tout à fait
passionnant et que j'ai compris vraiment l'impact que ça pouvait
avoir sur la structure. un oesophage au niveau du diaphragme.
03:18 Philippe Guillaume
Je crois d'ailleurs que Patrick avait une particularité dans son
enseignement.
03:23 Marc Damoiseaux
Tout commençait par l'embryologie. Il m'avait donné une espèce de
carte de travail en me disant, dans un premier temps, tu vas
comprendre ce que c'est l'embryologie, qui peut servir à comprendre
comment se construit l'anatomie. Et puis de là, j'ai compris que la


base de l'anatomie, c'est l'embryologie. L'atomie, c'est un
mouvement embryonnaire. Et donc ça t'amène déjà à comprendre
qu'il y a un mouvement, et ce mouvement te permet petit à petit de
comprendre qu'il y a aussi une physiologie, mais qu'il y a une
physiologie donnée par le mouvement. Dans les facultés où on
apprend l'anatomie, on commence par la structure dense. On
commence par étudier l'os, auquel on va rajouter les ligaments, les
muscles, les vaisseaux, etc.


04:06 Marc Damoiseaux
Mais si on regarde comment s'est construit réellement l'anatomie, on
voit que l'os, en fait, c'est quelque chose qui apparaît plus tard, et qui
est presque une finalité de l'embryologie. Si on regarde depuis le
début, on se rend compte qu'on est construit presque de façon
fluidique, et même si on va plus loin et qu'on accepte ça, on est
presque construit sur des champs électriques, des champs de
polarité. Et donc tout le travail que j'ai fait, c'est de comprendre
comment un individu se construit, de trouver les lignes de force, les
directions, la croissance, et ça m'a donné une représentation mentale
de l'anatomie qui est différente de ce qu'on m'a enseigné lorsque
j'étais en kiné, qui est une anatomie qui est en perpétuel mouvement.
Ce mouvement, c'est un mouvement encore qui a été lancé par la
force embryonnaire. En médecine, ils ne l'étudient pas. Ça ne fait pas
partie de leur cursus. J'ai même commencé mon premier cours avec
Patrick avant de commencer l'ostéo. Et donc moi, je me suis retrouvé
en études d'ostéo avec Patrick,
05:03 Marc Damoiseaux
que je pouvais suivre dans tous ses cours, toute cette façon de voir. Et
je me rendais compte, je me dis, mais ici, je suis un peu en décalage.
Ils n'apprennent pas du tout comme ça, en fait.
05:11 Philippe Guillaume
Patrick avant de faire de l'ostéopathie.
05:14 Marc Damoiseaux
En kiné, j'étais amené à travailler dans un hôpital et là il y avait
Françoise, Françoise Girand, qui est devenue une très grande amie,
qui était mon maître de stage et qui en fait était en études
d'ostéopathie. Elle a commencé à m'expliquer en me disant, tu sais, il


existe une espèce de mouvement qu'on appelle le mouvement
respiratoire primaire. Je ne connaissais absolument pas ça. Alors,
est-ce que tu veux le sentir ? Elle s'est mise au niveau de mon crâne,
elle a déposé ses mains. J'ai perçu quelque chose de différent.
Ensuite, elle m'a demandé de déposer les mains sur son crâne. J'ai
perçu un autre mouvement que je ne connaissais pas, qui était
comme simplement quelque chose qui pouvait se gonfler ou se
dégonfler. Voilà, c'était juste ça, ma première approche sur le crâne.
Tout d'un coup, j'ai senti qu'il y avait une vague, un souffle qui
traversait, mais qui était...
06:05 Marc Damoiseaux
fluctuant. J'ai terminé mes études de kiné. Et puis, je voulais
commencer tout de suite l'ostéopathie. Et là-dessus, mon amie
Françoise m'a dit, si tu veux, tu peux aller suivre un cours avec lui. Je
lui ai dit, mais je ne suis pas ostéo. Non, mais il t'accède. Voilà, tu vas
te retrouver avec tous les anciens ostéos. Et là, j'ai commencé mon
chemin avec Patrick, qui n'est pas encore fini. Et c'est là où l'impulse
de l'étude de l'embryologie et de vouloir comprendre l'embryologie...
est venue. Et Patrick nous a fait goûter un petit peu à une ostéopathie
plus énergétique. Comment fonctionnait la médecine chinoise ?
Comment fonctionnait la médecine hervédique ? Le prana, etc. Que
tout ça, ça s'intégrait dans une pratique de thérapeute, si tu veux.
06:48 Philippe Guillaume
pour mieux se connaître en fait.
06:50 Marc Damoiseaux
Pour apprendre à bien se connaître, il faut apprendre à méditer. Et
donc très vite, il nous a enseigné la méditation. Et la méditation, c'est
apprendre à développer une qualité de l'attention,


07:00 Marc Damoiseaux
une qualité de vigilance et surtout une qualité de présence. Parce
qu'en fait, qu'est-ce qu'on peut offrir réellement à nos patients ?
Parce que la plupart du temps, les gens cherchent des techniques.
Mais s'il n'y a pas une présence, la qualité de présence de la
technique, elle ne va pas servir à grand-chose. Donc c'est cette
association. Dès le début, j'ai été plongé dans la pratique de la
méditation et de l'embryologie, et puis toute cette approche
énergétique que j'ai pu apprendre avec Luc.
07:31 Philippe Guillaume
Tu es en train de faire un chemin complètement inverse par rapport à
ce qui se fait traditionnellement. Car un élève va souvent apprendre
une ostéopathie mécanique, va améliorer sa gestuelle pour avoir une
ostéopathie plus fine. Dans certains cas, certains vont évoluer vers
l'énergie pour avoir un champ d'application plus large, des suites
opératoires.
08:01 Philippe Guillaume
Des problèmes psychosomatiques. Et certains qui vont buter à avoir
un problème d'efficacité ou être en résonance avec le patient, vont
devoir modifier leur posture et faire un travail personnel. Mais
apprendre la méditation depuis le début, c'est très très rare. Et
surtout, cette approche énergétique que tu fais d'entrée de jeu.
Puisque l'embryologie, on part d'une polarité. Donc c'est très très
riche cet enseignement que tu as.
08:39 Marc Damoiseaux
C'est comme ça que ça s'est présenté à moi.


08:41 Philippe Guillaume
Et tu l'as accepté tout de suite.


08:43 Marc Damoiseaux
Dans mes études de kiné, j'ai été passionné par les arts martiaux. Et je
pense que les arts martiaux m'ont très vite amené à comprendre
qu'en fait, on doit d'abord apprendre à voir comment on fonctionne
soi-même. Et donc, toute cette approche un peu dite énergétique,
entre guillemets, je l'ai découvert très tôt aussi par un maître chinois,
taoïste,
09:02 Marc Damoiseaux
où je voulais apprendre à savoir me battre. Et en fait, j'avais pu aller
chez lui. C'était un tout vieux maître, Kochi, je crois. Il m'a mis assis et
il m'a dit, je vais t'apprendre d'abord à respirer. Et je vais t'apprendre
à sentir ton centre de gravité. Et ça a pris des jours et des semaines et
des mois d'apprentissage jusqu'à ce que tout d'un coup, j'ai
découvert qu'est-ce que ça voulait dire être dans son centre de
gravité. Et là, j'ai compris qu'il y avait une circulation d'énergie dans le
corps.
09:32 Philippe Guillaume
bien avant de faire l'oséopathie.
09:34 Marc Damoiseaux
Oui, bien avant.
09:35 Philippe Guillaume
Donc, quand tu as retrouvé Patrick, du coup...
09:37 Marc Damoiseaux
C'était dans la suite, quoi, tu vois. C'est un homme qui a une espèce
de puits de science, comme ça, dans plusieurs domaines, avec une
qualité d'écoute et une qualité de présence qui, rien que quand il


rentre dans la pièce, la pièce s'ouvre.
09:49 Philippe Guillaume
Comment il te l'a fait comprendre au début de l'embryologie ?
09:53 Marc Damoiseaux
Si par exemple on parlait d'un estomac ou on parlait du foie, il
expliquait d'abord l'origine embryologique.
09:59 Philippe Guillaume
L'embryologie, on peut la dater, c'est de quand à quand exactement.
10:03 Marc Damoiseaux
Il y a déjà des choses qui se préparent pour ça. La période
préconceptuelle, le moment crucial, ce sera le moment de
fécondation, un allumage dans la future forme, dans la
morphodynamique. Déjà là, il y a une impulsion de vie qui est très
importante et qui va créer au sein de l'ovocyte un mouvement
calcique qui va créer presque déjà ce qu'on appelle un prépaterne sur
lequel l'individu va se construire. Il n'y a pas encore de forme ou de
structure, mais il y a déjà une impulse dans la direction dans laquelle
ça va se construire.
10:37 Philippe Guillaume
Ça nous amène à combien de... On va dire 3-4 mois, c'est ça ?
10:41 Marc Damoiseaux
Le premier trimestre, on peut dire que toutes les structures nobles,
déjà, sont construites. Après, c'est de la maturité. Il faut vraiment
pouvoir penser croissance, parce que le fait qu'on pense croissance va
nous donner des bons points d'appui. Lorsqu'on étudie dans un livre,


on ne voit pas la croissance. C'est important de pouvoir presque se
l'imaginer et comprendre que ce phénomène-là est fondamental,
11:04 Marc Damoiseaux
et qu'il y a une force, il y a une puissance dans l'individu.
11:07 Philippe Guillaume
mouvement et croissance.
11:08 Marc Damoiseaux
et puissance. C'est comprendre l'origine du tissu, comprendre
l'origine d'un organe. On savait qu'il existe trois tissus embryonnaires,
et on se rend compte que chaque fois qu'il y a l'apparition d'un tissu
embryonnaire, il y a l'apparition d'une cavité. Quand il y a une
deuxième cavité qui va apparaître, par exemple la cavité viteline, on
va voir qu'il y a une deuxième tissu qui commence à se mettre en
place. Donc on se construit autour de cavités, et pas spécialement
d'un tissu. Et donc on se rend compte tout de suite que ça prend une
globalité. Et donc tout de suite, ça m'a amené, quand je touche un
individu, à comprendre que je touche un espace ouvert, si tu veux. Et
donc ça, c'était quelque chose qui m'a tout de suite été enseigné.
11:49 Philippe Guillaume
Une cavité, un champ énergétique, la matière, l'énergie, l'information.
11:54 Marc Damoiseaux
Tout ça va ensemble, c'est pas séparé en fait.
11:56 Philippe Guillaume
C'est assez bien de prendre ça dès le début dans un enseignement.


11:59 Marc Damoiseaux
Mais c'était un peu la chance que j'ai eue, je sentais que c'était juste,
tu comprends ce que je veux dire ?
12:05 Marc Damoiseaux
Je sentais qu'elle me disait, ben oui, et puis je me suis dit, ben il faut
en fait que je comprenne ça. Une grande chance que j'ai eue, c'est que
très vite, j'ai été amené à enseigner. Donc quand j'ai terminé mes
études d'ostéopathie, j'ai pu commencer à donner cours. Et je dirais
que si vous écoutez quelqu'un, en général, vous allez retenir 3-4%. Si
vous le réécoutez, vous allez augmenter un petit peu. Si vous
l'enregistrez, vous le réécoutez encore, vous allez encore aller un petit
peu plus loin. Par contre, si vous l'enseignez, vous allez le retenir et
vous allez l'apprendre. La chance que j'ai eue, c'est d'être tombé un
peu dans l'enseignement très tôt. Ça s'est mis sur mon chemin. Le fait
de l'expliquer, vous commencez à comprendre. Donc je dirais comme
Paolo Coelho, si tu veux comprendre quelque chose, enseigne-le.


13:02 Marc Damoiseaux
Mon étude s'est faite sur l'embryologie, de l'anatomie, de la
physiologie, de la physiopathologie, de la psychologie, de la
philosophie et de la spiritualité. Si je décide d'étudier un organe, je
fais une étude linéaire. Je prends un bouquin d'embryologie,
d'anatomie. De physiologie. Et je les superpose. Parce que quand tu
comprends bien l'embryologie, tu comprends les différents tissus. Et
tu comprends les différentes qualités. Tu vois qu'en fait, tu dois
rentrer dans ce qu'on appelle l'étude de l'histologie. Donc tu
comprends qu'on pourrait résumer ça presque à deux grands types de
tissus. Un tissu épithélial et un tissu conjonctif. Et donc avec tout le
vocabulaire qui va se mettre, tu vas pouvoir te mettre en biochimie,
en physiologie pure ou bien en anatomie. Mais tu connais les tissus, tu
sais où ils sont. Ça revient à la même chose. Donc tu sais que tu es
sous un ectoderme, tu sais que tu es sous un épithélial, tu sais que tu
es sous une structure nerveuse. ...
13:59 Philippe Guillaume
Tout à fait, et je rajoute à cela que cela va changer complètement ce
que l'on a dans les mains au niveau du ressenti.
14:07 Philippe Guillaume
Lorsqu'on travaille sur un tissu de limite épithélial, on ne sera plus à
même de travailler dans la tensegrité, comme pour remettre une
articulation en place en douceur, tandis que si l'on travaille sur ce
fameux tissu de confort, le tissu conjonctif, on sera plutôt dans un
travail de type fluide d'échange. D'ailleurs Marc, lorsque tu fais cours,
quelle est la première chose que tu vas essayer de faire sentir à tes
élèves ?
14:39 Marc Damoiseaux


La perception qu'on a dans les mains, c'est quelque chose qui évolue
dans le temps. Je ne perçois pas la même chose au début, et
maintenant ça fait 30 ans d'expérience quand je touche un corps.
Donc, je sais qu'il faut du temps, qu'il faut une maturité, qu'il faut
comprendre ce que c'est de la chaleur, qu'est-ce que c'est un
mouvement, etc. On peut dire que, quelque part, l'ostéopathie
s'intéresse à l'énergie aussi.
15:04 Marc Damoiseaux
Ça intéresse presque à la quantité disponible de cette énergie. On
peut dire aussi que le corps a une capacité de régénération. Cette
force qui génère, l'hypothèse qu'on sous-tend, c'est que la force
embryonnaire, c'est la même force. Donc, elle est toujours présente,
de façon différente, mais pour permettre au corps de se régénérer, de
se soigner, de s'auto-guérir. Donc, c'est très important que cette
régulation de cette énergie, petit à petit, ça permet de soigner, de
prévenir aussi, peut-être, les maladies. Donc, ce que je fais dans un
premier temps, j'aime bien leur apprendre à leur faire sentir s'il y a
une fluctuation longitudinelle. Quand on met les mains au niveau des
jambes, par exemple, c'est un peu subtil à décrire, mais c'est comme
une fluctuation qui descend, qui est liée un petit peu à la gravité.
16:00 Marc Damoiseaux
Est-ce que je suis bien les pieds sur terre ? La première chose, c'est
est-ce que je suis ancré ou pas ? Parce que beaucoup, beaucoup de
problèmes viennent d'un mauvais ancrage. On reste trop dans le
mental, par exemple. Donc, j'apprends déjà à essayer de leur faire
sentir s'il y a une fluctuation longitudinelle. Le deuxième plan, c'est
est-ce qu'à partir de là, je peux percevoir si la personne est dans son
axe ou pas ? Est-ce qu'elle est dans son axe de façon visuelle ou dans


son axe de façon perceptuelle ? C'est deux choses. Je peux la
regarder, voir qu'elle est déviée, ou je peux sentir une déviation au
travers des mains, par des tensions qui sont différentes. Le troisième
plan, je vais essayer de percevoir cette qualité d'énergie dans le corps.
Et cette qualité d'énergie, je la ressens sous forme comme d'une...
C'est comme une vibration, comme un petit vombrissement dans les
mains. Est-ce que c'est fort, pas fort ? Est-ce que c'est éteint ? Et la
quatrième chose, quand quelqu'un est à sa place, il est lumineux.
Quand il est bien dans son niveau d'énergie. Parfois, il y a des gens, ou
parfois nous, on est avec quelqu'un qui nous éteint.


17:02 Marc Damoiseaux
On est parfois avec quelqu'un d'autre qui nous allume. Et donc, c'est
sentir un peu ce côté-là, si tu veux, parce que mind, body, spirit, tout
ça, c'est une unité. Je ne peux pas concevoir le corps que comme un
modèle mécanique. Il y a une âme, il y a une émotion, il y a un mental
qui est là. J'intègre tout ça dans une unité. Donc, je ne le sépare pas,
ça apparaît plus ou moins en fonction des personnes. Parfois, il y a
des gens où je sens que c'est vraiment de la structure. Je vais aller
dans la structure. Il y a des gens chez qui, peut-être, il faut d'abord
parler, libérer des non-dits aussi. Donc, je pense que tout ça, c'est une
gloire. Donc, fondamentalement, l'ostéopathie, ça utilise quand
même de l'énergie. Enfin, l'énergie, entre guillemets, il faut
comprendre. Un mouvement, c'est l'énergie. La quantité qui est
disponible. L'utilisation et la régulation de ça afin que ça circule bien.
On peut se poser la question, c'est comment on peut aider le
processus, toi ? En fait, le corps, il est super puissant. C'est
simplement en lui redonnant peut-être certains points d'appui
18:00 Marc Damoiseaux
que le système peut trouver sa meilleure physiologie, donc sa
meilleure homéostasie. Et là, il y a quatre choses qui sont très
importantes. Parce que qu'est-ce que c'est le principe énergétique ?
Et on doit le résumer quand même de façon claire. C'est d'abord avoir
une bonne qualité de sommeil. Une bonne qualité de sommeil, ça
vous donne une bonne énergie. Vous n'êtes pas bien, vous allez
dormir. Si après un traitement ostéopathique, les gens dorment
mieux, c'est un bon travail. Deuxième chose, c'est bien manger. La
diète, quelle qualité de nourriture. C'est l'essence, c'est fondamental.
Et je dirais que si on regarde la chronologie d'apparition des systèmes
de communication, le système endodermique est très primaire. Ça
veut dire que ce qu'on va manger va nous définir. Donc cette


qualité-là, c'est aussi important. Et je voudrais rajouter dans quelque
chose de manger correctement, c'est buvez suffisamment d'eau. On
est dans une société de gens qui sont déshydratés.
19:01 Marc Damoiseaux
Il faut boire en trois, au moins trois, quatre litres d'eau par jour. Et pas
d'un coup, comme un chameau, mais la journée, il faut s'hydrater
doucement. On a besoin d'eau. La bonne physiologie a besoin d'eau.
Et c'est une eau, ce qu'on appelle une eau structurée, qui se met
autour ce qu'on appelle des coquilles d'hydratation moléculaire.
Troisième chose, c'est comment je respire. Cette qualité-là est
fondamentale parce que vous ne pouvez pas tenir cinq minutes sans
respirer. J'ai parlé de Patrick. J'ai aussi eu l'occasion de rencontrer M.
Marc Vufray, qui est ostéopathe suisse, et qui, lui, au départ, est
biologiste. Il s'est tellement intéressé à tout ça qu'il amène même, lui,
le niveau moléculaire dans l'ostéopathie. Parce que la plupart du
temps, les gens confondent la respiration avec la ventilation. Mais la
respiration, c'est quelque chose qui va dans la profondeur et qui se
fait sur le plan cellulaire, sur le plan d'une mitochondrie. Il y en a
beaucoup de mitochondries, et c'est ça où se passe la respiration. Et
on se rend compte que c'est là
20:01 Marc Damoiseaux
l'énergie subtile est donnée en ATP ou en autre. Ce qui est aussi
intéressant à concevoir et observer, c'est que le développement d'un
embryon, dans ses phases initiales, c'est la même phase que le
développement d'un cancer. Alors, je ne dis pas qu'on se développe
comme un cancer, mais on se développe dans les mêmes processus
de fermentation. Au début, il n'y a pas beaucoup d'oxygène, mais on
se développe par fermentation. La recherche, si elle va petit à petit sur
le plan mitochondriel, va donner des effets très intéressants sur la


compréhension de beaucoup de choses. Parce que c'est là où j'ai la
transformation de mon oxygène et de mon alimentation en énergie
pure de l'ATP, redonner de l'énergie pour les protéines. Et pour
redonner... régénération parce que c'est là où ça se passe et la
quatrième chose qui est fondamentale qui est aussi de l'énergie c'est
comment je bouge donc c'est le mouvement donc ça c'est quelque
21:00 Marc Damoiseaux
chose qui est très important c'est ramener les gens à bien manger
qualité de sommeil qualité de mouvement qualité respiratoire si
après un traitement vous améliorez ça et bien vous allez grandement
aider la personne parce que le mind le mental peut se poser quoi
21:17 Philippe Guillaume
Et surtout, c'est un cours qui peut être donné à la fois à un étudiant, à
un patient et à un professionnel de santé, quel que soit son niveau. On
aborde la base, la compréhension du vivant.
21:33 Marc Damoiseaux
C'est simple en fait.
21:34 Philippe Guillaume
Autre chose encore, avant de revenir à...


21:38 Marc Damoiseaux
l'embryologie ? Oui, tout à fait. Ce qui est important, c'est de bien se
rendre compte que l'individu est construit sous forme de sphères, que
ce sont des volumes en fait. Donc vous avez la zone urogenitale, la
zone métabolique péritonéale, la zone rythmique cardio-respiratoire
et la zone neurosensorielle. Et finalement, ce sont des volumes. Donc
il y a une pression
22:01 Marc Damoiseaux
négative au niveau pulmonaire, une pression positive au niveau
péritonéal, une pression négative au niveau urogenital et une
pression, on va dire, de type positif au niveau cérébral. Le système
fonctionne sur l'équilibre de volumique, de juste pression. Très
souvent, chez les personnes âgées qui peuvent avoir des fuites
urinaires ou des pertes au niveau du petit bassin, c'est souvent un
déséquilibre qui se fait au niveau d'un déséquilibre pulmonaire. On
peut rattraper ça de nouveau par la respiration. Donc redonner une
bonne respiration, c'est permettre justement de rééquilibrer ces
volumes. C'est par là que le système de pression négative au niveau
des poumons peut nous redonner une bonne fonction métabolique.
Même nos pensées peuvent être des réactions de volume. Par
exemple, un stress qui peut provoquer un changement au niveau de
l'aldostérone et modifier des comportements dans des sites
particuliers au niveau cérébraux et vous donner des façons de penser.
Donc n'oubliez pas la sphère urogenitale qui est reliée au membre
inférieur qui est le règne minéral sur lequel on doit s'appuyer, notre
réalité, la matrice, la matière, la terre. Et puis
23:06 Marc Damoiseaux
le digestif, l'humus, l'humeur, l'humain. Retrouver un peu
d'humanité, c'est se rendre compte que la force vitale, elle est aussi à


l'extérieur de nous et pas qu'à l'intérieur de nous. Et puis la zone
cardiopulmonaire qui est une zone rythmique très importante. Et puis
la zone neurosensorielle qui est typique à l'être humain, qui doit nous
redonner un discernement et pas un jugement. Donc on doit revenir à
discerner les choses. On reste justement dans la qualité de
l'environnement tandis qu'on juge, on sépare les choses. Donc
discernons, mangeons bien. Respirons, faisons du sport.
23:39 Philippe Guillaume
En ce qui me concerne, ce que j'aime expliquer aux patients avant
même la toute première séance, c'est les principes de l'homéostasie
et que les meilleures régulations se passent entre l'éveil et le sommeil.
Et c'est là qu'ensemble, nous allons harmoniser les rythmes qu'ils
connaissent, le rythme cardiaque, respiratoire et digestif.
24:01 Marc Damoiseaux
Tous ces rythmes, fondamentalement, sont reliés à l'axe de la santé.
Se rassembler, se réunifier pour que tout ça fonctionne de façon
unifiée. Le mouvement embryonnaire, l'étude de ce mouvement
embryonnaire, permet de comprendre cette voie d'unification.
24:15 Philippe Guillaume
Justement à ce propos, pour bien comprendre l'intérêt de cet
apprentissage d'embryologie biodynamique, nous allons devoir
redéfinir la notion de pattern et de juste fonction en ostéopathie.
24:30 Marc Damoiseaux
L'important, c'est de remettre un peu dans l'axe vital, dans la fonction
vitale. Si un sacrum est bloqué, par exemple, la personne peut se
mettre de travers et créer des dysfonctions, même que ce soit sur le
plan viscéral ou autre chose. Je vais prendre un exemple d'un enfant


qui vient d'arriver, qui a une naissance. Je pose la question au niveau
de l'anamnèse, comment s'est passé l'accouchement, par exemple. Si
on regarde un bébé, en général, il vient pour deux grands types de
pathologies, soit des problèmes de régurgitation, soit des problèmes
digestifs, on va dire au début, pour simplifier.
25:05 Marc Damoiseaux
Dans les deux cas, c'est assez lié. Admettons qu'on ait une naissance
qui est un peu difficile et on doit tirer sur la tête. On la met en
extension et on tire, on tire, il reste bloqué. Et le gynéco doit tirer, la
femme pousse, elle fait tout ce qu'elle peut, mais on tire, on tire, on
tire. Donc on met une hypertension, déjà sur toute la zone antérieure
au niveau de l'œsophage. Ce qui fait que ça peut juste se manifester
jusqu'à une perturbation, on va dire purement mécanique, au niveau
de la jonction cardio-tubérositaire, donc au niveau de l'œsophage et
de l'estomac. Avec tout ce que ça peut engendrer comme problème.
On sait, par exemple, que dans tous les problèmes ORL, dans tout ce
qui est IT, otite, rhinite, allergique, etc. Très fréquemment, on
constate qu'il y a des sécrétions de peptides. Une acidité, presque, qui
vient de l'estomac, qui peut perturber tous ces fonctionnements-là.


26:03 Marc Damoiseaux
Dans la grande partie, c'est ça, en fait. En regardant cet enfant,
quelque part, il a quitté un peu le juste pattern, la juste fonction,
parce qu'il a quitté un petit peu par une hypertension, une
hyper-traction, il est déstabilisé. Et donc le travail que je fais, c'est
essayer de le remettre petit à petit par des techniques très douces,
des techniques où on comprend ce qui se passe, des techniques
tissulaires ou des techniques... d'écoute, de pouvoir recréer la juste
fonction possible, par exemple au niveau de l'estomac et du
diaphragme. Donc c'est comme si on avait quitté, si tu veux, un peu
une ligne dans laquelle on doit aller, avec tout ce que ça peut
engendrer. Et le fait de reconnaître ça, de restabiliser, de refaire une
descente légère au niveau de l'estomac, par exemple, de rééquilibrer
la base du crâne, parce que si on regarde le zoophage, il est suspendu
à la base du crâne par les membranes péripharyngiennes, etc.
jusqu'au niveau du sacrum aussi, par l'axe crânio-sacré,
27:02 Marc Damoiseaux
de redonner de nouveau une bonne fonction, si tu veux, et donc de le
ramener dans le pattern original, entre guillemets. Donc c'est là où le
juste patron, le juste pattern, c'est là où la santé peut s'exprimer dans
son plein potentiel. Je donne un autre exemple, quelqu'un qui a subi
un accident de voiture, un gros choc qui est tombé sur les fesses, qui
s'est donné un grand coup sur la tête, on constate qu'il y a comme
une dysfonction entre le crâne et le sacrum, que normalement, si vous
voulez que je simplifie, c'est comme si on avait un petit bébé dans les
bras, avec la tête ici et le bassin ici, que je peux bercer, comme ça, tu
vois, simplement. Et là, c'est une bonne fonction. Mais si tout d'un
coup, par une chute, ce système n'est plus fonctionnel, et que ce n'est
plus un enfant qu'on berce, mais c'est comme un enfant qui se tord,
eh bien, il a quitté un petit peu son pattern original. Et donc l'idée,


c'est de ramener là où la fonction est la plus suffisante. Subtile et la
plus régénératrice pour aider le corps.
28:00 Marc Damoiseaux
Parce que là, on quitte les processus, et c'est là où la compréhension
de l'embryologie donne tout de suite une compréhension globale
dans le corps, la compréhension de l'anatomie, la compréhension des
facteurs perturbants, comme cette naissance, comme un accident,
peut perturber, eh bien là, non pas avoir un accès. On peut relancer le
processus crâneux sacré pour qu'il soit de nouveau comme un bébé
qui balance, si tu veux, et au niveau aussi du système
cardio-tubérisitaire. Il faut savoir qu'une grande partie, de nos soucis,
c'est très fréquemment ce système digestif qui est perturbé dans la
grande majorité des gens. Et ça se manifeste par des douleurs qui
peuvent aller jusqu'au niveau d'épaule, au niveau dorsal, au niveau
cervical, au niveau digestif, et même au niveau mental, parce que ça
perturbe finalement un peu votre fonctionnement, dans le sens que
vous êtes peut-être plus agressif,
28:48 Philippe Guillaume
tu viens de dire que la plupart du temps c'est à cause de problèmes
digestifs et tout à l'heure tu as parlé de l'endoderme est-ce qu'il y
aurait une relation avec une fonction qui aurait souffert
29:00 Philippe Guillaume
au niveau de l'embryologie de ce tissu ?
29:03 Marc Damoiseaux
Ce qui est très important, c'est que le bébé n'a pas de cognition au
début. Il ne va pas dire, tiens, on ne m'a pas amené mon biberon, je
n'ai pas reçu ceci. Il prend ce qui vient et ça va lui donner un


sentiment, on va dire, de bien-être ou de mal-être. Reconnaître la
personne là où elle veut bien être reconnue et pas là où on veut, nous,
la reconnaître. Je ne sais pas si vous avez déjà remarqué, dans la vie,
on a des contraintes. Parfois, on réagit, c'est sous forme de
frustration. Si on voit un bébé, il va naître, il va recevoir le sein de sa
maman. Il était nourri comme il voulait, à l'un de nos secondes par le
cordon ombilical. Prenons sur cette étape-là que l'allaitement ou le
fait de donner le biberon ne se passe pas bien. L'enfant va sentir un
sentiment désagréable au niveau de son ventre, par exemple, et il va
sentir que, tiens, il va développer une petite frustration. On va dire, si
je crie, si je pleure bien fort, on vient tout d'un coup s'occuper de moi.
30:01 Marc Damoiseaux
Des fois, de savoir qu'est-ce qui s'est passé peut être libérateur. C'est
dans l'écoute tissulaire, c'est quelque chose qui apparaît de façon
parfois même intuitif, comme si on recevait un tas d'informations et
puis tout d'un coup, on a comme une pensée créatrice. Peut-être que
c'est là qu'on doit retravailler, donner l'information. Et là, le corps
peut reconnaître ou l'individu peut reconnaître. Ce côté de gestion de
la frustration, c'est très intéressant aussi à comprendre. Ça s'explique
déjà dans le tissu, ça se marque dans le tissu, mais aussi dans nos
comportements. C'est pour ça que c'est une unité. On ne doit pas
séparer mind, body, spirit. C'est ensemble.


30:33 Philippe Guillaume
Lorsque tu travailles sur les patterns, dans les choses que tu
enseignes, il y a des axes et il y a des niveaux. Tu peux nous parler de
cette progression, de la première chose qu'on apprend ?
30:45 Marc Damoiseaux
Petit à petit, il est possible d'identifier dans la mise en place
embryonnaire des trajets, des directions qui ont une quantité
d'énergie aussi, une certaine puissance dans la main. Ce mouvement
qui a permis cette croissance, c'est comme si tu avais une empreinte
qui était marquée dans le tissu.
31:09 Marc Damoiseaux
Et d'ailleurs, si on regarde bien le mouvement du cœur ou un
mouvement de l'estomac ou un mouvement du foie, il suit un
mouvement embryonnaire dans sa phase de développement. Et donc,
la façon dont on va mettre ses mains, on va regarder s'il est libre dans
cette fonction de développement. Si je prends le mouvement du
cœur, on voit que quelque part, le cœur, dans son mouvement, il
répète son mouvement embryonnaire. Il monte et il descend. C'est
une phase de sa phase embryonnaire. Si je regarde le mouvement du
foie ou de l'estomac, on voit que dans sa fonction, comment il va se
mettre en place avec l'arrière-cavité des épiplons, ça respecte aussi
dans sa dynamique ce mouvement embryonnaire. Donc, s'il n'est pas
libre, quelque part, la fonction, la physiologie va être un peu
perturbée. Et donc, nous, on tente de rétablir cette surface de
glissement, mais pas n'importe comment.
32:03 Marc Damoiseaux
Avec une écoute où on connaît les lignes de force embryonnaires, on
connaît l'empreinte. Et ça devient quelque chose qui est un peu subtil


à sentir parce que ce n'est pas juste un grand mouvement. Vous savez,
il existe le mouvement classique. Je bouge mon bras. Puis, vous avez
aussi la motricité. Et puis, on a aussi ce qu'on appelle la motilité. Et
puis, il y a un mouvement pur dans le tissu, comme ça, qui est là. C'est
un mouvement physiologique. Ce n'est pas quelque chose, je ne peux
pas dire à mon cœur, arrête-toi. Je peux peut-être, par la méditation,
un peu le calmer. Mais il va répéter ce mouvement et lui redonner tout
son espace. Et là, vient quelque chose de très important. Quand on
grandit, on a besoin d'espace. On doit prendre son juste espace pour
qu'il ait juste croissance. Et le conflit, souvent, c'est un problème de
territoire. C'est un problème d'espace. Tu vas sur mon territoire, que
ce soit un foie ou un estomac ou un autre organe qui perd son espace.
C'est redonner le bon espace, mais comprendre comment cet espace
s'est développé. Quel est l'espace qu'il a besoin, si tu veux.
33:00 Philippe Guillaume
C'est encore un mouvement mineur d'un mouvement mineur.
33:03 Marc Damoiseaux
C'est la même façon dont on va travailler. Je peux donner un
mouvement induit, ou j'induis un mouvement dans le tissu. Ok, très
bien, manipulation directe par exemple, un trust. Ou bien je peux
suivre le mouvement. Je vois que le tissu balance à la gauche, qu'il va
vers un point de tension, et je cherche un point d'équilibre pour qu'il
se relâche et pour qu'il puisse repartir. Ou alors, et c'est là où on
rentre dans ce qu'on appelle l'ostéopathie biodynamique, elle ne va
pas induire un mouvement, elle ne va pas suivre un mouvement, elle
va écouter un mouvement. Et là, c'est une autre approche qui s'ouvre
petit à petit, où on commence à percevoir derrière, peut-être des
directions spécifiques, qui sont ces mouvements donnés par le
mouvement de développement embryonnaire. C'est là le lien un petit


peu qui peut se faire. Mais on a accès à ces mouvements, pas en
faisant un trust,
34:01 Marc Damoiseaux
pas en faisant une technique fonctionnelle où je suis un point de
balance, etc. Non, c'est, je dépose les mains, et je n'impose pas, mais
j'écoute et je vois ce qui se passe. Et là, il y a peut-être un mouvement
spontané qui va apparaître, pour aider la correction par exemple. J'ai
eu la chance de rencontrer Véronique Évrard, avec qui j'ai pu faire
l'enseignement de tout ce long cursus, qui est de la voir travailler avec
les enfants. Et je pense que l'ostéopathie biodynamique, je l'ai apprise
en fait en pédiatrie. C'est là où tout d'un coup, j'ai compris qu'on
touchait les bébés, qu'on ne peut pas toucher de la même façon qu'un
adulte au départ, c'est un toucher beaucoup plus précis. Les bébés
vous amènent à aller dans le mouvement présent. Si tu n'es pas juste,
ils prennent ta main et la mettent autre part. Je pense que cette
approche-là avec les enfants a été ma vraie découverte de
l'embryologie biodynamique et de l'ostéopathie biodynamique, et de
vraiment comprendre l'application et la puissance de ce que ça avait.
35:01 Marc Damoiseaux
C'est ce que j'ai appris.
35:02 Philippe Guillaume
Une anecdote pour appuyer ce que tu racontes ?


35:05 Marc Damoiseaux
J'étais jeune enseignant, je donnais cours déjà dans l'embryologie. Et
puis, on m'a demandé de faire un rééquilibrage, parce qu'il y avait
quelqu'un qui, après un traitement, n'était pas bien. En ostéopathie
biodynamique, on insiste beaucoup pour faire ce qu'on appelle le
rebalancing, le rééquilibrage des fluides. Il faut prendre du temps et
comprendre. Et pour la première fois, au moment où j'ai mis les
mains, je me suis dit, il faut que j'arrive à faire ce rebalancing. Fais
bien tes étapes, trouve ton neutre, etc. Et tout d'un coup, j'ai eu accès.
Pour la première fois, vraiment, de façon très précise, très puissante,
ce que c'était l'effectuation dans le corps. Qu'est-ce que c'était cette
énergie, toi ? Et là, j'ai tout d'un coup vraiment perçu. Et là, je me suis
dit, OK, je l'ai. Je sais que je le reconnais et que le système, si tu le
reconnais, s'est rééquilibré. Si tu reconnais que tu es en colère, ta
colère peut passer. Si tu reconnais la lésion, elle peut passer. Et ça,
c'est vraiment un moment important parce que ça ne m'a pas quitté.
36:02 Marc Damoiseaux
C'est apparu comme ça. L'ostéopathie et surtout l'ostéopathie
biodynamique, parce que ça vous oblige à découvrir ce qu'on appelle
le neutre. C'est la rencontre des deux neutres qui permet l'émergence
de l'originalité, qui permet la force créatrice de traverser et de faire
son chemin.
36:18 Philippe Guillaume
Quand tu dis les deux neutres.
36:20 Marc Damoiseaux
Le neutre du patient, le neutre du thérapeute.
36:22 Philippe Guillaume


une belle petite branche. D'ailleurs, à ce propos, je vous réfère au
podcast où je me suis entretenu avec Pascal Ancelin, où on retrace le
parcours de l'élève qui apprend l'ostéopathie biodynamique, où on
retrouve les différents termes, où on les explique. Je parle du neutre,
de l'allumage, de la double attention du praticien et aussi de la marée.
D'ailleurs, Marc, tu as beaucoup travaillé en ostéopathie
biodynamique sur le tout venant, sur les bébés, comme tu viens de
nous l'expliquer, mais aussi sur les enfants handicapés, je crois.
37:00 Marc Damoiseaux
Il y a quelques années, j'ai eu l'occasion de travailler en Inde, dans une
école qu'on appelait la Sakya School, et de travailler avec des enfants
qui étaient fortement handicapés. Il y avait plusieurs ostéopathes, et
ce qui était assez génial, c'est qu'on travaillait toujours à deux, deux
ostéopathes sur un enfant. Donc il y avait déjà un échange, une
coordination, un feeling qu'on pouvait partager. Et puis on faisait des
groupes d'échange, qu'est-ce qu'on avait perçu et ressenti. Tout d'un
coup, quelqu'un dans le groupe qui dit, tiens c'est comique, vous avez
remarqué, il n'y a pas de fluctuation longitudinale chez la plupart. Je
me dis, tiens effectivement, il n'y a qu'une fluctuation transversale qui
est très forte. Et c'est là où on s'est rendu compte que ces enfants
avaient besoin de cette force embryonnaire qui était absente, ou
diminuée, qui n'arrivait pas à se redresser. Ils étaient un peu comme
des légumes avec des infirmateurs cérébraux très importants. Et le
fait de les travailler, de retonifier, relancer cette fluctuation
longitudinale, En fait, des résultats assez étonnants de ce qui s'est
passé autour de tous ces enfants,
38:02 Marc Damoiseaux
et donc avec des retours, en se disant, mais qu'est-ce que vous avez


fait ? Et en fait, c'était ce groupe d'échange, et ce groupe que tu l'as
dans la main, ou tu ne l'as pas, tu peux l'avoir dans la tête, des
explications, mais c'est une expérience en fait, c'est une expérience
dans le moment présent.
38:19 Philippe Guillaume
Quand tu parles de fluctuations longitudinales, tu parles de quels
patterns ?
38:25 Marc Damoiseaux
Cette force embryonnaire où le corps s'allonge, la puissance de la
croissance qu'elle a, qui est une force de gravité aussi, qui te permet
de tenir debout. Ça se manifeste dans la croissance, mais ce n'est pas
la croissance. Tu comprends ? C'est une subtilité, ce n'est pas « je sens
la croissance ». Non, c'est une force qui s'exprime aussi par la
croissance. C'est la santé, exactement.
38:47 Philippe Guillaume
Comment, à ce moment-là, s'intègre ce mouvement développemental
embryonnaire à l'intérieur de cette santé, de cette émergence ? Parce
que quelqu'un qui fait de l'ostéopathie biodynamique, il ne maîtrise
pas forcément les mouvements embryonnaires.


39:02 Marc Damoiseaux
Non, mais il devrait, je pense. Parce qu'on retrouve des mouvements
analogues qui sont observés dans les traitements de stéopathie
biodynamique. Certains mouvements analogues qu'on retrouve dans
le développement embryonnaire. C'est dans ce sens-là que c'est
intéressant. Donc c'est pour ça qu'il n'est pas exagéré, on va dire, que
la force à l'origine du mouvement embryonnaire est identique aux
forces régénératrices utilisées pour se guérir. Et là, on appelle ça,
nous, dans notre jargon, on utilise des mots comme ça, assez forts. On
dit que c'est un peu le souffle de vie qui te traverse. Alors ça, c'est
important, parce qu'il faut comprendre un peu le langage. Quand on
parle de stéopathie biodynamique, il y a des mots comme ça. On parle
de respiration primaire, on parle de souffle de vie, on parle de la
puissance, on parle du neutre, on parle de l'allumage.
39:54 Philippe Guillaume
Est-ce que l'allumage, c'est la remise en fonction du pattern ?
39:59 Marc Damoiseaux
Oui, redonner cette flamme.
40:01 Philippe Guillaume
Moi, ce que j'aime beaucoup quand on étudie tes cours, c'est que ça
donne du concret dans les mains. C'est-à-dire qu'autant on peut avoir
une sensibilité énergétique, une sensibilité intuitive, une relation au
champ énergétique, autant là, avec l'embryologie, on a l'impression
finalement de rester dans le corps. Lorsqu'on sent ces patterns qui
vont émerger, qui vont de nouveau être actifs, on sent comment le
tissu s'est construit et à travers le tissu vient reprendre la suite du
mouvement inhérent que l'on avait dans les mains. Donc ça apporte
une crédibilité à la perception initiale de laquelle on pouvait peut-être


douter.
40:51 Marc Damoiseaux
Souvent, les étudiants me disent « Tiens, vos explications confirment
ce que je ressens. » Je pense que l'embryologie, comme je l'apprends,
permet de confirmer parfois nos ressentis.
41:04 Marc Damoiseaux
Je pense que c'est important d'avoir comme vision, c'est comment je
peux aider la physiologie, comment je peux soutenir la santé. La
santé, elle est là, comment je peux l'aider ?
41:13 Philippe Guillaume
Tu m'as parlé tout à l'heure de différents axes. Ça commence par la
fécondation.
41:19 Marc Damoiseaux
C'est ce qu'on appelle l'axe vital. C'est une première impulse. Au
moment de la fécondation, et juste avant, on s'est rendu compte que
dans la création d'un ovocyte, d'un ovule, il y a un axe qui va se
dessiner, qui est donné par les cellules nourricières et les cellules
folliculaires. Pré-axe, si tu veux. Dans le cytosquelette, il est organisé
de façon chimique, dans un premier temps, avec un pôle assimilateur
et un pôle désassimilateur, si tu veux. On pourrait dire un pôle positif
et un pôle négatif. Ce qui sera très important dans toute
l'embryologie. Au moment de la fécondation, le spermatozoïde, au
moment où il va toucher la membrane, si tu veux,
42:04 Marc Damoiseaux
il va y avoir ce qu'on appelle très rapidement une vague calcique.
Donc vraiment un mouvement qui va réorganiser le cytosquelette


pour le mettre dedans. C'est déjà dans ce qu'on appelle un
prépaterne sur lequel le futur embryon va se construire. Donc il y a
déjà, si tu veux, une polarité qui se construit. Et puis, très rapidement,
on va constater qu'il va y avoir un mélange des patrimoines. Il va y
avoir à paraître ce qu'on appelle les deux premiers blastomères.
Blastos, ça veut dire le germe mère. Blastos, le blast, c'est aussi
quelque chose qui a une force. T'imagines, c'est comme une graine
très puissante. Donc il y a une puissance qui s'installe. Et on va
pouvoir suivre la polarité, si tu veux, tout le temps. L'axe qui va
évoluer dans l'espace-temps jusqu'à arriver à un moment donné où il
va y avoir ce qu'on appelle le moment de l'implantation. C'est-à-dire
qu'il y a une première cavité qui va apparaître
43:01 Marc Damoiseaux
avec un pôle embryonnaire, un pôle végétal, un pôle animal. De
nouveau, un axe, si tu veux. Et l'embryon va toujours rentrer dans la
muqueuse utérine de façon axée. Il ne va pas rentrer de travail. Il va
rentrer dans le lieu. Il y a le plus possible d'assimilation, ce qu'on
appelle le pôle embryonnaire. Et de là va apparaître une deuxième
cavité qu'on appelle l'ébauche de la cavité amniotique, qui sera très
importante parce que c'est le liquide primaire qui va former ce qu'on
appelle le liquide céphalo-ruchidien, donc l'impulse primaire du
liquide céphalo-ruchidien. Mais également, ça va former la poche des
os dans laquelle vous allez vous baigner. Donc la partie la plus
intérieure de votre corps, qui est du liquide, va aussi, autour de
l'embryon, baigner dans un autre liquide. Ça, c'est dans le futur. Mais
au moment où je vais arriver, l'embryon, il reste polarisé. Donc il est
orienté dans un espace-temps de façon très spécifique. Donc je parle
espace et temps. Donc espace.


44:00 Marc Damoiseaux
Il doit se mettre dans l'espace. Il n'est pas mis n'importe comment
dans l'espace. Ça, c'est quelque chose qui est important. Ça veut dire
que je m'oriente dans mon espace pour être le plus adéquat et le plus
performant. Au moment où l'embryon va rentrer, il va encore y avoir
tout un tas de tissus qui vont apparaître. Mais il va y avoir ce qu'on
appelle un axe, qui est repris dans l'embryologie classique, qu'on
appelle la ligne primitive. Donc ça, c'est vraiment un petit axe qui se
fait entre le pédicule embryonnaire, donc l'endroit où on rentre dans
la maman, où le fœtus commence à se développer. Ça a la forme un
peu comme d'une raquette, comme ça, si tu veux, avec une zone un
peu comme un cône. Et dans ce cône, il y a un axe qui va être un lieu
où les cellules épithéliales, une formation d'une hypoxie, vont passer,
se transformer en cellules mésenchymateuses pour former le
mésoderme primitif. Et dans ce mouvement, en même temps, il y a
comme une vague dans le tissu épithélial superficiel qui va former, qui
se fait aussi le long de l'axe
45:00 Marc Damoiseaux
du pédicule embryonnaire et de cette ligne primitive, qui va former ce
qu'on appelle la notochorde, qui va subir différentes évolutions, le
processus notochordal, la vague, pour finir, finalement, formée
comme un tuyau. Et ce tuyau, en finalité, va devenir plein, va contenir
différents types d'informations et sera, en finalité, la colonne
vertébrale et plus spécifiquement, une partie de la colonne vertébrale
qui se trouve dans le disque vertébral qu'on appelle le nucleus
pulposus qui va évoluer tout au long de la vie. Mais qui est très
important et fondamental dans la partie embryonnaire et qui a des
ressources, si tu veux, fonctionnelles. Donc, c'est une structure, et une
fonction. Alors, il ne faut pas juste penser structure, il faut penser
aussi, dans sa tête, à la fonction. si je peux donner un résumé du


processus notochordal, on peut considérer que c'est un centre
organisateur
46:00 Marc Damoiseaux
qui est crucial, qui va secréter des morphogènes, des gènes, si tu veux,
pour réguler les différents gènes qui vont être impliqués entre autres
dans la neurulation, dans la différenciation générale de l'embryon. et
donc, si ce processus n'est pas bien équilibré, ça va engendrer des
manifestations aussi qui ne vont pas être correctes. Donc, la
notochore, c'est une structure, une fonction embryonnaire qui est
essentielle dans l'induction et dans la régulation du développement
de tous les tissus environnants, qui va émettre des signaux
moléculaires, par exemple, qui va influencer l'activité de tous ces
gènes pour la construction et le développement de l'ensemble du
corps. Donc, la notochore, ça agit comme un centre de signalisation,
un centre d'organisation, en émettant à la fois sur le plan moléculaire,
mais en même temps, en permettant une reconnaissance de
l'ensemble des cellules où ils se situent, si tu veux, dans
l'espace-temps,
47:02 Marc Damoiseaux
parce que c'est aussi polarisé. On a pu mesurer ça, que si on a un
champ électrique, et si c'était dévié, eh bien, il y avait toute une
déviation qui allait se mettre. Donc, c'est vraiment un axe qui va
assurer la mise en place correcte de tous les autres axes
embryonnaires. Ça devient une référence, si tu veux. Donc, c'est
comme si c'était un axe de santé. Je donne un exemple. Quelqu'un
vient avec une fracture du pied. Il a eu un accident. Et c'est comme si
son pied était mis un peu en dehors de son champ, si tu veux. Eh bien,
parfois, c'est bien de ramener le pied, par une technique un peu
simple, comme ça, de mobilisation, mais de le ramener dans son


champ, dans son axe vital. Parce que quand tous ces petits axes sont
perdus, c'est comme s'il était en dehors de son corps. De le ramener
vers la zone de l'axe notocordal, vers la zone du cœur, par exemple,
aussi, c'est remettre le corps dans tout son bas-terre.
48:00 Philippe Guillaume
reprendre un mouvement mineur pour le ramener encore dans un
mouvement encore plus mineur.


48:06 Marc Damoiseaux
L'axe vital qui est l'axe donné par la polarité. Donc, il y a une
orientation, si tu veux, qui se fait. Ce n'est pas fait de façon
anarchique, c'est déjà orienté ou préorienté. Ensuite, il y a deux
cellules, puis trois, quatre. Là, on voit de nouveau qu'il y a une
polarité, puisqu'il y a des vitesses de croissance différentielles.
Jusqu'au moment où ça devient beaucoup plus visible pour nous, on
va apparaître la ligne primitive, qui se fait vraiment au niveau du
pellicule embryonnaire. Et puis, il y a le processus noctocordal qui va
se développer. Donc, ça, c'est vraiment l'axe principal. Et puis, il va se
développer derrière le tube neural, sous l'influence de la noctocorde.
Et puis, devant, va se développer la ligne blanche antérieure, qui est
aussi dépendante de tout ce mouvement. Donc, c'est comme une
continuité où tout se refait vers la ligne médiane. On est construit de
partie antérieure, moyenne et postérieure autour d'un axe spécifique.
48:59 Philippe Guillaume
Et comment tu tombes dessus en traitement ?
49:02 Marc Damoiseaux
Prenons la notochorte. Où est-ce qu'elle aboutit ? Et d'où elle part ?
On se rend compte qu'il y a un lieu dans le crâne qu'on appelle la base
du crâne, et plus spécifiquement au niveau de la selle tursique, que
c'est le point le plus immobile du corps. On appelle ça le point zéro. Il
y a une vague descendante qui va jusqu'au niveau du sacrum,
jusqu'au niveau de la base sacrée. On sait son point de départ, on sait
son point d'arrivée. Ce que j'apprends aux étudiants, c'est de disposer
les mains de façon très spécifique, très précise, afin de pouvoir
montrer qu'entre cette partie-là et cette partie-là,
49:45 Philippe Guillaume


Entre l'occipute et le sacrum, on a la mémoire de la construction de la
notochorde.
49:51 Marc Damoiseaux
Elle est là, elle est dans nos mains. Donc l'idée, c'est de simplement se
réaxer, si tu veux, par rapport à ça. C'est presque une réaxation un peu
énergétique, presque électromagnétique.
50:00 Marc Damoiseaux
C'est un ressenti, est-ce que c'est bien mis dans la bonne polarité, si tu
veux. J'aime le mot polarité à ce moment-là. Entre un plus et un
moins, un point d'appui, un fulcrum. C'est de bien comprendre
qu'est-ce que ça veut dire un fulcrum aussi, tu vois. Dans la définition
classique, un fulcrum, c'est ce qu'on appelle un point d'appui, un
levier par exemple, tu vois. Mais en osteopathie, le thème fulcrum
peut désigner aussi un point d'équilibre dynamique. Un fulcrum peut
être aussi à un mauvais endroit, ce qu'on appelle un faux fulcrum,
L'idée, c'est de retrouver les bons points d'appui. Et entre autres, de
travailler sur cet axe notocordal, de trouver les points d'appui
originaux, ça permet aux autres systèmes de reconnaître par où ils
doivent se remettre, si tu veux. Le chemin, il est là. Le tissu, une fois
qu'il s'est remis, il peut se voir se restructurer, quoi. Par exemple, l'axe
6, c'est une vertèbre qui est vraiment en rapport avec l'axe. Le
sacrum, l'axe 6, l'occipute. Mais aussi, les muscles externes de l'œil
sont une expansion de la plaque notocordale, tu vois. Donc, il y a une
information qui vient aussi de ce niveau-là.
50:58 Philippe Guillaume
Donc le fait d'apprendre l'anatomie et surtout l'origine
embryologique


51:03 Philippe Guillaume
permet, avec une connaissance intellectuelle, de modéliser une
possibilité de fonction à un temps antérieur à celui où on touche un
sacrum et d'après, de ressentir cette fameuse polarité subtile qui est
accompagnée par l'enseignant pour retrouver ce pattern.
51:26 Marc Damoiseaux
redonner cette ligne médiane. La première ligne médiane originelle
dans le corps, qui a une fonction d'organisation. Si c'est dévié,
quelque part, tu perds un peu.
51:36 Philippe Guillaume
Et ça, c'est bien parce qu'en ostéopathie, on peut aller jusqu'à la
durmère et le travail crânio-sacré. Mais là, avec l'embryologie et le
mouvement développemental, on retrouve l'unité grâce à ce fameux
point zéro parce que cette notocorde commence à se créer. Et je crois
que la tête et le bassin, au début, ils seront très, très proches.
52:00 Philippe Guillaume
Donc, il faut imaginer qu'on touche un tissu en pleine croissance et
qu'en ayant le sacrum, on a aussi la tête dans les mains. Donc, s'ouvrir
vraiment à une perception fine et très subtile.
52:13 Marc Damoiseaux
Tu veux au départ la base du crâne et le sacrum, si on fait marche
arrière,
52:20 Philippe Guillaume
Sous-titrage ST' 501 Et ça, si on ne te l'apprend pas, si tu tombes


dessus par hasard, tu ne valideras pas cette perception.
52:26 Marc Damoiseaux
Au départ, c'est la même chose. Ça nous permet de redonner l'unité
du système. Ça, c'est important parce que des fois, on est désunifié.
52:33 Philippe Guillaume
Tout à fait. Ce n'est pas une modélisation, ce n'est pas un concept.
L'embryologie, c'est une construction à partir du vivant. C'est
justement ce qui lui donne plus de présence et de sens dans la
sensation.


52:48 Marc Damoiseaux
le corps il reconnaît ça c'est comme si tu écoutes un poste de radio et
que tu sais mettre la bonne onde tu sais capter l'information c'est un
petit peu ça que je peux expliquer et puis c'est aussi important de bien
comprendre la notion de fulcrum en ostéopathie
53:01 Marc Damoiseaux
c'est un point où se rencontrent des tensions où se créent des points
de transformation tandis que dans l'ostéopathie biodynamique on va
un petit peu plus loin parce qu'on se rapproche plus de ce
mouvement embryonnaire le fulcrum peut être vu comme un lieu
d'organisation un lieu de centrage et un lieu de transformation ça va
un petit peu plus loin encore
53:25 Philippe Guillaume
D'ailleurs, à ce propos, j'ai une petite anecdote. En travail
biodynamique, j'étais en travaux pratiques, et ce jour-là, on devait
travailler sur moi, sur une tension. La zone, c'était l'ombilique, c'est
une relation cordon-bédicale. Au début, je sentais une petite tension,
comme une densité au niveau du ventre, quelque chose de très
localisé. Mon binôme commence le travail en douceur, simplement à
l'écoute. Et au bout d'un moment, je lui dis, c'est bon, je ne sens plus
rien. Et lui, il me répond. Non, non, continue, reste dedans. Alors, j'ai
joué le jeu, j'ai laissé faire, j'ai laissé venir.
54:02 Philippe Guillaume
Et c'est là que j'ai compris quelque chose de très important. La
tension, en fait, s'est transformée en fonction. Au départ, je percevais
un symptôme, un point fixe. Et puis, petit à petit, ce point s'est mis à
vivre, à bouger de l'intérieur, à se réorganiser. Ce que je ressentais, ce
n'était plus une tension. C'était une fonction qui reprenait sa place. Et


quand la fonction revient, elle amène avec elle toutes ses
compétences, comme si le corps se souvenait de ce qu'il sait faire.
Dans ce moment-là, j'ai senti quelque chose de plus grand, une
intelligence à l'œuvre, silencieuse, précise, presque émouvante. Et
puis, avec le recul, j'ai compris que cette zone, l'ombilique, n'est pas
qu'un point anatomique, c'est un centre symbolique, le lien premier à
la vie, à la mer, la nutrition, à la sécurité. si cette zone retrouve sa
fonction, elle réveille aussi cette mémoire-là.
55:00 Philippe Guillaume
Et le corps, dans sa justesse, nous montre que la physiologie,
l'intelligence et la symbolique ne sont jamais séparés. C'est là que je
me suis dit, l'embryologie en faux, c'est ça. Ce n'est pas chercher un
point à corriger, mais aider le corps à retrouver sa fonction originelle,
celle qui contient déjà toute l'intelligence du vivant. D'ailleurs, j'ai une
question pour toi, Marc. Lorsque tu travailles, j'ai noté qu'il était très
important de retrouver la relation à cette première fonction qu'on a
dans le corps, qui est l'axe notocordal. Lorsque tu travailles sur des
patients qui peuvent avoir des problématiques qui soient antérieures
à cet axe, par exemple, un problème soit préconceptuel, soit entre la
fécondation et la création de la notocorde.
56:02 Philippe Guillaume
Est-ce que ça peut expliquer une personne qui n'est pas ancrée ou
que toi, en tant que thérapeute, tu sois dans un premier temps
démuni dans ton approche, ayant l'impression de ne pas pouvoir les
stabiliser ou qu'il te manque quelque chose dans les mains ?
56:15 Marc Damoiseaux
On parle de temporalité. Quand est-ce qu'a lieu l'expérience ? Si on
regarde l'expérience, elle a toujours lieu maintenant. Maintenant,


pensons à quelque chose qui s'est passé ce matin. Ce matin,
rappelle-toi au moment où tu es rentré dans ta voiture. Tu étais un
peu dans un maintenant. C'est là où quelque chose de très important,
qui n'est pas facile à concevoir, mais qu'on peut peut-être ressentir.
Est-ce qu'il existe plusieurs maintenant ? Ou est-ce qu'il n'existerait
qu'un maintenant ?
57:04 Marc Damoiseaux
Ça veut dire que la plupart du temps, dès que je pense, je crée du
temps. il y a parfois des moments où il ne faut pas spécialement
penser. Il faut se mettre dans une qualité de présence. Et le mot
présence nous amène à vivre une expérience maintenant. Ce qui fait
que ce qui s'est passé, soit disant il y a longtemps, est toujours
maintenant. Et c'est là, dans le maintenant, que tu as accès à quelque
chose qui aurait pu ne pas bien se passer. Et c'est là où tu peux
peut-être le corriger. Tu comprends ? C'est très subtil. Ça veut dire
peut-être qu'il n'y a qu'un maintenant et pas plusieurs maintenant.
Mais je pense, je crée du temps. Et c'est pour ça qu'on dit que les vrais
penseurs ne pensent plus. Et à un moment donné, je pense que par
cette absorption un peu qu'on peut avoir, on peut se mettre dans
quelque chose qui est maintenant,


58:02 Marc Damoiseaux
dans lequel on a accès, en fait, à un espace-temps concentré. Donc, ce
que tu es maintenant est le résultat de tout ça. Et c'est là où
l'information peut se passer. C'est là où l'information peut être saisie
et donnée. C'est là où certaines personnes qui ont des compétences
beaucoup plus, tout d'un coup, vont te donner une information qui
peut-être était dans ta phase embryonnaire ou dans ta jeunesse ou
autre, sur lequel tu étais bloqué. Parce qu'un mot, un geste, un regard
peut bloquer quelqu'un toute sa vie. Un mot, un geste, un regard, s'il
est donné dans le juste espace-temps, c'est-à-dire dans le
maintenant, peut le libérer pour sa vie. Et c'est là où on peut retrouver
dans la qualité tissulaire ou dans la qualité de l'information, Mais ça
se passe maintenant. Mais si tu veux rentrer dans le passé, et que tu
penses, ça ne va pas marcher. C'est là où on a la porte pour rentrer,
59:00 Marc Damoiseaux
peut-être, dans quelque chose de plus subtil. On se dit, tiens, mais
tout d'un coup, j'ai accès à cette information qui s'est peut-être, si j'y
pense, qui s'est passée à longtemps, mais elle est toujours dans le
maintenant, parce que c'est le même maintenant. Ce n'est pas un
maintenant qui a un début, qui a une fin. C'est là où le côté presque
mystique, si tu veux, que j'aime bien parfois toucher, c'est de se dire,
tiens, qu'est-ce qui fait que j'ai accès à cette information ? Quelque
chose qui serait passé il y a X temps, je peux rentrer dans cet état de
trance qui est dans le maintenant, parce que là, je quitte la notion
d'espace-temps, et l'information peut venir et peut être libérée. En
écoutant le tissu, tout d'un coup, tu peux presque recevoir
l'information que la personne a fait une grande chute ou a eu un
accident ou un traumatisme important, tu vois.
59:50 Philippe Guillaume


D'ailleurs, à ce propos, j'ai une anecdote, parce qu'on peut faire aussi
le chemin inverse, ayant étudié avec toi l'embryologie. J'étais en
consultation avec un patient sur lequel je devais traiter le coude.
60:05 Philippe Guillaume
Pendant ma pratique, j'avais une main sur son épaule et l'autre main
sur sa main. J'avais en perception le mouvement inhérent entre
l'épaule et la main. Les articulations se mettaient en mouvement, tant
en ségrité qu'au niveau du tissu conjonctif. J'avais donc les échanges,
c'était harmonieux. Et à un moment donné de mon travail, je n'avais
plus aucune perception entre la main et l'épaule, que la main. Son
coude, je ne percevais plus rien. Son épaule, je ne percevais plus rien.
Heureusement, je n'étais pas perdu. Parce que je me suis rappelé que
la main est créée à partir du poumon, avant même le coude et
l'épaule, qui arrivent par la suite, pendant la croissance. Alors, j'ai
attendu de me mettre en écoute plus profonde,
61:06 Philippe Guillaume
pour avoir en perception cette cavité pleurale, cette empreinte. Et à
partir de là, c'est redessiné. Et j'ai retrouvé dans les mains, cette
construction du membre supérieur. Et ensuite, j'ai retrouvé mon
mouvement dans le tissu conjonctif et dans le tissu articulaire. Et j'ai
pu finir ma séance sur le coude.
61:29 Marc Damoiseaux
Peu de gens le savent, que les membres supérieurs et inférieurs, c'est
aussi une expansion du sac cardiopleuro-péritoneal. C'est amusant
parce qu'on le retrouve en médecine chinoise, où on a tous les
méridiens du cœur, de l'estomac, dans les extrémités, qui sont une
convergence en périphérie de cette membrane digestive qu'on


appelle le péritone. Ça veut dire que ce qui se passe en périphérie est
aussi l'expression de ce qui se passe dans la profondeur du corps.
61:58 Philippe Guillaume
Oui, parce qu'en médecine chinoise, des fois, ils ne traitent que les
gens habillés en périphérie par pudeur ou autre.
62:08 Philippe Guillaume
Et en fait, ils ont accès à la profondeur.
62:10 Marc Damoiseaux
Ils ont accès à la profondeur parce que c'est une expansion de ce sac.
C'est une expansion de ta profondeur. Et d'ailleurs, les plis, par
exemple, le pli du coude, va se faire en même temps que les rotations
digestives. Pourquoi tout d'un coup, on attrape un tennis elbow
lorsqu'on n'a jamais joué au tennis ?
62:25 Philippe Guillaume
Ah oui, alors raconte-moi quelqu'un qui vient de voir avec un tennis et
le bout.
62:28 Marc Damoiseaux
Je vais suivre le tissu et voir s'il m'amène vers le système viscéral et
voir ce qui pourrait s'être bloqué ou avoir une dysfonction sur le plan
de la plèvre ou autre, tu vois, des poumons. Il faut savoir qu'il y a une
convergence à partir de îles pulmonaires où tu as la rencontre entre
les deux péritoines, c'est-à-dire la somatopoeuse et la somatopoeuse,
donc on va dire la plèvre viscérale et pariétale, disons, Et puis je peux
aller retrouver parfois une fixation sur un poumon
62:59 Philippe Guillaume


Tout ça parce qu'embryologiquement, il y a une continuité de
construction.


63:03 Marc Damoiseaux
Il y a un sens à ce qu'on raconte. Ça veut dire que si on dit ça, on peut
l'expliquer. Et c'est ça que parfois, certaines personnes me disent,
tiens, je suis arrivé à les traiter ici, je n'avais pas compris. Finalement,
mais en embryologie, tu m'expliques qu'il y a ce lien. Donc,
l'embryologie vous donne cette capacité d'avoir une vision très
holistique du corps, une compréhension très globale, si tu veux.
63:30 Philippe Guillaume
On a vu les patterns de la notochorde. Il y a aussi quelque chose à
tenir compte, c'est la hiérarchie des systèmes.
63:39 Marc Damoiseaux
La chronologie d'apparition de systèmes, ça c'est très important et je
pense que c'est une clé thérapeutique. Dans un tout premier temps, la
première chose, si on prend une cellule et qu'on fait un peu un lien, si
tu veux, entre l'ontogénèse et la phylogénèse, en comprenant bien
que l'ontogénèse c'est la formation d'un être, d'un individu
spécifique, et la phylogénèse ça reprendrait un peu toutes les
espèces, je simplifie.
64:04 Marc Damoiseaux
La toute première système c'est une communication autocrine,
c'est-à-dire que la cellule communique avec elle-même. C'est presque
philosophique, c'est d'abord connais-toi toi-même. Et puis la
deuxième chose c'est la communication paracrine, je communique
avec mon voisin, j'ai un échange. Et puis seulement plus tard va
apparaître ce qu'on appelle une communication digestive. Parce
qu'au début tu as une cellule, puis ça devient des organismes
multicellulaires, donc plusieurs cellules. Et puis une des premières
choses qui va apparaître, c'est un tube digestif. Et si on regarde dans


l'embryologie qu'on suit, on constate que la première cavité qui
apparaît, on appelle ça le blastocèle, le germe du ciel. Et ce cavité-là
est votre première cavité digestive. On retrouve très très bien
autocrine, paracrine, digestif. Et puis seulement va apparaître
d'autres systèmes,
65:00 Marc Damoiseaux
mais ça veut dire que beaucoup beaucoup de problèmes viennent
qu'on ne se connaît pas, on va dire, et qu'on ne s'est pas bien
communiqué avec l'autre, et qu'on ne mange pas correctement. Je
pense que beaucoup de pathologies dans le corps commencent par
une petite dysfonction du pancréas. Parce que c'est un tissu très
profond, c'est un tissu digestif, c'est une glande, exocrine, endocrine,
et qui va donner des informations de digestion par des amylases pour
transformer... On a tous, Tous, par notre mauvaise alimentation en
général, des petites pancréatites. Le rhume du pancréas, j'appelle ça
pour rire, mais qu'aller libérer le pancréas sur un plan ostéopathique
par les techniques de type viscéral, que ce soit sur le plan de la
mobilité, de la structure ou autre, ou sur le plan facial, peut avoir une
très très belle source de guérison.
66:00 Marc Damoiseaux
On ne voit pas que tout d'un coup ces problèmes d'épaule, je ne sais
pas pourquoi ça apparaît, ces problèmes de cervicalgie, ces
problèmes de dorsalgie, ces problèmes de digestion, ces problèmes
de constipation, d'aller voir un petit peu ce qui se passe dans ce
pentagone facial du pancréas, en étant très attentif de pouvoir aider
en travaillant de façon subtile, par les techniques ostéopathiques qui
lui sont propres, la tête du pancréas jusqu'au niveau de la queue du
pancréas en rapport avec la rate. N'oubliez pas, en ostéopathie, on ne
traite pas un organe, on traite un environnement. Et c'est la bonne


compréhension de ces axes du développement, de l'embryologie, de
l'anatomie, de la physiologie qui nous fait comprendre comment
bouger. Tu vois, simplement le fait déjà de faire des torsions et des
choses comme ça, était très important pour ce pancréas. Donc on
retrouve dans l'ontogénèse, dans cette succession, autocrine,
paracrine, digestif qui va apparaître. Et puis seulement vont
apparaître le tissu conjonctif, et puis le système circulatoire, puis le
système encore...
67:03 Philippe Guillaume
C'est marrant que tu parles du pancréas, surtout qu'elle se développe
en fonction de la croissance du foie après la fermeture des neuroports
antérieurs et postérieurs. Et donc, j'ai l'impression qu'il y a une
relation énorme avec la relation à l'extérieur une fois qu'on s'est
retrouvé soi-même. Et en plus, c'est à ce moment-là précis où il y a la
flexion embryonnaire.
67:30 Marc Damoiseaux
On a la flexion, mais aussi on a une flexion longitudinale. Donc ça fait
ce mouvement de flexion vers l'avant, que c'est une rencontre du
cerveau et du cœur, qui se connaissent très bien quelque part. Et dans
ce mouvement après, il y a une ouverture entre le cœur et le cerveau.
Vous allez avoir tout le système digestif, toute la face qui va se
développer, et entre autres avec un organe qui est très important, qui
est la thyroïde, et aussi la notion du pancréas qui va se développer un
peu plus tard, déjà dans cette phase d'ébauche et surtout de
développement longitudinale.


68:01 Marc Damoiseaux
Donc il y a comme une action qui se fait avec tout le système
glandulaire, depuis l'hypophyse, la thyroïde et le système du pancréas
qui va se développer.
68:09 Philippe Guillaume
C'est ça qui est dingue avec l'embryologie, quand on écoute
réellement les tissus et ce mouvement profond, qu'on leur donne
vraiment le temps de s'exprimer, on découvre des synergies
incroyables entre les extrémités et le centre, la périphérie et la
profondeur. On trouve des relations, des points d'appui qui datent de
la construction embryonnaire, ça donne une conscience dans les
mains qui est juste extraordinaire. Parlons maintenant des
synchronicités.
68:37 Marc Damoiseaux
Reprenons le développement embryonnaire. Le mot exact, c'est les
synchroniques. Quelque chose qui se passe de façon temporelle, en
même temps, mais à un espace différent, avec des mêmes facteurs
d'induction. Prenons un exemple important. Il existe une
synchronicité très importante dans le développement entre les yeux,
la théroïde et le pancréas. Ou entre le développement du cerveau et
du cœur.
69:03 Marc Damoiseaux
Ou entre le développement d'un estomac et d'un foie, ou d'un
intestin. Et ça, c'est très intéressant parce que ça se soutient. Et ça
permet de comprendre certains problèmes. L'importance, par
exemple, pour équilibrer des yeux, ça peut être de voir ce qui se passe
sur le pancréas. Ou autre, pour libérer, par exemple, un enfant qui est
tout le temps occupé à faire avec son doigt dans sa bouche pour faire


comme un phénomène de sucion, peut exprimer un déséquilibre au
niveau de l'attente du cervelet ou de l'occipute. Parce que dans les
phases de développement, tu as des choses qui se sont passées de
façon simultanée, comme la fermeture. La fermeture du palais et la
fermeture de l'attente du cervelet.
69:41 Philippe Guillaume
Il y a aussi la synchronique entre la fermeture du tube neural et la
fermeture du cellome.
69:48 Marc Damoiseaux
Oui, la fermeture du tube neural, la fermeture du cellulome, ce sont
des phénomènes qui vont se passer dans des temps les mêmes, mais
qui nous donnent des points d'appui. N'oubliez pas, un mot, un
regard, le geste est guérisseur.
70:03 Marc Damoiseaux
La langue, c'est le bourgeon du cœur. Et de la langue va apparaître le
bouclier de votre âme, qu'on appelle la thyroïde. Thyroïdeos, ça veut
dire le bouclier. Ça veut dire que la voix est reliée au cœur, mais
qu'elle est électrifiée par la thyroïde. À 7 ans, la thyroïde devient très
fonctionnelle, avec les sinus qui s'ouvrent. Ça veut dire qu'elle vous
donne une force. On dit l'âge de la raison. Vos voix, vos mots peuvent
toucher quelqu'un. Les mains, qui donnent le geste aussi, se
développent sur le cœur et reçoivent une information du cœur très
rapidement sur le plan rythmique. On peut sentir avec le cœur. On
peut dire que les mains, c'est une expansion du cœur, de façon un peu
philosophique. Et puis, il y a une troisième chose, le regard, qui est
très important. Les yeux, au départ, ont un lien très puissant avec le
cœur.


71:00 Marc Damoiseaux
Ils se déposent sur le cœur. On regarde avec son cœur, on touche avec
son cœur et on parle avec son cœur. C'est pour ça que Steele disait
très tôt, c'est une très belle phrase que j'ai trouvée, c'est qu'il faut
redonner la liberté entre le cœur et le cerveau. Il faut qu'il y ait un lien,
il faut que le chemin entre votre cerveau et votre cœur soit libre. Et ça,
c'est tout le mouvement embryonnaire qui nous l'enseigne.
71:25 Philippe Guillaume
reprenons ce mouvement embryonnaire sachant que le cœur est
au-dessus de la tête à un certain stade du développement donc il
n'est pas surprenant de voir un ostéopathe qui travaille le sommet de
la tête ah mais là je sens quelque chose de spécial je suis attiré par le
thorax en même temps mais ce n'est pas la même vitesse et là, en
faisant de l'embryologie
71:48 Marc Damoiseaux
Dans un premier temps, si tu regardes l'apparition primitive du cœur,
il vient de deux grandes parties, on va dire. Il y a une partie qui vient
des cellules épithéliales, qui sont de part et d'autre de la ligne
primitive.


72:02 Marc Damoiseaux
Donc très très tôt, déjà dans l'embryon, il va y avoir à un moment
donné comme un champ d'aspiration qui va attirer ces cellules qui
vont aller au sommet dans la partie qu'on appelle apicale. Vous avez
la partie caudale et apicale, donc la partie la plus haute. Ce n'est pas
la tête, ce sera le lieu où la tête se développera. Donc il y a des cellules
qui vont se développer là, et puis par la notochorte qui va se
développer, il va y avoir une réaction qui va se faire au niveau du tube
neural. Ce tube neural va passer d'une plaque neurale à un tube
neural, avec une partie qui va se développer très fort dans la partie
caudale, dans la partie crâniale, on va dire. Et les cellules qui sont là,
au-dessus, à un moment donné, il y a une vitesse de croissance
différentielle qui fait que le cerveau, va grandir autour du cœur et va
s'enrouler comme ça. Si je fais marche arrière, je vois que les cellules
sont au-dessus, mais que la croissance du cerveau vient s'enrouler
autour du cœur
73:00 Marc Damoiseaux
et que c'est comme ça que ça positionne le cœur. Donc c'est un
enroulement autour de mon cœur. Mais si je fais l'inverse, je retire le
tissu vers l'arrière, je vois que le système revient, que le
développement du cœur est effectivement dans la partie dite apicale.
73:14 Philippe Guillaume
Et ça, on peut le sentir dans les mains.
73:16 Marc Damoiseaux
Et ça, on peut le sentir dans les mains, on peut le percevoir, c'est en
tout cas le mouvement de liberté qu'il doit y avoir entre le cerveau et
le cœur. Moi, je travaille surtout sur cette connexion, je fais confiance
aux tissus.


73:28 Philippe Guillaume
Puisque tu as commencé avec Patrick à faire de la méditation, à te
connaître toi-même, est-ce que tous ces patterns, on peut y avoir
accès par la méditation ?
73:39 Marc Damoiseaux
Dans la méditation, il y a différents degrés. Le tout premier degré de la
méditation, c'est d'abord de développer ce qu'on appelle une
attention. Donc, je développe ma capacité d'être attentif, donc ma
capacité de présence. Tu es plus aiguisé de pouvoir percevoir mieux,
si tu veux, parce que ça t'oblige à être présent. L'acte thérapeutique
est un acte de présence.
74:01 Marc Damoiseaux
Donc, c'est une aide, mais ce n'est pas de la méditation. C'est un outil,
petit à petit, qui permet d'avoir accès.
74:08 Philippe Guillaume
est-ce que tu as déjà ressenti sur toi un pattern par exemple entre la
main et la plèvre ou le cerveau et le cœur ou un mouvement
embryologique qui... tu dis ah ça c'est un mouvement embryologique
74:19 Marc Damoiseaux
On se développe autour de nos vaisseaux. Et c'est ça qui est très
important, c'est que l'axe de croissance, d'orientation, c'est une
vitesse de croissance différentielle. À un moment donné, va se faire
entre les tubes endothéliales et les tissus épithéliaux derrière, si tu
veux. Donc, quand je travaille sur mon propre corps et que je fais mon
propre tachy, je suis conscient de mon axe vasculaire et je me travaille


sur cet axe vasculaire. Parce que c'est ça qui va orienter tous les
mouvements. J'ai dans une...
74:47 Philippe Guillaume
de mouvements qui emprunte ce chemin là tu veux dire voilà
Peut-être pas dans son originalité, mais dans son...
74:55 Marc Damoiseaux
Non seulement je me mets sur la croissance, mais je vais libérer une
articulation en étant très attentif de libérer l'artère.
75:04 Philippe Guillaume
Et ça donne du sens au chemin que propose Patrick avec la
méditation dès le début qui te permet de te déposer en sensation
dans le tissu conjonctif, le tissu de confort, celui qui permet la
circulation, les échanges pour arriver au tissu de limite. Effectivement,
ainsi, on va vers l'écoute de la santé car on va la sentir émerger en soi.
Ce sera beaucoup plus simple ensuite d'être à l'écoute en ostéopathie
biodynamique et d'écouter la santé et de l'accompagner chez le
patient. D'ailleurs, j'ai une anecdote. En méditation, j'étais dans un
état de détente où la santé pouvait librement s'exprimer jusqu'à
détendre mes membranes crâniennes. Mais à un moment donné, ça
s'est ralenti et j'ai ressenti une localisation derrière mon œil, gauche
en l'occurrence.
76:00 Philippe Guillaume
plus rien ne s'exprimait. Mais en rentrant dans un autre plus profond
et avec une forme d'intuition, et aussi parce que j'avais la
connaissance de l'embryologie, s'est affiché, s'est exprimé, s'est
dessiné le pattern du développement de l'œil. Et là, c'est
extraordinaire de pouvoir associer une méditation, le mouvement de


la santé, le mouvement tissulaire et aussi le pattern embryologique.
76:31 Marc Damoiseaux
Oui, oui, tout à fait. Ça nous amène aux yeux que tu parles là. L'œil,
c'est un cerveau extériorisé.
76:37 Philippe Guillaume
l'expansion du troisième entrée.


76:39 Marc Damoiseaux
C'est un peu une convergence de tous les faciaires, interne et externe.
J'ai eu l'occasion de bien approfondir ce cours sur l'œil. Il y a une
convergence des tissus que l'œil va regarder presque par son système
facial, l'endroit où c'est fixé. Il est capteur d'énormément
d'informations. Prenant les yeux, tu peux aller vers un point de
fixation primaire,
77:03 Marc Damoiseaux
même sur un plan énergétique, même sur un plan purement de
photons.
77:07 Philippe Guillaume
Merci de le rappeler parce qu'effectivement, certaines approches
thérapeutiques comme la bio-kinergie, avec ses perceptions de points
et des volumes à distance du corps, évoquent cette forme d'écoute
subtile du vivant. D'ailleurs, on a pareil en ostéopathie biodynamique
avec les zones A et B. Ces approches rejoignent la notion scientifique
des bio-photons, ces émissions ultra faibles qui constituent un
véritable réseau de communication cellulaire. On en parle d'ailleurs
avec Michel Liderot dans le podcast sur l'harmonisation
psychocorporelle à propos des études scientifiques consacrées au
rôle informationnel de la lumière. Je vous invite à l'écouter, voire le
réécouter. Et ce que tu dis Marc nous y ramène, car l'œil, dans sa
construction embryologique, illustre parfaitement cette intelligence
de la lumière. Il relie le subtil au concret.
78:02 Philippe Guillaume
Par sa main et sa sensibilité, le thérapeute écoute les mouvements
mineurs des tissus. Et par son regard, il capte cette information
photonique qui lui donne accès à des plans plus subtils. Cela permet à


l'information de circuler plus librement, rétablissant une cohérence
énergétique et entraînant, par enroulement électromagnétique, une
dynamique régénérative dans les fluides et à l'intérieur des tissus. Ce
savoir est passionnant. Car il nous rappelle que la vie se déploie dans
un champ informationnel en mouvement, à la fois photonique et de
matière, où la lumière devient forme et la forme à son tour redevient
lumière. Eh bien Marc, je te remercie. Je crois qu'on a fait une bonne
initiation de ton enseignement sur l'embryologie biodynamique
comme tu nous la proposes.
79:01 Philippe Guillaume
Merci d'avoir remis à l'endroit le sens de l'apprentissage, car repartir
de la construction du vivant, des champs de polarité, d'où va émerger
le mouvement développemental, pour aboutir enfin à l'anatomie
finale. Merci aussi d'avoir replacé la méditation au début du parcours
de l'étudiant, parce qu'elle nous permet à la fois d'aller à la rencontre
de cette santé, de rentrer en conscience avec elle, de ressentir le
mouvement inhérent émergeant. Et aussi parce que c'est plus facile
de l'écouter chez son patient si, chez soi-même, on a fait en sorte de la
sentir circuler. Et pour ceux qui, comme moi, ont suivi ce cours, merci
parce qu'on perçoit clairement que lorsqu'on est pleinement présent
dans ce fameux maintenant et que l'on accède à ces fameux patterns
embryonnaires, toute la puissance que cela apporte à notre soin.
80:02 Marc Damoiseaux
Merci à toi Philippe, c'était un réel plaisir. J'ai beaucoup d'élèves au
bout du compte en 25 ans d'études, mais tu es le seul qui a pris le
courage et la volonté de l'étudier, de le réécouter plusieurs fois parce
que c'est comme ça qu'on apprend. Et donc je te remercie à toi pour
tout ça.


80:20 Philippe Guillaume
Donc, je te dis à bientôt.
80:21 Marc Damoiseaux
A bientôt Philippe, très bientôt.



`
    },
    {
        id: "link-marc-site",
        title: "Le Site de Marc Damoiseaux",
        author: "Site Web Officiel",
        description: "Découvrez l'intégralité des travaux, textes et parcours de Marc Damoiseaux. Explorez la source originelle de cette approche biodynamique.",
        thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&h=400&auto=format&fit=crop", // Image de livres/étude par défaut
        externalLink: "https://www.marcdamoiseaux.com"
    }
];
