import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home',      to: '/' },
  { label: 'Projects',  to: '/#projects' },
  { label: 'Services',  to: '/#services' },
  { label: 'About',     to: '/#about' },
  { label: 'Contact',   to: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isBuilder = pathname === '/quote-builder'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const alwaysSolid = isBuilder || scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury ${
        alwaysSolid
          ? 'bg-cream/95 backdrop-blur-sm shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none" aria-label="Lodha Elements Home">
          <span className={`font-serif font-light text-2xl tracking-wider transition-colors duration-300 ${alwaysSolid ? 'text-charcoal' : 'text-cream'}`}>
            Lodha Elements
          </span>
          <span className={`text-[9px] tracking-widest3 uppercase font-sans transition-colors duration-300 ${alwaysSolid ? 'text-stone' : 'text-sand'}`}>
            Interiors and Exteriors
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className={`text-xs tracking-widest uppercase font-sans font-medium transition-colors duration-300 hover:opacity-60 ${
                alwaysSolid ? 'text-charcoal' : 'text-cream'
              }`}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/quote-builder"
            className={`ml-2 text-xs tracking-widest uppercase font-sans font-medium transition-colors duration-300 hover:opacity-60 ${
              alwaysSolid ? 'text-charcoal' : 'text-cream'
            }`}
          >
            Quote Builder
          </Link>
          <Link
            to="/quote"
            className={`ml-2 text-xs tracking-widest uppercase font-sans font-medium border px-5 py-2 transition-all duration-300 ${
              alwaysSolid
                ? 'border-charcoal text-charcoal hover:bg-charcoal hover:text-cream'
                : 'border-cream text-cream hover:bg-cream hover:text-charcoal'
            }`}
          >
            Get Quote
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden flex flex-col gap-[5px] transition-colors duration-300 ${alwaysSolid ? 'text-charcoal' : 'text-cream'}`}
        >
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''} ${alwaysSolid ? 'bg-charcoal' : 'bg-cream'}`} />
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${alwaysSolid ? 'bg-charcoal' : 'bg-cream'}`} />
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''} ${alwaysSolid ? 'bg-charcoal' : 'bg-cream'}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-luxury ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } bg-cream`}
      >
        <nav className="flex flex-col px-6 py-6 gap-6 border-t border-beige">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase font-sans font-medium text-charcoal hover:text-stone transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/quote-builder"
            onClick={() => setMenuOpen(false)}
            className="text-xs tracking-widest uppercase font-sans font-medium text-charcoal hover:text-stone transition-colors"
          >
            Quote Builder
          </Link>
          <Link
            to="/quote"
            onClick={() => setMenuOpen(false)}
            className="text-xs tracking-widest uppercase font-sans font-medium border border-charcoal text-charcoal px-5 py-2 text-center hover:bg-charcoal hover:text-cream transition-all duration-300"
          >
            Get Quote
          </Link>
        </nav>
      </div>
    </header>
  )
}
