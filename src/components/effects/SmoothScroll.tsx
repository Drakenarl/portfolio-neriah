import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

/**
 * Défilement fluide pour toute la page. Coupé si la personne a demandé moins
 * d'animation : le défilement natif reprend alors la main.
 */
function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis()
    // Exposé pour les transitions de chapitre, qui font sauter la page.
    ;(window as unknown as { lenis?: Lenis }).lenis = lenis

    let image = requestAnimationFrame(function tourner(temps) {
      lenis.raf(temps)
      image = requestAnimationFrame(tourner)
    })

    return () => {
      cancelAnimationFrame(image)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
