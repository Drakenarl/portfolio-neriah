import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Retard avant l'apparition, en millisecondes, pour cascader des blocs. */
  delay?: number
  className?: string
}

/**
 * Fait monter un bloc quand il entre dans l'écran. Un IntersectionObserver
 * plutôt qu'un écouteur de défilement : rien ne tourne en continu, et
 * l'observateur se débranche après la première apparition.
 */
function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
      { threshold: 0.15 },
    )
    observateur.observe(element)
    return () => observateur.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default Reveal
