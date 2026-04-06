import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8s] ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&auto=format&fit=crop&q=80')`,
        }}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark/70" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-xs tracking-widest3 uppercase text-sand mb-6 font-sans animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          Premium Interior Design
        </p>
        <h1 className="font-serif font-light text-cream text-5xl md:text-7xl lg:text-8xl leading-none mb-8 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          Spaces That<br />
          <em className="italic font-light">Tell Your Story</em>
        </h1>
        <p className="text-sand font-light text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          We design living environments of rare beauty and quiet luxury —
          where every element is chosen with intention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <Button variant="outline-white" as="a" href="/#projects">
            View Projects
          </Button>
          <Button variant="gold" as={Link} to="/quote">
            Get Consultation
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
        <span className="text-[10px] tracking-widest text-sand uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-sand to-transparent" />
      </div>
    </section>
  )
}
