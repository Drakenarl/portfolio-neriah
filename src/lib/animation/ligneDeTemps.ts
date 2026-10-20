import { COURBE, type Courbe } from './courbes'

export { COURBE }

export type Piste = {
  /** Départ, en secondes. */
  debut: number
  duree: number
  courbe?: Courbe
  /** Retard ajouté à chaque élément d'un groupe : rang × decalage. */
  decalage?: number
  /** Taille du groupe, quand la piste anime plusieurs éléments. */
  nombre?: number
  /** Écrit l'état d'un élément pour une avancée donnée. */
  poser: (avancee: number, rang: number) => void
}

/**
 * Une suite de pistes qu'on peut poser à n'importe quel instant.
 *
 * Toute l'animation est une fonction du temps : `poser(1.8)` donne l'image
 * exacte à 1,8 seconde, ce qui permet de figer un instant pour le déboguer.
 * Une piste n'est réécrite que si son avancée a changé, pour ne pas toucher
 * au DOM inutilement.
 */
export class LigneDeTemps {
  private pistes: Piste[]
  private ecrits: number[][]
  readonly duree: number

  constructor(pistes: Piste[]) {
    this.pistes = pistes
    this.ecrits = pistes.map((piste) => new Array(piste.nombre ?? 1).fill(Number.NaN))
    this.duree = pistes.reduce((fin, piste) => {
      const retard = (piste.decalage ?? 0) * ((piste.nombre ?? 1) - 1)
      return Math.max(fin, piste.debut + piste.duree + retard)
    }, 0)
  }

  poser(temps: number) {
    this.pistes.forEach((piste, index) => {
      const memoire = this.ecrits[index]
      const courbe = piste.courbe ?? COURBE.lineaire

      for (let rang = 0; rang < (piste.nombre ?? 1); rang += 1) {
        const brute = (temps - piste.debut - (piste.decalage ?? 0) * rang) / piste.duree
        // Une piste qui n'a pas commencé n'écrit rien : son état de départ
        // est celui de la feuille de style.
        if (brute < 0 && Number.isNaN(memoire[rang])) continue

        const avancee = courbe(Math.min(1, Math.max(0, brute)))
        // La dernière écriture doit tomber pile sur 1, d'où la marque infinie.
        const marque = brute >= 1 ? Number.POSITIVE_INFINITY : Math.round(avancee * 1000) / 1000
        if (marque === memoire[rang]) continue
        memoire[rang] = marque
        piste.poser(avancee, rang)
      }
    })
  }
}

/** Joue une ligne de temps en temps réel. Rend de quoi l'arrêter. */
export function jouer(ligne: LigneDeTemps, surFin?: () => void) {
  let temps = 0
  let precedent = 0
  let boucle = 0

  function tourner(maintenant: number) {
    const ecoule = precedent ? (maintenant - precedent) / 1000 : 0
    precedent = maintenant
    // Après un onglet en veille, on avance d'une image au lieu de sauter à la fin.
    temps += ecoule > 0.5 ? 1 / 30 : ecoule
    ligne.poser(temps)

    if (temps < ligne.duree) boucle = requestAnimationFrame(tourner)
    else {
      boucle = 0
      surFin?.()
    }
  }

  ligne.poser(0)
  boucle = requestAnimationFrame(tourner)
  return () => {
    if (boucle) cancelAnimationFrame(boucle)
  }
}
