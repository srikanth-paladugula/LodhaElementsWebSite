import { useEffect } from 'react'

/**
 * Attaches an IntersectionObserver to all `.reveal` elements inside `rootRef`.
 * When an element enters the viewport it gets the `visible` class added.
 */
export function useScrollReveal(rootRef = null) {
  useEffect(() => {
    const root = rootRef ? rootRef.current : document
    if (!root) return

    const els = root.querySelectorAll ? root.querySelectorAll('.reveal') : document.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [rootRef])
}
