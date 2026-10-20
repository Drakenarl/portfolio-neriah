import { useState } from 'react'
import Reveal from '../components/effects/Reveal'
import SplitText from '../components/effects/SplitText'
import { chapitres } from '../data/contenu'
import { inspection } from '../lib/inspection'
import './Chapitres.css'

/*
 * Un accordéon numéroté, en chapitres de nuit. Le premier est ouvert :
 * une section qui s'ouvre sur trois titres fermés ne montre rien de ce
 * qu'elle sait. `?ouvert=2` ouvre le troisième.
 */
function Chapitres() {
  const [ouvert, setOuvert] = useState(() => inspection.ouvert() ?? 0)

  return (
    <section className="chap sur-nuit" id="chapitres" aria-labelledby="chap-titre">
      <div className="chap-tete">
        <h2 className="chap-titre titre" id="chap-titre">
          <SplitText text="Trois chapitres," />
          <br />
          <span className="italique chap-titre-suite">
            <SplitText text="onze dépôts." stagger={60} />
          </span>
        </h2>
        <p className="chap-chapo" data-plan="0.08">
          Ce qu’elle sait faire, rangé comme on range un volume : par arc, pas par langage.
        </p>
      </div>

      <ol className="chap-liste">
        {chapitres.map((chapitre, rang) => {
          const estOuvert = ouvert === rang
          return (
            <li key={chapitre.numero} className={`chap-entree ${estOuvert ? 'est-ouvert' : ''}`}>
              <Reveal delay={rang * 80}>
                <h3 className="chap-entree-tete">
                  <button
                    type="button"
                    className="chap-bouton"
                    aria-expanded={estOuvert}
                    aria-controls={`chap-corps-${rang}`}
                    onClick={() => setOuvert(estOuvert ? -1 : rang)}
                  >
                    <span className="chap-numero titre">{chapitre.numero}</span>
                    <span className="chap-nom titre">{chapitre.titre}</span>
                    <span className="chap-signe" aria-hidden="true" />
                  </button>
                </h3>
                <div className="chap-corps" id={`chap-corps-${rang}`} role="region" aria-hidden={!estOuvert}>
                  <div className="chap-corps-dedans">
                    <p className="chap-resume">{chapitre.resume}</p>
                    <dl className="chap-faits">
                      {chapitre.faits.map((fait) => (
                        <div className="chap-fait" key={fait.dit} data-plan={fait.valeur.length % 2 ? '0.05' : '-0.04'}>
                          <dt className="chap-valeur titre">{fait.valeur}</dt>
                          <dd className="chap-dit">{fait.dit}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="chap-outils" aria-label="Outils">
                      {chapitre.outils.map((outil) => (
                        <li key={outil}>{outil}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default Chapitres
