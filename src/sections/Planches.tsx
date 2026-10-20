// Les réalisations. Quatre planches se relaient derrière un masque qui
// s'ouvre, chaque fois d'une autre façon : stores, carreaux, lamelles, puis
// une grille qui s'allume colonne par colonne. Le texte de chaque projet entre
// sous un cache par le bas et sort par le haut ; son lien n'est cliquable que
// pendant qu'il est lisible.

import { useEffect, useRef } from 'react'
import { COURBE } from '../lib/animation/ligneDeTemps'
import { Rattrapage, borner, econome, entre, melanger, surDefilement } from '../lib/animation/defilement'
import { planches } from '../data/contenu'
import './Planches.css'

const SVG = 'http://www.w3.org/2000/svg'

const PAS_LAME = 0.02
const DUREE_LAME = 0.5
const DUREE_TEXTE_ENTREE = 1.5
const DUREE_TEXTE_SORTIE = 1.2
const ATTENTE_SORTIE = 0.8
const RECOUVREMENT_TEXTE = 0.3

const ECRANS_PAR_VUE = 4 / 3
/** La part de l'écart comblée à chaque image, pour suivre le défilement lissé. */
const LISSAGE = 0.15
const SCRUB = 2.5
const SCRUB_JAUGE = 0.3

const DECOUPES = ['stores', 'carreaux', 'lamelles', 'colonnes'] as const
type Decoupe = (typeof DECOUPES)[number]
const LAMES = { stores: 30, carreaux: 14, lamelles: 12, colonnes: 14 }
const CASCADE = 0.55
const DUREE_CASE = 1

function partCascade(cases: number) {
  const attente = PAS_LAME * (cases - 1)
  return attente / (attente + DUREE_CASE)
}

function colonnesGrille() {
  if (window.innerWidth <= 599) return 6
  if (window.innerWidth <= 1024) return 10
  return LAMES.colonnes
}

const BLOC = DUREE_LAME + PAS_LAME * (LAMES.stores - 1) - RECOUVREMENT_TEXTE + DUREE_TEXTE_ENTREE + ATTENTE_SORTIE + DUREE_TEXTE_SORTIE
const TOTAL = BLOC * planches.length
const SCENE_ECRANS = ECRANS_PAR_VUE * planches.length

/** Un désordre tenu par la position : le même à chaque visite. */
function desordre(rang: number) {
  const graine = Math.sin(rang * 12.9898) * 43758.5453
  return graine - Math.floor(graine)
}

type Lame = { a: SVGRectElement; b: SVGRectElement | null; centre: number; demi: number; retard: number }

function Planches() {
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const couches = [...scene.querySelectorAll<SVGSVGElement>('.pl-couche')]
    const textes = [...scene.querySelectorAll<HTMLElement>('.pl-texte')]
    const jauges = [...scene.querySelectorAll<HTMLElement>('.pl-remplissage')]
    const doux = !econome()

    let hautScene = 0
    let course = 0
    let jeux: Lame[][] = []

    function decouper(groupe: SVGGElement, decoupe: Decoupe, largeur: number, hauteur: number) {
      groupe.innerHTML = ''
      const lames: Lame[] = []
      const rectangle = () => {
        const forme = document.createElementNS(SVG, 'rect')
        forme.setAttribute('fill', 'white')
        forme.setAttribute('shape-rendering', 'crispEdges')
        groupe.appendChild(forme)
        return forme
      }

      if (decoupe === 'colonnes' || decoupe === 'carreaux') {
        const colonnes = decoupe === 'colonnes' ? colonnesGrille() : LAMES.carreaux
        const large = largeur / colonnes
        const lignes = decoupe === 'colonnes' ? Math.max(1, Math.round(colonnes * (hauteur / largeur))) : Math.ceil(hauteur / large)
        const haut = decoupe === 'colonnes' ? hauteur / lignes : large
        const total = colonnes * lignes
        let place = 0
        for (let colonne = 0; colonne < colonnes; colonne += 1) {
          const ordre = [...Array(lignes).keys()]
          if (decoupe === 'colonnes') ordre.sort((un, autre) => desordre(colonne * lignes + un) - desordre(colonne * lignes + autre))
          for (const ligne of ordre) {
            const forme = rectangle()
            // Les cases se touchent sans se chevaucher : sous une opacité
            // partielle, le moindre recouvrement se verrait en couture claire.
            forme.setAttribute('x', (colonne * large).toFixed(3))
            forme.setAttribute('y', (ligne * haut).toFixed(3))
            forme.setAttribute('width', large.toFixed(3))
            forme.setAttribute('height', haut.toFixed(3))
            forme.setAttribute('opacity', '0')
            const rang = ligne * colonnes + colonne
            lames.push({
              a: forme,
              b: null,
              centre: 0,
              demi: 0,
              retard: decoupe === 'colonnes' ? place / Math.max(1, total - 1) : desordre(rang),
            })
            place += 1
          }
        }
        return lames
      }

      const nombre = LAMES[decoupe]
      const vertical = decoupe === 'stores'
      const etendue = vertical ? hauteur : largeur
      const pas = etendue / nombre
      for (let rang = 0; rang < nombre; rang += 1) {
        const centre = vertical ? etendue - (rang * pas + pas / 2) : rang * pas + pas / 2
        lames.push({ a: rectangle(), b: rectangle(), centre, demi: pas / 2, retard: rang / Math.max(1, nombre - 1) })
      }
      return lames
    }

    function relever() {
      hautScene = scene!.getBoundingClientRect().top + window.scrollY
      course = window.innerHeight * SCENE_ECRANS
      const largeur = 100
      const hauteur = (window.innerHeight / window.innerWidth) * 100
      jeux = couches.map((couche, rang) => {
        couche.setAttribute('viewBox', `0 0 ${largeur} ${hauteur}`)
        couche.querySelector('mask rect')?.setAttribute('height', String(hauteur))
        couche.querySelector('image')?.setAttribute('height', String(hauteur))
        return decouper(couche.querySelector<SVGGElement>('.pl-decoupe')!, DECOUPES[rang], largeur, hauteur)
      })
    }

    function ouvrir(lames: Lame[], part: number, decoupe: Decoupe) {
      const cascade = decoupe === 'colonnes' ? partCascade(lames.length) : CASCADE
      for (const lame of lames) {
        const local = COURBE.quartSortie(borner((part - lame.retard * cascade) / (1 - cascade)))
        if (decoupe === 'colonnes' || decoupe === 'carreaux') {
          lame.a.setAttribute('opacity', local.toFixed(3))
          continue
        }
        const ouverture = lame.demi * local + 0.005
        if (decoupe === 'stores') {
          lame.a.setAttribute('x', '0')
          lame.a.setAttribute('width', '100')
          lame.a.setAttribute('y', (lame.centre - ouverture).toFixed(3))
          lame.a.setAttribute('height', ouverture.toFixed(3))
          lame.b!.setAttribute('x', '0')
          lame.b!.setAttribute('width', '100')
          lame.b!.setAttribute('y', lame.centre.toFixed(3))
          lame.b!.setAttribute('height', ouverture.toFixed(3))
          continue
        }
        lame.a.setAttribute('y', '0')
        lame.a.setAttribute('height', '200')
        lame.a.setAttribute('x', (lame.centre - ouverture).toFixed(3))
        lame.a.setAttribute('width', ouverture.toFixed(3))
        lame.b!.setAttribute('y', '0')
        lame.b!.setAttribute('height', '200')
        lame.b!.setAttribute('x', lame.centre.toFixed(3))
        lame.b!.setAttribute('width', ouverture.toFixed(3))
      }
    }

    function poser(lisse: number, suivie: number) {
      const temps = entre(hautScene, hautScene + course, lisse) * TOTAL
      for (let rang = 0; rang < couches.length; rang += 1) {
        const debut = rang * BLOC
        ouvrir(jeux[rang], entre(debut, debut + DUREE_LAME + PAS_LAME * (LAMES.stores - 1), temps), DECOUPES[rang])

        const entreeDebut = debut + DUREE_LAME + PAS_LAME * (LAMES.stores - 1) - RECOUVREMENT_TEXTE
        const entreeFaite = COURBE.expoSortie(entre(entreeDebut, entreeDebut + DUREE_TEXTE_ENTREE, temps))
        const sortieDebut = entreeDebut + DUREE_TEXTE_ENTREE + ATTENTE_SORTIE
        // La dernière planche ne sort pas : la section se termine sur elle.
        const sortieFaite = rang === couches.length - 1 ? 0 : COURBE.carreEntreeSortie(entre(sortieDebut, sortieDebut + DUREE_TEXTE_SORTIE, temps))

        const haut = melanger(100, 0, entreeFaite)
        const bas = melanger(0, 100, sortieFaite)
        const glisse = melanger(40, 0, entreeFaite) + melanger(0, -30, sortieFaite)
        textes[rang].style.clipPath = `inset(${haut.toFixed(2)}% 0 ${bas.toFixed(2)}% 0)`
        textes[rang].style.transform = `translate3d(0, ${glisse.toFixed(2)}px, 0)`
        // Un lien caché sous le cache ne doit pas se cliquer ni se tabuler.
        const lisible = haut < 40 && bas < 40
        textes[rang].style.pointerEvents = lisible ? 'auto' : 'none'
        textes[rang].toggleAttribute('inert', !lisible)
      }
      const avanceeJauge = entre(hautScene, hautScene + course, suivie)
      jauges.forEach((jauge, rang) => {
        jauge.style.width = `${(borner((avanceeJauge - rang / jauges.length) * jauges.length) * 100).toFixed(1)}%`
      })
    }

    relever()
    let position = window.scrollY
    const scrub = new Rattrapage(window.scrollY, SCRUB)
    const jauge = new Rattrapage(window.scrollY, SCRUB_JAUGE)

    const arreter = surDefilement((defilement, secondes) => {
      if (doux) {
        const part = 1 - Math.pow(1 - LISSAGE, Math.max(secondes, 0) * 60)
        position += (defilement - position) * part
        scrub.vers(position)
        jauge.vers(position)
      } else {
        position = defilement
        scrub.poser(defilement)
        jauge.poser(defilement)
      }
      poser(scrub.avancer(secondes), jauge.avancer(secondes))
      return scrub.bouge || jauge.bouge || Math.abs(position - defilement) > 0.5
    })

    function surTaille() {
      relever()
      position = window.scrollY
      scrub.poser(window.scrollY)
      jauge.poser(window.scrollY)
      poser(window.scrollY, window.scrollY)
    }
    window.addEventListener('resize', surTaille)
    return () => {
      arreter()
      window.removeEventListener('resize', surTaille)
    }
  }, [])

  return (
    <section className="pl sur-nuit" id="planches" aria-labelledby="pl-titre">
      <div className="pl-seuil">
        <h2 className="pl-seuil-titre titre" id="pl-titre" data-plan="0.15">
          Quatre planches
          <br />
          <span className="italique">qu’on peut ouvrir</span>
        </h2>
      </div>

      <div ref={sceneRef} className="pl-scene" style={{ height: `${(SCENE_ECRANS + 1) * 100}svh` }}>
        <div className="pl-couches">
          {planches.map((planche, rang) => (
            <svg key={planche.titre} className="pl-couche" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id={`pl-masque-${rang}`} maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g className="pl-decoupe" />
                </mask>
              </defs>
              <image
                href={planche.vue.source}
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid slice"
                mask={`url(#pl-masque-${rang})`}
              >
                <title>{planche.vue.alt}</title>
              </image>
            </svg>
          ))}

          <div className="pl-jauge" aria-hidden="true">
            {planches.map((planche) => (
              <div key={planche.titre} className="pl-segment">
                <div className="pl-remplissage" />
              </div>
            ))}
          </div>

          <div className="pl-textes">
            {planches.map((planche, rang) => (
              <article key={planche.titre} className="pl-texte">
                <p className="pl-numero titre">{String(rang + 1).padStart(2, '0')}</p>
                <h3 className="pl-nom titre">{planche.titre}</h3>
                <p className="pl-sous italique">{planche.sous}</p>
                <p className="pl-propos">{planche.propos}</p>
                <a className="bouton bouton--plein" href={planche.lien} target="_blank" rel="noreferrer">
                  {planche.lien.includes('github.com') ? 'Lire le code' : 'Ouvrir l’application'}
                  <span className="fleche" aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Planches
