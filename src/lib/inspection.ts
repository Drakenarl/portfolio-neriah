/*
 * Paramètres d'URL de débogage. Les animations sont calculées à partir d'un
 * temps ou d'une position ; ces paramètres en figent un instant pour le
 * regarder à l'arrêt :
 *
 *   ?attente=0      saute l'écran d'attente
 *   ?attente=1.8    fige l'écran d'attente à 1,8 seconde
 *   ?griffe=0.5     fige la transition de chapitre (0 rien, 1 écran couvert, 2 fini)
 *   ?ouvert=2       ouvre le chapitre de ce rang
 */

function lire(nom: string): number | null {
  if (typeof window === 'undefined') return null
  const valeur = new URLSearchParams(window.location.search).get(nom)
  if (valeur === null || valeur === '') return null
  const nombre = Number(valeur)
  return Number.isFinite(nombre) ? nombre : null
}

export const inspection = {
  attente: () => lire('attente'),
  griffe: () => lire('griffe'),
  ouvert: () => lire('ouvert'),
}

export function mouvementReduit() {
  return typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}
