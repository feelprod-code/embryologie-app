# Comment revenir à la version iPhone qui fonctionne (sans le bug de la vidéo)

Si jamais dans le futur le lecteur vidéo de l'iPhone se recasse (barre de lecture invisible, contenu qui remonte, etc.), vous pouvez toujours revenir **immédiatement** au code actuel qui est certifié fonctionnel.

J'ai posé une "balise GPS" ineffaçable sur le code d'aujourd'hui.

Tapez simplement cette commande dans votre Terminal (dans le dossier embryologie-app) :

```bash
git checkout v1.0.0-ios-stable
```

Cela annulera toutes les bêtises du futur et vous ramènera exactement à l'état du lecteur vidéo d'aujourd'hui, avec le pinch zoom, la barre de lecture de Cloudflare visible, et le bon margin sur mobile.
