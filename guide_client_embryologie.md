# GUIDE D'ACCÈS ET SUPPORT CLIENT: APPLICATION EMBRYOLOGIE BIODYNAMIQUE

Ce document vous explique très simplement comment fonctionne le système d'accès à l'application web, comment l'expliquer à vos élèves, et comment résoudre leurs problèmes s'ils vous contactent.

---

## 1. COMPRENDRE LE SYSTÈME DE SÉCURITÉ ("Lien Magique" + "Blocage Appareil")

Afin de protéger votre contenu vidéo payant et d'éviter que vos élèves ne partagent leur accès avec d'autres personnes sur Internet, l'application utilise une sécurité en deux étapes :

1.  **Le Lien Magique ("Magic Link") :** L'élève ne tape jamais de mot de passe. Il rentre son e-mail sur l'application. Celle-ci lui envoie un email contenant un bouton cliquable qui prouve son identité.
2.  **L'Empreinte de l'Appareil ("Device Fingerprinting") :** Dès qu'un élève clique sur son *tout premier* lien magique, **l'application mémorise l'ordinateur, la tablette ou le téléphone qu'il est en train d'utiliser.** Son adresse e-mail devient définitivement *soudée* à cet appareil physique.

Si l'étudiant essaie de se connecter sur le téléphone de sa copine ou de transférer le courriel à un collègue, l'application verra que ce n'est pas le "bon" appareil et affichera une alerte rouge lui interdisant l'accès.

---

## 2. CE QU'IL FAUT DIRE À VOS ÉLÈVES (Le message à leur envoyer)

Pour éviter les soucis, il vaut mieux prévenir vos clients du fonctionnement **avant** qu'ils n'utilisent l'application. Vous pouvez leur envoyer ce petit texte pré-écrit :

> *"Bonjour ! Voici l'adresse de votre espace de formation : https://embryologie-app.vercel.app*
> 
> *Le système de connexion fonctionne sans mot de passe, par une vérification stricte de votre e-mail (Lien Magique).*
>  
> *⚠️ ATTENTION ⚠️ : Par mesure de sécurité et pour protéger les droits d'auteur, votre adresse e-mail sera définitivement bloquée sur le PREMIER appareil avec lequel vous essayez de vous connecter.* 
> 
> *Choisissez donc bien avec quel appareil vous comptez suivre la formation (ordinateur principal de la maison, tablette, ou mobile) et assurez-vous d'ouvrir vos e-mails directement depuis cet appareil pour valider votre premier accès."*

---

## 3. RÉSOLUTION DE PROBLÈMES (Comment les aider s'ils sont bloqués)

### Problème A : "Je ne reçois pas l'e-mail avec le lien magique !"
*   **Cause 1 :** L'e-mail est tombé dans les courriers indésirables (Spam/Junk).
    *   **Solution :** Dites-lui de vérifier ses Spams et de chercher un mail venant de `noreply@mail.app.supabase.com`.
*   **Cause 2 :** Il a demandé trop d'emails d'affilée. Par sécurité antispam, le système bloque temporairement l'envoi au bout de 5 essais rapides.
    *   **Solution :** Dites-lui de patienter au minimum 15 minutes, et de cliquer une seule fois sur le bouton d'accès.


### Problème B : L'écran dit : "Cet accès est déjà utilisé sur un autre appareil"
*   **Cause :** L'étudiant essaie d'ouvrir l'application sur son iPhone alors qu'il s'était connecté sur son Mac la veille (ou bien il a essayé de donner son accès à un ami).
*   **Solution :** 
    1.  Demandez-lui s'il n'avait pas ouvert l'application par curiosité sur un autre support avant.
    2.  Si l'élève a une bonne raison de changer d'appareil (ordinateur cassé, achat d'un nouvel iPad), **vous seul pouvez débloquer la situation depuis l'espace Admin :**
        *   Allez sur votre application en tant qu'Administrateur.
        *   Dans le volet de droite (Administration), cherchez son adresse e-mail.
        *   Cliquez sur l'icône **"Poubelle" (Effacer l'empreinte de l'appareil)** à côté de son nom.
        *   Dites-lui : *"C'est bon, j'ai réinitialisé ton accès ! Tu peux maintenant te connecter depuis le bon appareil. Attention, il sera à nouveau verrouillé sur ce nouvel appareil !"*

### Problème C : "Ça me charge un écran blanc après avoir cliqué sur l'email" (Rare)
*   **Cause :** Le navigateur internet du client (très souvent Safari) bloque les informations des nouveaux liens par mesure stricte de limitation de traçage. 
*   **Solution :** Dites-lui : *"Ouvre l'application, vide le cache de ton navigateur (historique récent) ou utilise le mode 'Navigation Privée', puis demande un nouveau lien magique."*

### Problème D : "J'ai oublié mon mot de passe"
*   **Solution :** Rappelez-lui qu'il n'y a pas de mot de passe. Il suffit de rentrer son mail sur le portail et de cliquer sur le lien reçu dans sa boîte de réception.

---
*Ce guide a été généré pour assister la gestion des flux d'utilisateurs sur l'application Embryo-Biome (2026).*
