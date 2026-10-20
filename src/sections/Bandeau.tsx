import { useEffect, useRef } from 'react'
import { borner, surDefilement } from '../lib/animation/defilement'
import { mots } from '../data/contenu'
import './Bandeau.css'

/*
 * Les mots des onze dépôts, en deux bandes qui glissent en sens contraire.
 * Le glissement est une fonction de la position de la section dans l'écran,
 * pas une boucle : quand la page s'arrête, le bandeau s'arrête.
 */
function Ligne({ sens, decale }: { sens: 1 | -1; decale: number }) {
  const suite = [...mots.slice(decale), ...mots.slice(0, decale)]
  return (
    <div className="bandeau-ligne" data-sens={sens}>
      {[0, 1].map((tour) => (
        <span className="bandeau-tour" key={tour} aria-hidden={tour === 1 || undefined}>
          {suite.map((mot, rang) => (
            <span className="bandeau-mot" key={`${mot}-${rang}`} data-plan={rang % 2 ? '0.04' : '-0.03'}>
              <span className={`titre ${rang % 2 ? 'bandeau-creux' : ''}`}>{mot}</span>
              <svg className="bandeau-fleche" viewBox="0 0 64 24" aria-hidden="true">
                <path d="M2 14 C 20 4, 40 22, 58 11 M48 4 L59 11 L50 20" />
              </svg>
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

function Bandeau() {
  const racineRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const racine = racineRef.current
    if (!racine) return
    const lignes = [...racine.querySelectorAll<HTMLElement>('.bandeau-ligne')]

    return surDefilement(() => {
      const boite = racine.getBoundingClientRect()
      // 0 quand la section entre par le bas, 1 quand elle sort par le haut.
      const p = borner((window.innerHeight - boite.top) / (window.innerHeight + boite.height))
      for (const ligne of lignes) {
        const sens = Number(ligne.dataset.sens)
        const largeur = ligne.scrollWidth / 2
        const x = sens > 0 ? -largeur * 0.45 * p : -largeur * 0.45 * (1 - p)
        ligne.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`
      }
      return false
    })
  }, [])

  return (
    <section className="bandeau" ref={racineRef} aria-label="Les sujets des dépôts">
      <Ligne sens={1} decale={0} />
      <Ligne sens={-1} decale={5} />
    </section>
  )
}

export default Bandeau
