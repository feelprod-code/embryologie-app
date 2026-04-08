# Règles Spécifiques : Embryologie App

## Directives UI
1. **VideoPlayerPage Mobile Layout**: Le layout des boutons de catégories ("L'Ectoderme", etc.) DOIT impérativement rester en `grid grid-cols-4` pour éviter le scroll horizontal, et avec des styles ajustés (`px-0.5 sm:px-2 md:px-4 py-1.5`) et une très grosse police (`text-[14px] min-[375px]:text-[15px] sm:text-[17px] md:text-[20px] lg:text-2xl`), comme validé par l'utilisateur. Toute modification future ne doit PAS écraser ça.
2. **VideoPlayerPage Subtitles**: La surbrillance colorée des sous-titres (background color en fonction du thème de la couche embryonnaire) DOIT être appliquée UNIQUEMENT si l'`isAutoScrollEnabled` est `true` ET si le `contentMode` est réglé sur `'transcript'`. Elle ne doit pas apparaître lors de la lecture du résumé !
3. **DO NOT USE `overflow-x-auto`**: Pour les onglets de filtres sur la page vidéo (L'Ectoderme, L'Oeil, Le Mésoderme, L'Endoderme). Ils doivent rester en grille de 4, sans ascenseur horizontal.

## Note UI Globale 
- Les boutons/call-to-actions orange (ex: '#F27D33') doivent TOUJOURS avoir un design 'flat'. Aucune ombre portée (box-shadow) ni lueur diffuse.
