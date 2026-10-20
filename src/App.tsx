import SmoothScroll from './components/effects/SmoothScroll'
import Plans from './components/effects/Plans'
import Attente from './components/Attente'
import Entete from './components/Entete'
import Griffe from './components/Griffe'
import Ouverture from './sections/Ouverture'
import Bandeau from './sections/Bandeau'
import Chapitres from './sections/Chapitres'
import Profil from './sections/Profil'
import Planches from './sections/Planches'
import Appel from './sections/Appel'
import Pied from './sections/Pied'

/* L'ordre répond aux questions qu'on se pose en lisant : qui, avec quels
   mots, ce qu'elle sait faire, d'où elle vient, ce qu'elle a fait, et la suite. */
function App() {
  return (
    <SmoothScroll>
      <Attente />
      <Griffe />
      <Entete />
      <main id="haut">
        <Ouverture />
        <Bandeau />
        <Chapitres />
        <Profil />
        <Planches />
        <Appel />
      </main>
      <Pied />
      <Plans />
    </SmoothScroll>
  )
}

export default App
