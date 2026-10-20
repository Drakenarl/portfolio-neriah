import { useEffect, useMemo, useRef } from 'react'
import SplitText from '../components/effects/SplitText'
import { surDefilement } from '../lib/animation/defilement'
import { GITHUB, appel } from '../data/contenu'
import './Appel.css'

/*
 * La dernière page du volume. Les lignes de concentration du manga ne sont
 * pas un décor : elles font ce qu'elles font sur une planche, pousser l'œil
 * vers le centre, là où sont le mot et les deux boutons. Leur tirage est
 * tenu par la position, le même à chaque visite.
 */
function lignes(nombre: number) {
  const traits: string[] = []
  for (let rang = 0; rang < nombre; rang += 1) {
    const graine = Math.sin(rang * 78.233) * 43758.5453
    const hasard = graine - Math.floor(graine)
    const angle = (rang / nombre) * Math.PI * 2 + hasard * 0.04
    const depart = 330 + hasard * 120
    const large = 0.004 + hasard * 0.01
    const x = (r: number, a: number) => (800 + Math.cos(a) * r).toFixed(1)
    const y = (r: number, a: number) => (500 + Math.sin(a) * r * 0.62).toFixed(1)
    traits.push(
      `M${x(depart, angle)} ${y(depart, angle)}L${x(1400, angle - large)} ${y(1400, angle - large)}L${x(1400, angle + large)} ${y(1400, angle + large)}Z`,
    )
  }
  return traits.join('')
}

function Appel() {
  const cachetRef = useRef<SVGSVGElement>(null)
  const trace = useMemo(() => lignes(150), [])

  // Le cachet tourne avec la page, pas tout seul : arrêté, il s'arrête.
  useEffect(() => {
    const cachet = cachetRef.current
    if (!cachet) return
    return surDefilement((defilement) => {
      cachet.style.transform = `rotate(${(defilement * 0.08).toFixed(2)}deg)`
      return false
    })
  }, [])

  return (
    <section className="appel" id="suite" aria-labelledby="appel-mot">
      <svg className="appel-lignes" data-plan="0.08" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d={trace} />
      </svg>

      <div className="appel-centre">
        <h2 className="appel-mot titre" id="appel-mot">
          <SplitText text={appel.mot} byLetter stagger={45} />
        </h2>
        <p className="appel-phrase" data-plan="0.05">{appel.phrase}</p>
        <div className="appel-actions">
          <a className="bouton bouton--plein" href={GITHUB} target="_blank" rel="noreferrer">
            {appel.actions.principale} <span className="fleche" aria-hidden="true">→</span>
          </a>
          <a className="bouton bouton--contour" href={`${GITHUB}?tab=repositories`} target="_blank" rel="noreferrer">
            {appel.actions.secondaire}
          </a>
        </div>
      </div>

      <svg className="appel-cachet" viewBox="0 0 200 200" ref={cachetRef} aria-hidden="true">
        <defs>
          <path id="appel-cercle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
        </defs>
        <circle cx="100" cy="100" r="96" />
        <text>
          <textPath href="#appel-cercle" textLength="462">
            {appel.cachet}
          </textPath>
        </text>
        <text x="100" y="117" textAnchor="middle" className="appel-cachet-sigle">
          N
        </text>
      </svg>
    </section>
  )
}

export default Appel
