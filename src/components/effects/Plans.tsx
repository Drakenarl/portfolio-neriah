import { useEffect } from 'react'
import { surDefilement } from '../../lib/animation/defilement'
import { mouvementReduit } from '../../lib/inspection'

/*
 * La parallaxe, relative à l'élément et non à la page.
 *
 * Une parallaxe calée sur `scrollY × vitesse` n'est juste qu'en haut de
 * page : plus bas, le décalage atteint des centaines de pixels. Ici chaque
 * élément marqué `data-plan="<vitesse>"` (et qui ne porte pas d'autre
 * transformée, qu'il écraserait) se décale selon l'écart entre son
 * centre et celui de l'écran : nul quand il est au milieu, quelle que soit sa
 * place dans la page.
 */
function Plans() {
  useEffect(() => {
    if (mouvementReduit()) return
    const elements = [...document.querySelectorAll<HTMLElement>('[data-plan]')]
    const vitesses = elements.map((element) => Number(element.dataset.plan) || 0)

    return surDefilement(() => {
      const milieu = window.innerHeight / 2
      elements.forEach((element, rang) => {
        const boite = element.getBoundingClientRect()
        if (boite.bottom < -200 || boite.top > window.innerHeight + 200) return
        const ecart = boite.top + boite.height / 2 - milieu
        element.style.transform = `translate3d(0, ${(ecart * vitesses[rang]).toFixed(1)}px, 0)`
      })
      return false
    })
  }, [])

  return null
}

export default Plans
