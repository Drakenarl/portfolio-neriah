import { COURBE } from './courbes'

/** Ramène une valeur entre deux bornes. */
export function borner(valeur: number, bas = 0, haut = 1) {
  return Math.min(haut, Math.max(bas, valeur))
}

/** Où se trouve `valeur` entre `depart` et `fin`, de 0 à 1. */
export function entre(depart: number, fin: number, valeur: number) {
  if (fin === depart) return valeur >= fin ? 1 : 0
  return borner((valeur - depart) / (fin - depart))
}

/** Interpolation linéaire. */
export function melanger(depart: number, arrivee: number, avancee: number) {
  return depart + (arrivee - depart) * avancee
}

/** Vrai si la personne a demandé moins d'animation. */
export function econome() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Une valeur qui rattrape sa cible en `duree` secondes, sur une courbe qui
 * freine en arrivant. Elle repart de là où elle en est quand la cible change,
 * ce qui évite tout à-coup quand on inverse le sens du défilement.
 */
export class Rattrapage {
  private depart: number
  private cible: number
  private temps: number

  constructor(
    valeur: number,
    private duree: number,
  ) {
    this.depart = valeur
    this.cible = valeur
    this.temps = duree
  }

  vers(cible: number) {
    if (cible === this.cible) return
    this.depart = this.valeur
    this.cible = cible
    this.temps = 0
  }

  avancer(secondes: number) {
    this.temps = Math.min(this.duree, this.temps + secondes)
    return this.valeur
  }

  get valeur() {
    if (this.temps >= this.duree) return this.cible
    return melanger(this.depart, this.cible, COURBE.expoSortie(this.temps / this.duree))
  }

  get bouge() {
    return this.temps < this.duree
  }

  poser(valeur: number) {
    this.depart = valeur
    this.cible = valeur
    this.temps = this.duree
  }
}

/**
 * Appelle `rendu` à chaque image tant que la page défile, et plus rien au
 * repos. `rendu` reçoit la position et le temps écoulé ; s'il rend `true`,
 * la boucle continue (un rattrapage qui n'a pas fini), sinon elle s'endort
 * jusqu'au prochain défilement ou redimensionnement.
 */
export function surDefilement(rendu: (defilement: number, secondes: number) => boolean | void) {
  let boucle = 0
  let precedent = 0

  function tourner(maintenant: number) {
    boucle = 0
    const ecoule = precedent ? (maintenant - precedent) / 1000 : 0
    precedent = maintenant
    if (rendu(window.scrollY, ecoule > 0.5 ? 1 / 30 : ecoule)) boucle = requestAnimationFrame(tourner)
  }

  function reveiller() {
    if (boucle) return
    precedent = 0
    boucle = requestAnimationFrame(tourner)
  }

  if (rendu(window.scrollY, 0)) reveiller()
  window.addEventListener('scroll', reveiller, { passive: true })
  window.addEventListener('resize', reveiller)

  return () => {
    if (boucle) cancelAnimationFrame(boucle)
    window.removeEventListener('scroll', reveiller)
    window.removeEventListener('resize', reveiller)
  }
}
