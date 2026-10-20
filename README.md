# Portfolio · Mauricia Nériah Olafa

Le portfolio de Nériah, développeuse web et machine learning, mis en page comme un volume de manga : papier, encre, trames, cases, et une seule couleur vive.

## Lancer le projet

Il faut Node.js 18 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # vérifie les types puis construit dans dist/
npm run preview    # sert le dossier dist/ pour le relire avant de publier
```

`npm run dev:mobile` sert aussi le site sur le réseau local, pour l'ouvrir depuis un téléphone.

## Modifier le contenu

Tout le texte est dans **`src/data/contenu.ts`** : la phrase d'accueil, les trois chapitres et leurs chiffres, le profil, les quatre projets et leurs liens, l'appel final. Les composants ne contiennent pas de texte en dur, il suffit donc d'éditer ce fichier.

Chaque chiffre affiché porte en commentaire l'endroit d'où il vient. Quand un chiffre change (un nouveau dépôt, une nouvelle application en ligne), il se met à jour là, avec sa source.

## Organisation

```
src/
  data/contenu.ts       le texte du site
  sections/             les sections, dans l'ordre de la page (un .tsx et son .css)
  components/           l'en-tête, l'écran d'attente, la transition de chapitre
  components/effects/   défilement fluide, apparitions, titres découpés, parallaxe
  lib/animation/        courbes, lignes de temps et outils de défilement
  lib/inspection.ts     paramètres d'URL de débogage
  assets/               polices (déclarations) et dessin au trait du profil
  index.css             les couleurs, les polices, les courbes, les boutons
public/
  fonts/                Anton et Instrument Serif, avec leurs licences OFL
  images/               le ciel du premier écran et les planches
```

## Couleurs et typographie

Les couleurs sont des variables dans `src/index.css`, chacune avec un seul rôle :

| variable | rôle |
|---|---|
| `--papier` | le fond des pages claires |
| `--encre` | le texte et les traits |
| `--gris` | le texte secondaire |
| `--beni` | ce qui se clique, et rien d'autre |
| `--nuit` | le fond des chapitres sombres |
| `--ciel` | les accents posés sur la nuit |

Deux polices : **Anton** pour les titres, **Instrument Serif** (romain et italique) pour le texte. Elles sont servies par le site lui-même, sans appel à un service externe.

## Animations

Toutes les animations sont calculées à partir d'une position de défilement ou d'un temps, jamais d'un état caché. Pour en regarder une à l'arrêt :

| paramètre | effet |
|---|---|
| `?attente=0` | saute l'écran d'attente |
| `?attente=1.2` | fige l'écran d'attente à 1,2 seconde |
| `?griffe=0.7` | fige la transition de chapitre (0 rien, 1 écran couvert, 2 fini) |
| `?ouvert=2` | ouvre le troisième chapitre |

Tout bouge moins, ou plus du tout, quand le système demande de réduire les animations (`prefers-reduced-motion`).

Un lien qui porte `data-griffe="<id de section>"` déclenche la transition de chapitre avant de sauter à la section.

## Publier

Le site est statique : `npm run build` produit `dist/`, à déposer tel quel sur Vercel, Netlify ou GitHub Pages. Sur Vercel, importer le dépôt suffit ; le préréglage Vite est détecté.

## À faire

- Relire les textes de `src/data/contenu.ts` : les faits viennent des dépôts, les phrases sont à ajuster à sa voix.
- Ajouter une adresse de contact : l'appel final renvoie pour l'instant vers GitHub.
- Remplacer les planches par de vraies captures de ses applications si elle le souhaite.
- Alléger les images de `public/images/` (environ 2,5 Mo au total) avant la mise en ligne.

## Crédits

Polices Anton et Instrument Serif sous licence SIL Open Font License 1.1.
