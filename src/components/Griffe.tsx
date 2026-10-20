// Le passage d'un chapitre à l'autre : deux gribouillis, à l'encre et au
// rose, se dessinent en s'épaississant jusqu'à couvrir l'écran ; la page
// saute au chapitre demandé pendant qu'elle est cachée, puis les traits se
// dévident par l'autre bout. Tout lien portant data-griffe="<id>" le déclenche.

import { useEffect, useRef } from 'react'
import { COURBE, LigneDeTemps, jouer } from '../lib/animation/ligneDeTemps'
import { inspection, mouvementReduit } from '../lib/inspection'
import './Griffe.css'

const TRAITS = [
  'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262',
  'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012',
]

const DUREE = 0.9
const FIN = 200
const GRAS = 700

/**
 * La pose des deux traits à g, entre 0 (rien) et 2 (dévidé). À 1 l'écran est
 * entièrement couvert : c'est là que le défilement saute.
 */
function poser(traits: SVGPathElement[], longueurs: number[], g: number) {
  traits.forEach((trait, rang) => {
    const l = longueurs[rang]
    if (g <= 1) {
      const a = COURBE.carreEntreeSortie(Math.max(0, g))
      trait.style.strokeDashoffset = String(l * (1 - a))
      trait.style.strokeWidth = String(FIN + (GRAS - FIN) * a)
    } else {
      const a = COURBE.carreEntreeSortie(Math.min(1, g - 1))
      trait.style.strokeDashoffset = String(-l * a)
      trait.style.strokeWidth = String(GRAS + (FIN - GRAS) * a)
    }
  })
}

type Lenis = { scrollTo: (cible: number | HTMLElement, options?: object) => void }

function Griffe() {
  const voileRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const voile = voileRef.current
    if (!voile) return
    const traits = [...voile.querySelectorAll('path')]
    const longueurs = traits.map((trait) => trait.getTotalLength())
    traits.forEach((trait, rang) => (trait.style.strokeDasharray = String(longueurs[rang])))

    const fige = inspection.griffe()
    if (fige !== null) {
      poser(traits, longueurs, fige)
      return
    }
    poser(traits, longueurs, 0)

    let enCours = false
    let arreter: (() => void) | null = null

    function sauter(cible: HTMLElement) {
      const lenis = (window as unknown as { lenis?: Lenis }).lenis
      if (lenis) lenis.scrollTo(cible, { immediate: true, force: true })
      else window.scrollTo(0, cible.getBoundingClientRect().top + window.scrollY)
    }

    function surClic(evenement: MouseEvent) {
      const lien = (evenement.target as HTMLElement).closest<HTMLElement>('[data-griffe]')
      if (!lien) return
      const cible = document.getElementById(lien.dataset.griffe!)
      if (!cible) return
      evenement.preventDefault()
      if (enCours) return

      if (mouvementReduit()) {
        sauter(cible)
        return
      }

      enCours = true
      const ligne = new LigneDeTemps([
        { debut: 0, duree: DUREE, poser: (a) => poser(traits, longueurs, a) },
        { debut: DUREE, duree: 0.0001, poser: (a) => a >= 1 && sauter(cible!) },
        { debut: DUREE + 0.12, duree: DUREE, poser: (a) => poser(traits, longueurs, 1 + a) },
      ])
      arreter = jouer(ligne, () => {
        poser(traits, longueurs, 0)
        enCours = false
      })
    }

    document.addEventListener('click', surClic)
    return () => {
      document.removeEventListener('click', surClic)
      arreter?.()
    }
  }, [])

  return (
    <div className="griffe" aria-hidden="true">
      <svg viewBox="0 0 2453 2535" fill="none" preserveAspectRatio="none" ref={voileRef}>
        {TRAITS.map((trait, rang) => (
          <path key={rang} d={trait} className={`griffe-trait griffe-trait--${rang}`} strokeWidth={FIN} strokeLinecap="round" />
        ))}
      </svg>
    </div>
  )
}

export default Griffe
