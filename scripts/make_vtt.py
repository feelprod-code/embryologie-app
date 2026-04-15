import re
import os

text = """[00:00:01:54 - 00:00:12:07]
 Le mouvement régénérateur inspiré du mouvement développemental de l'ambryon. Position initiale.

[00:00:14:34 - 00:00:19:06]
 Pousse de la main droite dans la main gauche, pied parallèle.

[00:00:32:08 - 00:00:33:04]
 Lageur des épaules.

[00:00:34:57 - 00:00:37:28]
 Le dos est droit et détendu.

[00:00:40:35 - 00:00:41:47]
 Légère flexion des genoux.

[00:00:48:15 - 00:00:53:50]
 Et observation des différentes lignes médiennes. La ligne médienne,

[00:00:55:29 - 00:00:58:49]
 notocordale, postérieur et intérieur.

[00:01:02:56 - 00:01:10:17]
 On observe bien la sphère neuro-sensoriale, rythmique, métabolique, uruginitale.

[00:01:16:42 - 00:01:19:54]
 Essayez de les ressentir, de vous équilibrer.

[00:01:20:55 - 00:01:27:27]
 Dans un premier temps, le mouvement lovul est sphérique.

[00:01:28:54 - 00:01:35:55]
 Vous dessinez dans l'espace une sphère devant vous qui représente le vul.

[00:01:50:53 - 00:01:58:14]
 La première fonction de l'ovule en création est la polarisation primitive.

[00:02:00:57 - 00:02:04:03]
 Un axe est oeste.

[00:02:07:52 - 00:02:12:42]
 Et un axe nord-sud. Nord-sud.

[00:02:17:57 - 00:02:20:55]
 Et avant et arrière.

[00:02:28:51 - 00:02:30:05]
 Arrivé du spermatozoïde.

[00:02:42:23 - 00:02:45:47]
 Pénétration du spermatozoïde dans l'ovule.

[00:02:47:45 - 00:02:54:57]
 Et le premier clivage apparaît. Vous dessinez devant vous dans l'espace les deux premiers blastomers.

[00:02:57:36 - 00:03:00:56]
 Vous pouvez vous prener l'ensemble, division cellulaire.

[00:03:02:54 - 00:03:09:06]
 Et vous déposez cette sphère vers le bas au niveau du ventre.

[00:03:11:49 - 00:03:16:09]
 Dans un premier temps, pas de croissance, mais multiplication cellulaire.

[00:03:17:59 - 00:03:25:57]
 Ensuite, le 4e mouvement, c'est l'éclosion.

[00:03:31:25 - 00:03:40:52]
 Suivi de la nedation, apparition de la cavité amiotique,

[00:03:43:26 - 00:03:46:04]
 et du cellulum externe, croissance.

[00:03:52:50 - 00:04:07:43]
 Formation du pédicule embryonnais. Mise en place de la ligne primitive, fermée la tirette. Ensuite, grande vague, notocordale.

[00:04:09:01 - 00:04:38:39]
 Ensuite, vous imaginez un embryon couché devant vous, tête vers les mains. Formation de la gouttière norelle. Le tube norel se ferme. Et le tube norel se ferme. Et le tube norel se ferme. Et le tube norel se ferme. Et le tube norel se ferme.

[00:04:40:54 - 00:04:45:47]
 Et mise en place, petit à petit, de la motilité du cerveau en croissance.

[00:04:48:42 - 00:04:50:22]
 Expansion du cerveau.

[00:04:52:48 - 00:04:55:41]
 Flexion supmaisoncéphalique.

[00:04:56:42 - 00:05:09:35]
 Suivi de l'afflexion cervicale. Et de la mise en place, ici, du pont.

[00:05:15:26 - 00:05:17:02]
 Phase de télencephalisation.

[00:05:20:52 - 00:05:24:44]
 Oxyputes et temporales dans les mains.

[00:05:35:53 - 00:05:43:22]
 Les mains. Mouvement de développement du cœur. Depuis la ligne primitive, vous descendez les mains vers le coccyx.

[00:05:45:39 - 00:05:59:18]
 Vous joignez les mains vers l'avant, au-dessus de la tête. Fusion des deux tubes.

[00:06:00:34 - 00:06:02:45]
 Et looping du cœur.

[00:06:03:50 - 00:06:07:11]
 Descente de la main droite en rotation vers la gauche.

[00:06:09:04 - 00:06:10:36]
 Mouvement de développement du cœur.

[00:06:14:03 - 00:06:17:46]
 Mouvement de développement du diaphragme.

[00:06:22:37 - 00:06:28:35]
 Et les pousses vont former ici les piliers diaphragmatiques.

[00:06:29:36 - 00:06:51:34]
 Formation de la délimitation embryonnaire. Formation de la zone B, la poche des eaux, toute la cavité amiotique. On part derrière le dos. C'est comme si on étendait un grand ballon de beaux de ruche vers l'avant. On était ici.

[00:06:52:35 - 00:07:20:52]
 Et la réunion de la vésicule vitéline et de la cavité amiotique. Et du pédicule embryonnaire va former le cordon embédical. Ensuite, on monte des mains au niveau de l'angle de Louis. On va faire un petit tour de la main. On va faire un petit tour de la main. Ensuite, on monte des mains au niveau de l'angle de Louis.

[00:07:23:52 - 00:07:26:46]
 Et mise en place la formation des poumons.

[00:07:28:09 - 00:07:29:49]
 Overture, inspiration.

[00:07:36:32 - 00:07:38:49]
 On remonte les mains vers le haut.

[00:07:40:57 - 00:07:42:40]
 Et formation du mouvement des reins.

[00:07:48:33 - 00:07:53:56]
 On descend. Concentration. Prenez front, baisonnez front, méta n'est front.

[00:07:56:14 - 00:07:59:06]
 Rapport entre les reins et la descente du sacrum.

[00:08:03:04 - 00:08:06:30]
 Mouvement de développement de l'espace sous-diaphragmatique.

[00:08:07:48 - 00:08:10:17]
 Vous tenez un ballon du côté gauche.

[00:08:11:50 - 00:08:14:43]
 Et vous roulez le ballon pour former l'espace.

[00:08:16:41 - 00:08:20:08]
 Et patot gastro-pancreaticot linéal.

[00:08:23:51 - 00:08:25:50]
 Ensuite, rotation de l'intestin.

[00:08:27:14 - 00:08:34:27]
 La main droite passe au-dessus de la main gauche. C'est comme si vous tourniez dans le sens anti-horaire.

[00:08:36:53 - 00:08:43:54]
 L'intestin se forme avec la main droite qui forme le collon ascendant. C'est comme.

[00:08:49:18 - 00:08:50:32]
 Ensuite, on rapproche les mains.

[00:08:52:02 - 00:09:00:45]
 Au niveau du péritoine parietal postérieur. On concentre. On rapproche les mains vers la ligne médiane. On descend vers le pubis.

[00:09:02:05 - 00:09:08:34]
 On remonte pour pour former l'utérus ou la prostate.

[00:09:11:40 - 00:09:18:25]
 On remonte les mains au niveau des épaules. Mouvement développemental des membres supérieurs et inférieurs. Ici, on fait les membres supérieurs.

[00:09:19:27 - 00:09:21:47]
 Rotation externe.

[00:09:23:21 - 00:09:26:58]
 Les pousses et les mains se tournent pour tenir un petit embryon.

[00:09:28:59 - 00:09:33:24]
 Les mains représentent ce petit embryon en formation.

[00:09:34:25 - 00:09:59:52]
 On ramène les mains dans la position initiale. On prend le pouce droit avec la main gauche. On descend au niveau d'ambilique pour retrouver la posture initiale. On prend conscience de cette posture. On prend quoi ? On prend cette posture.

[00:10:02:35 - 00:10:15:20]
 On prend conscience de retrouver son axe, la chaîne centrale. Vertex, corcailleux, synphyséno-basilaire, oeufage, trachée, péricarte,

[00:10:16:44 - 00:10:31:29]
 centre-fraînique, avec la faute du cerveau, la racine du maisantère, jusqu'en bas. On est bien centré et on retrouve son équilibre, sa balance."""

lines = text.split('\n')
vtt = "WEBVTT\n\n"

i = 0
while i < len(lines):
    line = lines[i].strip()
    if line.startswith('['):
        match = re.search(r'\[(\d{2}:\d{2}:\d{2}):(\d{2})\s*-\s*(\d{2}:\d{2}:\d{2}):(\d{2})\]', line)
        if match:
            start = f"{match.group(1)}.{match.group(2)}0"
            end = f"{match.group(3)}.{match.group(4)}0"
            vtt += f"{start} --> {end}\n"
            
            content = ""
            j = i + 1
            while j < len(lines) and lines[j].strip() != "" and not lines[j].strip().startswith('['):
                content += lines[j].strip() + " "
                j += 1
            
            vtt += content.strip() + "\n\n"
            i = j - 1
    i += 1

output_path = os.path.join(os.path.dirname(__file__), '../public/vtt/8f890e7f51588216db016b73a8a97a14_fr.vtt')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(vtt)
print('Created VTT: ' + output_path)
