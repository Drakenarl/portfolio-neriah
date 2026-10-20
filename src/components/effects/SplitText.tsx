import { useEffect, useRef, useState } from 'react'

type SplitTextProps = {
  text: string
  /** Découpe par lettre plutôt que par mot. */
  byLetter?: boolean
  /** Écart entre deux apparitions, en millisecondes. */
  stagger?: number
  className?: string
}

/**
 * Un titre qui arrive morceau par morceau. Le texte entier reste lu d'un
 * bloc par les lecteurs d'écran (aria-label), les morceaux leur sont cachés.
 */
function SplitText({ text, byLetter = false, stagger = 40, className }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  const morceaux = byLetter ? Array.from(text) : text.split(' ')

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const element = ref.current
    if (!element) return

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return
        setVisible(true)
        observateur.disconnect()
      },
      { threshold: 0.3 },
    )
    observateur.observe(element)
    return () => observateur.disconnect()
  }, [])

  return (
    <span ref={ref} aria-label={text} className={className}>
      {morceaux.map((morceau, rang) => (
        <span
          key={`${morceau}-${rang}`}
          aria-hidden="true"
          className={`inline-block transition-all duration-500 ease-out motion-reduce:transition-none ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
          style={{ transitionDelay: `${rang * stagger}ms` }}
        >
          {/* Une espace seule dans un bloc en ligne s'écrase à zéro : on la
              rend insécable, sinon « À suivre » s'affiche « Àsuivre ». */}
          {byLetter && morceau === ' ' ? ' ' : morceau}
          {byLetter ? '' : ' '}
        </span>
      ))}
    </span>
  )
}

export default SplitText
