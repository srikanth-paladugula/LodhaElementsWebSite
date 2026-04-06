import React, { useState } from 'react'
import SectionTitle from '../ui/SectionTitle'

const testimonials = [
  {
    quote:
      "Lodha Elements transformed our apartment into something we could never have imagined. The attention to detail was extraordinary — every corner was considered. We feel like we're living inside a work of art.",
    author: 'Priya & Arjun Sharma',
    context: 'Residential Project, Mumbai',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&auto=format&fit=crop&q=80',
  },
  {
    quote:
      "The team understood our brand vision immediately. They created an office environment that impresses clients and inspires our team every single day. The ROI on this design investment has been remarkable.",
    author: 'Rahul Mehta',
    context: 'Commercial Project, Bangalore',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&auto=format&fit=crop&q=80',
  },
  {
    quote:
      "From the initial consultation to the final reveal, the process was seamless and deeply collaborative. They listened, they created, and they delivered something truly exceptional. Our villa feels like a five-star retreat.",
    author: 'Ananya & Vikram Nair',
    context: 'Villa Project, Goa',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&auto=format&fit=crop&q=80',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const t = testimonials[active]

  return (
    <section className="py-24 lg:py-32 bg-dark overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-16">
          <SectionTitle
            eyebrow="Client Stories"
            title="What They Say"
            center
            light
          />
        </div>

        {/* Active quote */}
        <div className="reveal text-center max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="font-serif text-7xl text-gold leading-none select-none">"</span>
          </div>
          <blockquote className="font-serif font-light text-cream text-xl md:text-2xl leading-relaxed mb-10 italic transition-all duration-500">
            {t.quote}
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img
              src={t.image}
              alt={t.author}
              className="w-12 h-12 rounded-full object-cover border border-stone"
            />
            <div className="text-left">
              <p className="text-cream text-sm font-medium font-sans">{t.author}</p>
              <p className="text-stone text-xs font-light">{t.context}</p>
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${
                i === active
                  ? 'w-6 h-2 bg-gold'
                  : 'w-2 h-2 bg-stone hover:bg-sand'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
