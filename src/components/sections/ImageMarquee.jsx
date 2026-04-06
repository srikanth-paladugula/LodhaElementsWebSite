import React, { useEffect, useRef } from 'react'

const IMAGES = [
  'https://images.unsplash.com/photo-1618296498428-475b880e5b0a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1632210826643-9ff7e84be2f9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1632829401795-2745c905ac77?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0',
  'https://images.unsplash.com/photo-1634547588713-edd93045b9f1?q=80&w=1700&auto=format&fit=crop&ixlib=rb-4.1.0',
]

export default function ImageMarquee() {
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const offsetRef = useRef(0)
  const speedRef = useRef(0.4)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    function tick() {
      offsetRef.current -= speedRef.current
      const halfWidth = track.scrollWidth / 2
      if (Math.abs(offsetRef.current) >= halfWidth) {
        offsetRef.current += halfWidth
      }
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* Duplicate images for seamless loop */
  const doubled = [...IMAGES, ...IMAGES]

  return (
    <section className="py-20 lg:py-28 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
        <p className="reveal text-xs tracking-widest3 uppercase text-stone mb-4 font-sans">Inspiration</p>
        <h2 className="reveal font-serif font-light text-cream text-3xl md:text-4xl leading-tight">
          Spaces That <em className="italic">Speak</em>
        </h2>
      </div>

      <div className="relative">
        <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ width: 'max-content' }}>
          {doubled.map((src, i) => (
            <div
              key={i}
              className="relative shrink-0 w-[340px] md:w-[440px] lg:w-[520px] aspect-[4/3] overflow-hidden group"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/10 group-hover:bg-dark/0 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
