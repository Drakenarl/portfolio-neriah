import { identite, navigation } from '../data/contenu'
import './Entete.css'

/*
 * L'en-tête passe en différence : encre sur le papier, papier sur la nuit et
 * sur les planches, sans qu'aucun script ne guette la section en dessous.
 */
function Entete() {
  return (
    <header className="entete">
      <a className="entete-sigle titre" href="#haut" data-griffe="haut" aria-label="Retour au début">
        {identite.sigle}
        <span className="entete-vol italique">vol. 01</span>
      </a>
      <nav aria-label="Chapitres">
        <ul className="entete-liens">
          {navigation.map((lien) => (
            <li key={lien.cible}>
              <a className="entete-lien" href={`#${lien.cible}`} data-griffe={lien.cible}>
                {lien.nom}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Entete
