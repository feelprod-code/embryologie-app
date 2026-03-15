# Intégration Stripe - Walkthrough

## Objectif
Permettre l'achat d'un accès Premium définitif ("Abonnement Embryologie") via la plateforme Stripe Checkout et débloquer les vidéos de l'application automatiquement après paiement.

## Éléments Implémentés

### 1. Supabase Edge Functions (Backend Sécurisé)
Deux fonctions majeures ont été déployées sur Supabase :
* **`create-checkout-session`** : Reçoit l'identifiant de l'utilisateur de l'application (le `Paywall`), contacte l'API Stripe en secret, génère une URL de paiement unique (Checkout) contenant l'ID du produit (Price ID) et renvoie cette URL à l'application. Elle associe aussi le `client_reference_id` à l'utilisateur Supabase pour garantir la traçabilité. Note : Cette fonction a été ouverte sans JWT pour permettre aux utilisateurs non-connectés de cliquer sur "Acheter".
* **`stripe-webhook`** : Fonctionne en arrière-plan. Lorsque Stripe confirme qu'une carte bleue a été débitée (`checkout.session.completed`), Stripe appelle cette fonction via une signature secrète. La fonction lit le `client_reference_id`, identifie l'utilisateur dans la table `profiles` de Supabase et bascule son statut `is_premium` à `true`. Note : Elle a été configurée avec `--no-verify-jwt` pour permettre à Stripe (qui n'a pas de token Supabase) de l'appeler.

### 2. Application Frontend (UI/UX)
* **Composant `Paywall.tsx`** : Le mur de paiement s'affiche si l'utilisateur n'est pas Premium ni Admin. Le bouton d'achat noir a été repensé (gris : `bg-slate-700`) avec un état de chargement visuel anti-clics multiples (`isLoading`). Un clic transmet la demande à `create-checkout-session` puis redirige vers Stripe.
* **Composant `SuccessOverlay.tsx`** : Création d'un pop-up global (Overlay). Au retour du site de Stripe, si l'URL contient `?success=true`, une modale translucide verte apparaît au-dessus de tout le reste.
* **Composant `App.tsx`** : Intègre le `SuccessOverlay`. Maintient la page affichée pendant 3,5 secondes (le temps que le Webhook finisse son travail en base de données), nettoie l'URL et, au bout du timer, l'interface déverrouille instantanément les sections vidéo.

## Validation des Tests
- [x] L'URL du Paywall pointe bien vers la page de paiement officielle de Stripe pour le produit *"Abonnement Embryologie"*.
- [x] Le bouton affiche bien le "Chargement" pendant l'appel à la fonction Edge.
- [x] Le paiement simulé par carte passe avec succès.
- [x] La redirection vers l'application affiche la page de succès verte "Paiement Réussi !".
- [x] Le Webhook reçoit l'information et donne les droits `is_premium = true`.
- [x] Au bout des 3 secondes, l'écran de succès disparaît et l'accès Premium est accordé.

L'intégration de paiement décentralisée et entièrement automatisée pour le déblocage du contenu éducatif est désormais achevée.
