/*
 * Tout le texte du site, séparé du rendu.
 *
 * Chaque fait porte sa source en commentaire : un chiffre qu'on ne peut pas
 * retrouver ne s'affiche pas. Les sources sont les dépôts publics du compte
 * GitHub neriah249-alt, relevés le 2026-10-19.
 */

export const GITHUB = 'https://github.com/neriah249-alt'

export const identite = {
  // source : README de codealpha_tasks, section « Auteur »
  prenoms: 'Mauricia',
  nom: 'Nériah',
  complet: 'OLAFA Mauricia Nériah Mondjissiola',
  sigle: 'N',
}

export const hero = {
  // cinq applications en ligne : les trois liens « homepage » Vercel du
  // profil, et les deux démos Streamlit citées dans les README de CodeAlpha.
  phrase:
    'Je construis des applications web qu’on ouvre tous les jours, et des modèles qui lisent ce que les données disent. Cinq sont en ligne.',
  actions: {
    principale: 'Ouvrir les planches',
    secondaire: 'Lire mon GitHub',
  },
  // la vue qui s'ouvre dans la déchirure du premier écran
  vue: { source: '/images/ciel-crepuscule.webp', alt: 'Ciel de crépuscule, rose et indigo' },
}

/** Le bandeau : les mots des dépôts, dans l'ordre où on les rencontre. */
export const mots = [
  'quiz',
  'fiches',
  'code de la route',
  'restaurants',
  'favoris',
  'chiffres manuscrits',
  'cœur',
  'crédit',
  'chiffrement',
  'WhatsApp',
]

export type Fait = { valeur: string; dit: string }

export type Chapitre = {
  numero: string
  titre: string
  resume: string
  outils: string[]
  faits: Fait[]
}

export const chapitres: Chapitre[] = [
  {
    numero: '01',
    titre: 'Le web qui sert',
    resume:
      'Des applications installables, pensées pour un téléphone : on révise un cours, on prépare son permis, on trouve où manger.',
    // sources : package.json et arborescence de Revision-app, permis-benin
    // (manifest.json, sw.js) et restofindr (backend/ en Python, render.yaml)
    outils: ['React', 'Vite', 'Supabase', 'Python', 'PWA'],
    faits: [
      // trois « homepage » Vercel sur le profil
      { valeur: '3', dit: 'applications web en ligne sur Vercel' },
      // restofindr/backend/routes : auth, favorites, restaurants, restaurateur, search, users
      { valeur: '6', dit: 'familles de routes dans l’API de restofindr' },
    ],
  },
  {
    numero: '02',
    titre: 'Les données qui parlent',
    resume:
      'Trois modèles faits pendant le stage machine learning de CodeAlpha, chacun livré avec son application pour l’essayer.',
    // sources : README de CodeAlpha_Handwritten, _CreditScoring, _DiseasePrediction
    outils: ['TensorFlow', 'Keras', 'scikit-learn', 'OpenCV', 'Streamlit'],
    faits: [
      { valeur: '99,50 %', dit: 'de chiffres manuscrits reconnus sur MNIST' },
      { valeur: '1 000', dit: 'dossiers de crédit, trois algorithmes comparés' },
      { valeur: '297', dit: 'patients, treize variables pour lire le cœur' },
    ],
  },
  {
    numero: '03',
    titre: 'Ce qui protège et répond',
    resume:
      'Un agent Windows qui chiffre et surveille, un serveur qui tient le journal, et un bot qui répond sur WhatsApp.',
    // sources : arborescence d'Emcloud-secure (CryptoEngine.cs, Base32Encoder.cs,
    // UserAuth.cs, 02-serveur, 03-tableau-de-bord) et de whatsapp-bot-phase0
    outils: ['C#', 'WPF', 'Node.js', 'Redis', 'API Meta'],
    faits: [
      { valeur: '3', dit: 'étages pour EMCloud : agent, serveur, tableau de bord' },
      { valeur: '2', dit: 'facteurs pour ouvrir une session de l’agent' },
    ],
  },
]

export const profil = {
  titre: 'Un chapitre qui marche, puis le suivant.',
  paragraphes: [
    // source : profil GitHub, compte ouvert le 2026-02-16, onze dépôts publics
    'Mauricia Nériah Olafa ouvre son compte GitHub en février 2026. Huit mois plus tard, onze dépôts publics, et cinq applications qui tournent en ligne, sur Vercel et sur Streamlit.',
    // source : langages des dépôts relevés par l'API GitHub
    'Elle écrit en JavaScript pour le web, en Python pour les données, en C# quand il faut descendre jusqu’à Windows. Le choix de l’outil suit ce que l’application doit faire, pas l’inverse.',
    // source : permis-benin, Revision-app
    'Ses sujets viennent d’à côté : réviser un cours la veille d’un examen, passer le permis provisoire au Bénin, trouver une table libre. Des problèmes qu’on a soi-même, réglés pour d’autres.',
  ],
  vue: { source: '/images/passerelle.webp', alt: 'Passerelle piétonne au couchant, gravée à l’encre' },
}

export type Planche = {
  titre: string
  sous: string
  propos: string
  lien: string
  vue: { source: string; alt: string }
}

export const planches: Planche[] = [
  {
    titre: 'Revision',
    sous: 'React, Supabase, installable',
    // source : description du dépôt Revision-app, src/ (Login, SignUp, Dashboard, ThemeToggle)
    propos:
      'Des quiz et des fiches pour réviser ses cours. Un compte, un tableau de bord, un thème clair ou sombre, et l’application s’installe sur le téléphone.',
    lien: 'https://revision-app-restogo1.vercel.app',
    vue: { source: '/images/planche-revision.webp', alt: 'Écran de Revision-app, gravé à l’encre' },
  },
  {
    titre: 'Permis Bénin',
    sous: 'HTML, hors ligne',
    // source : description du dépôt permis-benin, manifest.json et sw.js
    propos:
      'Réviser le permis provisoire, même sans réseau : une seule page, un service qui la garde en mémoire, une icône sur l’écran d’accueil.',
    lien: 'https://permis-benin-five.vercel.app',
    vue: { source: '/images/planche-permis.webp', alt: 'Écran de permis-benin, gravé à l’encre' },
  },
  {
    titre: 'Restofindr',
    sous: 'React, API Python',
    // source : description du dépôt restofindr, backend/routes
    propos:
      'Chercher un restaurant, le garder en favori, et côté restaurateur tenir sa fiche à jour. Une interface React devant une API Python à elle.',
    lien: 'https://restofindr.vercel.app',
    vue: { source: '/images/planche-restofindr.webp', alt: 'Écran de restofindr, gravé à l’encre' },
  },
  {
    titre: 'EMCloud',
    sous: 'C#, chiffrement, journal',
    // source : arborescence d'Emcloud-secure
    propos:
      'Un agent de cybersécurité pour Windows : il chiffre, demande un second facteur, et remonte ce qu’il voit à un serveur qui garde le journal.',
    lien: 'https://github.com/neriah249-alt/Emcloud-secure',
    vue: { source: '/images/planche-emcloud.webp', alt: 'Rue de nuit, gravée à l’encre' },
  },
]

export const appel = {
  mot: 'À suivre',
  phrase: 'Le volume deux s’écrit avec vous : une application à construire, un stage, une équipe.',
  cachet: 'Vol. 01 · Nériah · à suivre · ',
  actions: {
    principale: 'Suivre sur GitHub',
    secondaire: 'Voir les onze dépôts',
  },
}

export const navigation = [
  { cible: 'chapitres', nom: 'Chapitres' },
  { cible: 'planches', nom: 'Planches' },
  { cible: 'profil', nom: 'Profil' },
  { cible: 'suite', nom: 'Contact' },
]
