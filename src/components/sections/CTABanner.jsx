import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function CTABanner() {
  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&auto=format&fit=crop&q=80')`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-charcoal/70" aria-hidden="true" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-sand/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-sand/20 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="reveal text-xs tracking-widest3 uppercase text-sand mb-6 font-sans">
          Begin Your Journey
        </p>
        <h2 className="reveal font-serif font-light text-cream text-4xl md:text-6xl leading-tight mb-8">
          Let's Create Something<br />
          <em className="italic">Truly Extraordinary</em>
        </h2>
        <p className="reveal text-sand font-light text-base max-w-md mx-auto mb-12 leading-relaxed">
          Book a complimentary consultation and discover how we can
          transform your space into a masterpiece of design.
        </p>
        <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="gold" as={Link} to="/quote">
            Get Free Consultation
          </Button>
          <Button variant="outline-white" as="a" href="mailto:hello@lodhaelements.com">
            Email Us
          </Button>
        </div>
      </div>
    </section>
  )
}
