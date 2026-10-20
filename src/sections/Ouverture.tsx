// Le premier écran. Les deux prénoms, accolés au centre, partent vers les
// coins d'une image pendant qu'une déchirure s'ouvre entre eux : un cercle
// passé dans un champ de turbulence, qui sert de masque. La section est
// épinglée sur un écran et demi de défilement pour que tout se joue sur place.

import { useEffect, useRef } from 'react'
import { borner, entre, melanger, surDefilement } from '../lib/animation/defilement'
import { COURBE } from '../lib/animation/ligneDeTemps'
import { GITHUB, hero, identite } from '../data/contenu'
import './Ouverture.css'

const CADRE: [number, number] = [880, 1100]
/* La demi-diagonale du cadre fait 704 : à 650 les quatre coins restent
   déchirés, et l'image garde son bord d'encre au lieu de finir en rectangle. */
const RAYON = 650

/**
 * La pose entière à une progression p, de 0 (écran d'arrivée) à 1 (fin de
 * l'épinglage). Fonction pure : la même position de défilement donne
 * toujours la même image, rien n'est caché dans un état.
 */
export function poseOuverture(p: number) {
  const moities = COURBE.cubeEntreeSortie(entre(0.04, 0.62, p))
  const ouverture = COURBE.quartSortie(entre(0.1, 0.78, p))
  return {
    moities,
    rayon: RAYON * ouverture,
    grossi: melanger(1.18, 1, ouverture),
    accueil: 1 - entre(0, 0.22, p),
    propos: entre(0.62, 0.9, p),
  }
}

function Ouverture() {
  const sceneRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const moities = [...scene.querySelectorAll<HTMLElement>('.ouv-moitie')]
    const doubles = [...scene.querySelectorAll<HTMLElement>('.ouv-double')]
    const masque = scene.querySelector<SVGCircleElement>('.ouv-masque')!
    const image = scene.querySelector<SVGImageElement>('.ouv-image')!
    const accueil = scene.querySelector<HTMLElement>('.ouv-accueil')!
    const propos = scene.querySelector<HTMLElement>('.ouv-propos')!
    let ecarts = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]

    // L'écart entre la place accolée (le double muet) et la place d'arrivée,
    // relevé sans transformée en cours, sinon il se cumule d'une mesure à l'autre.
    function mesurer() {
      ecarts = moities.map((moitie, cote) => {
        moitie.style.transform = ''
        const arrivee = moitie.getBoundingClientRect()
        const depart = doubles[cote].getBoundingClientRect()
        return { x: depart.left - arrivee.left, y: depart.top - arrivee.top }
      })
    }

    function poser() {
      const haut = scene!.offsetTop
      const course = Math.max(1, scene!.offsetHeight - window.innerHeight)
      const pose = poseOuverture(borner((window.scrollY - haut) / course))
      const reste = 1 - pose.moities

      moities.forEach((moitie, cote) => {
        const { x, y } = ecarts[cote]
        moitie.style.transform = `translate(${(x * reste).toFixed(1)}px, ${(y * reste).toFixed(1)}px)`
      })
      masque.setAttribute('r', pose.rayon.toFixed(1))
      image.style.transform = `scale(${pose.grossi.toFixed(4)})`
      accueil.style.opacity = pose.accueil.toFixed(3)
      accueil.style.transform = `translateY(${((1 - pose.accueil) * -24).toFixed(1)}px)`
      accueil.style.visibility = pose.accueil < 0.02 ? 'hidden' : 'visible'
      propos.style.opacity = pose.propos.toFixed(3)
    }

    function reprendre() {
      mesurer()
      poser()
    }

    const observateur = new ResizeObserver(reprendre)
    observateur.observe(scene)
    // Les moitiés changent de largeur quand Anton arrive : sans cette seconde
    // mesure, l'écart relevé serait celui de la police de repli.
    document.fonts?.ready.then(reprendre)
    reprendre()

    const arreter = surDefilement(() => {
      poser()
      return false
    })

    return () => {
      arreter()
      observateur.disconnect()
    }
  }, [])

  return (
    <section className="ouv" ref={sceneRef} aria-label="Ouverture">
      <div className="ouv-epingle">
        <h1 className="visuellement-cache">
          {identite.prenoms} {identite.nom}, développeuse web et machine learning
        </h1>

        {/* Le double muet garde la place de départ : c'est lui qu'on mesure. */}
        <div className="ouv-repere" aria-hidden="true">
          <span className="ouv-double ouv-double--haut italique">{identite.prenoms}</span>
          <span className="ouv-double ouv-double--bas titre">{identite.nom}</span>
        </div>

        <div className="ouv-plan" aria-hidden="true">
          <span className="ouv-moitie ouv-moitie--haut italique">{identite.prenoms}</span>
          <span className="ouv-moitie ouv-moitie--bas titre">{identite.nom}</span>

          <svg
            className="ouv-vue"
            width={CADRE[0]}
            height={CADRE[1]}
            viewBox={`0 0 ${CADRE[0]} ${CADRE[1]}`}
          >
            <defs>
              <filter id="ouv-dechirure">
                <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" result="bruit" />
                <feDisplacementMap in="SourceGraphic" in2="bruit" scale="70" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <mask id="ouv-decoupe">
                <circle className="ouv-masque" cx="50%" cy="50%" r="0" fill="white" filter="url(#ouv-dechirure)" />
              </mask>
            </defs>
            <image
              className="ouv-image"
              href={hero.vue.source}
              width={CADRE[0]}
              height={CADRE[1]}
              preserveAspectRatio="xMidYMid slice"
              mask="url(#ouv-decoupe)"
            />
          </svg>

          <p className="ouv-propos">
            Volume 01. Onze dépôts, cinq applications en ligne, une seule règle : que ça serve demain matin.
          </p>
        </div>

        <div className="ouv-accueil">
          <p className="ouv-phrase">{hero.phrase}</p>
          <div className="ouv-actions">
            <a className="bouton bouton--plein" href="#planches" data-griffe="planches">
              {hero.actions.principale} <span className="fleche" aria-hidden="true">→</span>
            </a>
            <a className="bouton bouton--contour" href={GITHUB} target="_blank" rel="noreferrer">
              {hero.actions.secondaire}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ouverture
