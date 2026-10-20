// L'écran d'attente : le N du volume se trace au trait sur le noir, se
// remplit, puis vingt lattes se replient vers la droite et découvrent la page.
// Il ne joue qu'une fois, au chargement.

import { useEffect, useRef, useState } from 'react'
import { COURBE, LigneDeTemps, jouer } from '../lib/animation/ligneDeTemps'
import { inspection, mouvementReduit } from '../lib/inspection'
import './Attente.css'

/** Le N en deux blocs : la hampe et la diagonale à l'encre du papier, la seconde hampe en rose. */
const SYMBOLE = [
  { trace: 'M14 0H58L104 128V200H86L42 76V200H14Z', classe: 'attente-trait--papier' },
  { trace: 'M110 0H138V200H110Z', classe: 'attente-trait--beni' },
]

const LATTES = 20
const GLISSE = 0.4
const RETARD = 0.02

/*
 * La ligne de temps entière, en secondes. Elle s'écrit une fois et se pose à
 * n'importe quel instant : `?attente=1.8` fige l'écran à 1,8 seconde.
 */
const TRACE = { debut: 0.15, duree: 1.3 }
const REMPLI = { debut: 1.05, duree: 0.6 }
const VOILE = { debut: 1.75, duree: 0.25 }
const REPLI = { debut: 1.85 }

function construire(racine: HTMLElement) {
  const lattes = [...racine.querySelectorAll<HTMLElement>('.attente-latte')]
  const voile = racine.querySelector<HTMLElement>('.attente-voile')!
  const traces = [...racine.querySelectorAll<SVGPathElement>('.attente-marque path')]
  const longueurs = traces.map((trace) => trace.getTotalLength())

  traces.forEach((trace, rang) => {
    trace.style.strokeDasharray = String(longueurs[rang])
    trace.style.strokeDashoffset = String(longueurs[rang])
  })

  return new LigneDeTemps([
    {
      ...TRACE,
      courbe: COURBE.cubeEntreeSortie,
      nombre: traces.length,
      decalage: 0.12,
      poser: (avancee, rang) => {
        traces[rang].style.strokeDashoffset = String(longueurs[rang] * (1 - avancee))
      },
    },
    {
      ...REMPLI,
      courbe: COURBE.cubeSortie,
      nombre: traces.length,
      decalage: 0.1,
      poser: (avancee, rang) => {
        traces[rang].style.fillOpacity = String(avancee)
      },
    },
    {
      ...VOILE,
      courbe: COURBE.cubeSortie,
      poser: (avancee) => {
        voile.style.opacity = String(1 - avancee)
      },
    },
    {
      debut: REPLI.debut,
      duree: GLISSE,
      courbe: COURBE.cubeSortie,
      decalage: RETARD,
      nombre: lattes.length,
      poser: (avancee, rang) => {
        lattes[rang].style.transform = `scaleX(${1 - avancee})`
      },
    },
  ])
}

function Attente() {
  const racineRef = useRef<HTMLDivElement>(null)
  const fige = inspection.attente()
  const [fini, setFini] = useState(() => fige === 0 || mouvementReduit())

  useEffect(() => {
    const racine = racineRef.current
    if (!racine || fini) return

    const ligne = construire(racine)

    if (fige !== null) {
      ligne.poser(fige)
      return
    }

    document.documentElement.classList.add('en-attente')
    const arreter = jouer(ligne, () => {
      document.documentElement.classList.remove('en-attente')
      setFini(true)
    })

    return () => {
      arreter()
      document.documentElement.classList.remove('en-attente')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (fini) return null

  return (
    <div className="attente" ref={racineRef} aria-hidden="true">
      <div className="attente-lattes">
        {Array.from({ length: LATTES }, (_, rang) => (
          <div className="attente-latte" key={rang} />
        ))}
      </div>

      <div className="attente-voile">
        <svg className="attente-marque" viewBox="0 0 152 200" fill="none">
          {SYMBOLE.map((bloc) => (
            <path key={bloc.trace} d={bloc.trace} className={bloc.classe} strokeWidth={2} />
          ))}
        </svg>
        <p className="attente-legende">Volume 01</p>
      </div>
    </div>
  )
}

export default Attente
