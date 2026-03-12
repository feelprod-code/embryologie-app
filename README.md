# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Problèmes de délivrabilité d'e-mails (Resend, Supabase, iCloud, Free, etc.)

L'application utilise l'authentification OTP via Supabase, et Supabase est configuré pour envoyer des e-mails avec le service **Resend**.

Cependant, il est très courant de rencontrer des problèmes d'e-mails qui n'arrivent jamais chez les utilisateurs qui utilisent des adresses comme `@me.com`, `@mac.com`, `@icloud.com` (Apple) ou des fournisseurs d'accès Internet très stricts (comme `@free.fr`, `@orange.fr`). Ces adresses exigent une configuration d'expédition parfaite (sans quoi, les mails sont rejetés d'office par les filtres antispam, même pas dans le dossier Indésirables).

De plus, si seul l'administrateur (vous-même) parvient à recevoir les e-mails OTP, cela indique avec une très grande probabilité que votre compte **Resend** est actuellement en **mode Sandbox** (environnement de test), qui bloque l'envoi d'e-mails vers n'importe quelle adresse non vérifiée, ou que votre domaine personnalisé n'est pas encore complètement certifié sur Resend.

### Solutions :

1.  **Vérifiez votre domaine sur Resend** : Pour que Supabase puisse envoyer des mails correctement à d'autres adresses (et particulièrement celles très strictes comme Free ou Apple), vous devez impérativement ajouter un domaine d'envoi personnalisé à votre compte Resend et finaliser la vérification DNS. Allez sur le tableau de bord Resend, sous "Domains", et suivez les instructions pour ajouter tous les enregistrements demandés (DKIM et potentiellement SPF/DMARC) à la zone DNS de votre nom de domaine (OVH, Hostinger, Cloudflare, etc.).

2.  **Assurez-vous que Resend n'est pas en "Sandbox"** : Tant que le domaine personnalisé n'est pas complètement vérifié avec les voyants au vert, l'API de Resend continuera de refuser silencieusement l'expédition de mails vers d'autres personnes que le propriétaire du compte. Ce qui explique que guillaumephilippe@me.com ou une adresse Free ne reçoivent rien.

3.  **Configurer correctement le SMTP dans Supabase** : Allez dans le projet Supabase > Authentication > Providers > Email. Assurez-vous que le SMTP soit activé (Enable Custom SMTP) et correctement renseigné avec les accès de votre compte Resend :
    -   **Host** : smtp.resend.com
    -   **Port** : 465 (TLS activé)
    -   **Sender email address** : Une adresse provenant du domaine vérifié à l'étape 1 (ex: contact@votre-domaine.com).
    -   **Username** : resend
    -   **Password** : Votre clé API Resend
