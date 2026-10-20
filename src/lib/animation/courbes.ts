/** Courbes d'accélération : une avancée entre 0 et 1 entre, une avancée courbée sort. */
export const COURBE = {
  lineaire: (t: number) => t,
  expoSortie: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  cubeSortie: (t: number) => 1 - Math.pow(1 - t, 3),
  quartSortie: (t: number) => 1 - Math.pow(1 - t, 4),
  carreEntreeSortie: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  cubeEntreeSortie: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
}

export type Courbe = (t: number) => number
