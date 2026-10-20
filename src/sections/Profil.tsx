import { useEffect, useMemo, useRef } from 'react'
import Reveal from '../components/effects/Reveal'
import SplitText from '../components/effects/SplitText'
import { borner, entre, surDefilement } from '../lib/animation/defilement'
import { COURBE } from '../lib/animation/ligneDeTemps'
import { profil } from '../data/contenu'
import dessin from '../assets/dessins/passerelle.svg?raw'
import './Profil.css'

/*
 * La case encrée. Le dessin au trait et l'image tramée partagent le même
 * cadrage : ils se superposent au pixel. Au défilement, la plume trace les
 * contours comme un mangaka pose son encre, les remplit, puis la trame vient
 * dessous.
 */
const CHEMINS = [...dessin.matchAll(/<path d="([^"]+)"/g)].map((trouve) => trouve[1])
const BOITE = dessin.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 1600 847'

export function poseCase(p: number) {
  return {
    trace: COURBE.cubeEntreeSortie(entre(0.05, 0.55, p)),
    encre: entre(0.45, 0.65, p),
    trame: COURBE.cubeSortie(entre(0.55, 0.85, p)),
    glisse: (p - 0.5) * -60,
  }
}

function Profil() {
  const caseRef = useRef<HTMLDivElement>(null)
  const chemins = useMemo(() => CHEMINS, [])

  useEffect(() => {
    const cadre = caseRef.current
    if (!cadre) return
    const traits = [...cadre.querySelectorAll<SVGPathElement>('.profil-dessin path')]
    const longueurs = traits.map((trait) => trait.getTotalLength())
    traits.forEach((trait, rang) => (trait.style.strokeDasharray = String(longueurs[rang])))
    const trame = cadre.querySelector<HTMLElement>('.profil-trame')!
    const plan = cadre.querySelector<HTMLElement>('.profil-plan')!

    return surDefilement(() => {
      const boite = cadre.getBoundingClientRect()
      const p = borner((window.innerHeight - boite.top) / (window.innerHeight + boite.height * 0.6))
      const pose = poseCase(p)
      traits.forEach((trait, rang) => {
        trait.style.strokeDashoffset = (longueurs[rang] * (1 - pose.trace)).toFixed(1)
        trait.style.fillOpacity = pose.encre.toFixed(3)
      })
      trame.style.opacity = pose.trame.toFixed(3)
      plan.style.transform = `translate3d(0, ${pose.glisse.toFixed(1)}px, 0) scale(1.08)`
      return false
    })
  }, [])

  return (
    <section className="profil" id="profil" aria-labelledby="profil-titre">
      <div className="profil-tete">
        <h2 className="profil-titre titre" id="profil-titre" data-plan="-0.06">
          <SplitText text={profil.titre} />
        </h2>
        <div className="profil-textes">
          {profil.paragraphes.map((paragraphe, rang) => (
            <Reveal key={rang} delay={rang * 120}>
              <p data-plan={(0.03 * (rang + 1)).toFixed(2)}>{paragraphe}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <figure className="profil-case" ref={caseRef}>
        <div className="profil-plan">
          <img className="profil-trame" src={profil.vue.source} alt={profil.vue.alt} loading="lazy" />
          <svg className="profil-dessin" viewBox={BOITE} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {chemins.map((d, rang) => (
              <path key={rang} d={d} />
            ))}
          </svg>
        </div>
        <figcaption className="profil-legende italique">Case 12. La passerelle, au retour.</figcaption>
      </figure>
    </section>
  )
}

export default Profil
