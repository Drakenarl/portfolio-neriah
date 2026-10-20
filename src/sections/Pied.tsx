import { GITHUB, identite, planches } from '../data/contenu'
import './Pied.css'

function Pied() {
  return (
    <footer className="pied sur-nuit">
      <div className="pied-haut">
        <div>
          <p className="pied-fin italique" data-plan="-0.05">Fin du volume 01.</p>
          <p className="pied-nom-complet">{identite.complet}</p>
        </div>
        <nav aria-label="Liens du pied">
          <ul className="pied-liens">
            {planches.map((planche) => (
              <li key={planche.titre}>
                <a href={planche.lien} target="_blank" rel="noreferrer">
                  {planche.titre}
                </a>
              </li>
            ))}
            <li>
              <a href={GITHUB} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="pied-marque titre" aria-hidden="true" data-plan="0.12">
        {identite.nom}
      </p>
      <div className="pied-bas">
        <span>2026</span>
        <a href="#haut" data-griffe="haut">
          Revenir à la première page ↑
        </a>
      </div>
    </footer>
  )
}

export default Pied
