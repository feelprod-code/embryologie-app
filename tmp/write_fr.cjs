const fs = require('fs');
const path = require('path');

const userSrt = `1
00:00:00,833 --> 00:00:02,866
On va se rendre compte que l'œil nous

2
00:00:02,866 --> 00:00:04,666
donne une énorme illusion.

3
00:00:05,133 --> 00:00:06,533
Par exemple, vous avez l'impression que

4
00:00:06,533 --> 00:00:07,633
j'existe devant vous.

5
00:00:08,300 --> 00:00:09,466
Vous avez vraiment cette impression.

6
00:00:10,733 --> 00:00:12,433
En fait, je suis en mirage.

7
00:00:12,633 --> 00:00:15,266
Yonah Messie a écrit un livre.

8
00:00:16,166 --> 00:00:19,933
La Terre, la planète, comme soi-même.

9
00:00:20,666 --> 00:00:22,133
C'est de considérer la Terre peut-être

10
00:00:22,133 --> 00:00:22,866
comme moi-même, dans

11
00:00:22,866 --> 00:00:23,733
un notion de respect.

12
00:00:24,566 --> 00:00:25,633
Et puis de considérer la

13
00:00:25,633 --> 00:00:26,966
Terre comme une bien-aimée.

14
00:00:28,000 --> 00:00:28,933
Je vais vous parler de ce

15
00:00:28,933 --> 00:00:30,066
qu'on appelle les agrégats.

16
00:00:31,333 --> 00:00:32,233
Finalement, nous sommes

17
00:00:32,233 --> 00:00:33,200
une somme d'agrégats.

18
00:00:33,433 --> 00:00:35,433
Une composition, un moment tanné,

19
00:00:35,666 --> 00:00:36,366
impermanente,

20
00:00:36,933 --> 00:00:39,600
interdépendante, qui vient et qui part.

21
00:00:41,233 --> 00:00:42,366
Dans ces agrégats, on

22
00:00:42,366 --> 00:00:43,633
parle entre autres de la forme.

23
00:00:44,066 --> 00:00:45,600
Et on parle entre autres de la Terre.

24
00:00:46,899 --> 00:00:48,466
Et aussi du grand jeu des perceptions.

25
00:00:49,066 --> 00:00:50,766
Parce qu'on va travailler un peu avec ce

26
00:00:50,766 --> 00:00:51,533
grand jeu des perceptions.

27
00:00:52,533 --> 00:00:56,266
Nos perceptions, si l'observe bien, ne

28
00:00:56,266 --> 00:00:58,033
sont que comme des mirages.

29
00:00:59,500 --> 00:01:00,266
En fait, il y a quelque

30
00:01:00,266 --> 00:01:01,933
chose de très flou finalement.

31
00:01:02,566 --> 00:01:05,033
On pense, parce qu'on a fixé les choses,

32
00:01:05,666 --> 00:01:06,433
mais finalement c'est

33
00:01:06,433 --> 00:01:07,333
quand même assez flou.

34
00:01:07,833 --> 00:01:09,166
Donc c'est cette notion

35
00:01:09,166 --> 00:01:11,033
d'interprétation, comment on voit les

36
00:01:11,033 --> 00:01:12,233
choses qui sont autour de nous.

37
00:01:12,633 --> 00:01:15,766
Et donc le jeu qui s'est construit,

38
00:01:15,766 --> 00:01:17,466
finalement, c'est

39
00:01:17,466 --> 00:01:18,966
aussi une interprétation.

40
00:01:20,000 --> 00:01:21,099
Une interprétation des

41
00:01:21,099 --> 00:01:22,133
choses, des phénomènes.

42
00:01:23,000 --> 00:01:23,900
Finalement, nous

43
00:01:23,900 --> 00:01:25,733
sommes une féménologie.

44
00:01:26,133 --> 00:01:29,000
L'idée c'est que nous pourrions un peu

45
00:01:29,000 --> 00:01:30,400
changer ce mode de perception.

46
00:01:31,133 --> 00:01:32,200
Aller peut-être dans un

47
00:01:32,200 --> 00:01:36,133
autre mirage, un peu plus grand.

48
00:01:37,466 --> 00:01:39,799
Peut-être aussi grand que la planète.

49
00:01:40,599 --> 00:01:42,266
Si on a cette conscience, qu'on serait

50
00:01:42,266 --> 00:01:43,533
comme cette planète et

51
00:01:43,533 --> 00:01:44,266
qu'on prend conscience,

52
00:01:45,333 --> 00:01:46,666
on prendra peut-être un peu

53
00:01:46,666 --> 00:01:47,966
plus soin de cette planète.

54
00:01:48,033 --> 00:01:52,133
Parce qu'on est dans une société où on

55
00:01:52,133 --> 00:01:52,966
est dans la croissance.

56
00:01:53,933 --> 00:01:55,166
Mais en fait, on fonctionne complètement

57
00:01:55,166 --> 00:01:56,233
dans ce mode de croissance.

58
00:01:56,866 --> 00:01:59,666
On est complètement pris là-dedans,

59
00:01:59,666 --> 00:02:01,000
dans cette croissance industrielle, dans

60
00:02:01,000 --> 00:02:03,166
cette croissance qui finalement

61
00:02:03,166 --> 00:02:05,400
considère le monde comme quelque chose

62
00:02:05,400 --> 00:02:07,466
d'infini, alors que nous

63
00:02:07,466 --> 00:02:08,433
sommes dans un monde fini.

64
00:02:09,233 --> 00:02:09,833
Il n'y a pas de...

65
00:02:10,400 --> 00:02:11,433
Il y a un vrai changement.

66
00:02:12,066 --> 00:02:13,433
Et si je vous parle de ça, c'est parce

67
00:02:13,433 --> 00:02:15,433
que je voudrais vous proposer,

68
00:02:16,766 --> 00:02:18,300
vous vous inviter à une

69
00:02:18,300 --> 00:02:19,400
vue un peu différente.

70
00:02:20,033 --> 00:02:21,500
Soit on arrive à faire ce tournant,

71
00:02:22,500 --> 00:02:23,333
soit on va de toute

72
00:02:23,333 --> 00:02:24,466
façon vers un effondrement.

73
00:02:24,766 --> 00:02:28,133
C'est une évidence de par le fait que

74
00:02:28,133 --> 00:02:29,666
c'est des théories d'émergence.

75
00:02:30,000 --> 00:02:32,366
Et ce sera des théories d'émergence qui

76
00:02:32,366 --> 00:02:34,933
sont toujours vues en

77
00:02:34,933 --> 00:02:36,099
tant que même dans le corps.

78
00:02:36,433 --> 00:02:37,866
Il émerge et puis il s'effondre.

79
00:02:38,666 --> 00:02:40,166
Et la société dans laquelle on est, on

80
00:02:40,166 --> 00:02:41,466
est vers ce point de bascule.

81
00:02:42,500 --> 00:02:43,599
Je pense que nous en tant que

82
00:02:43,599 --> 00:02:45,233
thérapeutes, on a un

83
00:02:45,233 --> 00:02:46,766
rôle en fait à jouer.

84
00:02:47,599 --> 00:02:50,833
Un rôle à jouer de peut-être amener

85
00:02:50,833 --> 00:02:52,800
nos patients par ces soulagements de la

86
00:02:52,800 --> 00:02:54,433
souffrance qu'on fait, mais aussi par

87
00:02:54,433 --> 00:02:57,066
cette notion d'un peu s'ouvrir, tu vois.

88
00:02:57,766 --> 00:02:59,699
Andreas Messy disait, il nous faudra

89
00:02:59,699 --> 00:03:01,633
trois choses, trois choses pour

90
00:03:01,633 --> 00:03:03,133
peut-être faire ce tournant.

91
00:03:04,366 --> 00:03:07,066
La toute première chose, c'est quelque

92
00:03:07,066 --> 00:03:08,066
part, on doit un peu se

93
00:03:08,066 --> 00:03:08,966
mobiliser quand même.

94
00:03:09,433 --> 00:03:10,866
Il y a eu des mouvements comme ça qui se

95
00:03:10,866 --> 00:03:12,133
sont faits, où on doit

96
00:03:12,133 --> 00:03:13,800
dire, maintenant c'est non.

97
00:03:15,033 --> 00:03:17,266
Mais c'est non, pas spécialement, tu

98
00:03:17,266 --> 00:03:19,000
vois, c'est aussi non, soit.

99
00:03:19,800 --> 00:03:22,033
Deuxième chose qui est importante, c'est

100
00:03:22,033 --> 00:03:22,766
créer de nouvelles

101
00:03:22,766 --> 00:03:24,033
idées, de nouvelles formes.

102
00:03:24,266 --> 00:03:27,366
Ça nous amène à être créateurs,

103
00:03:28,033 --> 00:03:31,033
penseurs, et ça nous amène à une

104
00:03:31,033 --> 00:03:32,066
troisième chose qui est très

105
00:03:32,066 --> 00:03:33,166
importante, c'est

106
00:03:33,166 --> 00:03:34,233
faire un travail spirituel.

107
00:03:34,833 --> 00:03:36,133
En tout cas, c'est ce

108
00:03:36,133 --> 00:03:37,966
que propose Jonas Messy.

109
00:03:38,033 --> 00:03:40,300
Si ces trois conditions ne sont pas

110
00:03:40,300 --> 00:03:42,400
réunies, on ne va pas

111
00:03:42,400 --> 00:03:44,000
pouvoir faire ce tournant.

112
00:03:44,933 --> 00:03:45,833
On sera limité.

113
00:03:46,466 --> 00:03:47,333
Finalement, c'est un

114
00:03:47,333 --> 00:03:48,900
travail que l'on fait ici aussi,

115
00:03:49,933 --> 00:03:51,533
c'est-à-dire de développer la belle

116
00:03:51,533 --> 00:03:54,166
conscience, le bon cœur.

117
00:03:54,566 --> 00:03:55,966
C'est se poser un peu la question,

118
00:03:55,966 --> 00:03:57,133
comment on peut un peu réduire la

119
00:03:57,133 --> 00:03:58,366
souffrance aussi, pas

120
00:03:58,366 --> 00:03:59,633
que là, que la vôtre.

121
00:04:00,500 --> 00:04:01,866
Parce que la plupart du temps, on est

122
00:04:01,866 --> 00:04:02,966
juste dans le plaisir de nos sens.

123
00:04:03,000 --> 00:04:05,333
Et donc, c'est cette notion que je vais

124
00:04:05,333 --> 00:04:06,066
vous proposer, c'est

125
00:04:06,066 --> 00:04:07,300
d'apprendre à vous observer,

126
00:04:09,000 --> 00:04:09,433
d'apprendre à

127
00:04:09,433 --> 00:04:11,133
observer vos comportements.

128
00:04:11,766 --> 00:04:13,733
On a ce rôle d'apprendre à enseigner

129
00:04:13,733 --> 00:04:17,000
aux autres peut-être une autre forme de

130
00:04:17,000 --> 00:04:19,233
plaisir, que juste nos plaisirs de nos

131
00:04:19,233 --> 00:04:21,866
sens, comme découvrir le

132
00:04:21,866 --> 00:04:23,366
plaisir de la simplicité,

133
00:04:25,000 --> 00:04:28,066
le plaisir d'une présence authentique,

134
00:04:30,266 --> 00:04:34,966
le plaisir qui peut venir de la relation

135
00:04:34,966 --> 00:04:37,433
aux choses plutôt que de

136
00:04:37,433 --> 00:04:38,933
la possession des choses,

137
00:04:40,766 --> 00:04:44,600
le plaisir du contentement qui vient

138
00:04:44,600 --> 00:04:45,966
d'une certaine neutralité.

139
00:04:47,233 --> 00:04:49,333
Alors, la joie du renoncement.

140
00:04:50,166 --> 00:04:52,666
Au début, quand tu lis des textes comme

141
00:04:52,666 --> 00:04:53,966
ça, Bouddhiste, tu vois, le Bouddha

142
00:04:53,966 --> 00:04:57,133
disait, au début, mon cœur était

143
00:04:57,133 --> 00:04:58,899
fâché de devoir renoncer.

144
00:05:00,000 --> 00:05:02,866
Et puis maintenant, que je l'ai vécu, je

145
00:05:02,866 --> 00:05:06,033
bondis de joie dans ce relâchement.

146
00:05:06,233 --> 00:05:08,033
Mon cœur bondit de joie de pouvoir

147
00:05:08,033 --> 00:05:10,766
renoncer à certaines choses.

148
00:05:12,233 --> 00:05:14,066
Je vous propose de réfléchir comme ça.

149
00:05:14,066 --> 00:05:15,500
Qu'est-ce que vous pourriez abandonner,

150
00:05:16,466 --> 00:05:17,866
qui vous ajoute en

151
00:05:17,866 --> 00:05:18,766
fait de la souffrance ?

152
00:05:21,133 --> 00:05:22,433
Qui ajoute de la souffrance dans ma vie,

153
00:05:23,000 --> 00:05:25,199
ou même aux autres ?

154
00:05:27,666 --> 00:05:29,133
Et donc, je pense que, je vous dis, en

155
00:05:29,133 --> 00:05:31,966
tant que thérapeute, on a peut-être ce

156
00:05:31,966 --> 00:05:34,533
rôle aussi d'une certaine façon,

157
00:05:34,833 --> 00:05:36,066
d'ouvrir cette conscience,

158
00:05:37,566 --> 00:05:41,666
qu'on va devoir basculer un peu vers ce

159
00:05:41,666 --> 00:05:43,233
niveau-là, et de retrouver

160
00:05:43,233 --> 00:05:44,633
peut-être un peu de simplicité.

161
00:05:46,199 --> 00:05:48,566
Ça veut dire qu'à un moment donné,

162
00:05:48,566 --> 00:05:51,266
vous allez presque avoir une joie de

163
00:05:51,266 --> 00:05:53,966
perdre certains de vos privilèges.`;

const vttContent = "WEBVTT\n\n" + userSrt.replace(/,/g, '.');
const frPath = path.join('public/vtt', '72e294c6fe48e57cba3f2da10f7a98f7_fr.vtt');
fs.writeFileSync(frPath, vttContent, 'utf8');

console.log("Written the exact provided subtitles to FR vtt.");
