# 📣 FeelProd Email Update Suite (Embryologie Biodynamique)

Ce dossier regroupe la suite complète et autonome de communication par e-mail pour l'application **Embryologie Biodynamique** (par Marc Damoiseaux & Guillaume Philippe / FeelProd).

---

## 📂 Contenu du dossier

- **`TEMPLATE_MASTER_FEELPROD.html`** : Le template HTML responsive V13 validé.
  - Sceau WUWAI monoligne au sommet : `WUWAI  « Le non-agir »`.
  - En-tête aéré sur 2 lignes : *Une expérience clinique encore plus fluide*.
  - Les 4 cartouches de nouveautés au standard *Top-Bar + Pleine Largeur* (Fiches & Recueil PDF, Tiroir Historique, Boutons Vidéo séparés, Podcasts 6 langues).
  - Encadré d'actualisation de l'application (mobile & ordinateur).
  - Bouton vibrant FeelProd `#F27D33` vers l'application.
  - Règle anti-débordement iOS (`table-layout: fixed; max-width: 640px`).
- **`generate_update_email.py`** : Script Python autonome pour prévisualiser ou expédier l'e-mail via SMTP SSL (Gmail FeelProd).
- **`assets/`** : L'ensemble des images et boutons réels de l'application :
  - `banner_embryo.png` : Bannière panoramique Retina 3D (iPhone titane incliné sur fond crème parchemin).
  - `exact_btn_1_pdf.png` : Bouton pilule blanc `[ <Share2 /> PDF ∨ ]`.
  - `icon_cartouche_2_history.png` : Carré terracotta Lucide `History`.
  - `exact_btn_3_video_duo.png` : Duo d'icônes `Video` et `DownloadCloud`.
  - `icon_cartouche_4_podcasts.png` : Carré or solaire Lucide `Headphones`.
  - `logo_wuwai.png` : Ensō circulaire du logo Wuwai.
- **`Email_Mise_a_Jour_Embryo_Premium.html`** : Version HTML autonome (images encodées en Base64) prête à être visualisée dans n'importe quel navigateur sans serveur web.

---

## 🚀 Utilisation (Ligne de commande)

Depuis ce dossier :

```bash
# 1. Générer et actualiser le fichier HTML autonome
python3 generate_update_email.py --preview

# 2. Envoyer en direct aux adresses de test de Guillaume (Gmail & iCloud)
python3 generate_update_email.py --send

# 3. Envoyer le lot officiel complet (Marc Damoiseaux, les acheteurs Stripe Gilles Ducret & Karl Massou, et Guillaume Philippe)
python3 generate_update_email.py --batch

# 4. Envoyer à une adresse e-mail personnalisée
python3 generate_update_email.py --send --recipient client@exemple.com
```

---

## 🔒 Confidentialité & Destinataires
Le script intègre la salutation personnalisée dynamique (`Bonjour Marc,`, `Bonjour Gilles,`, `Bonjour Karl,`, `Bonjour Guillaume,`).
Les acheteurs sont synchronisés avec la table `profiles` de Supabase (`tier: premium`).
