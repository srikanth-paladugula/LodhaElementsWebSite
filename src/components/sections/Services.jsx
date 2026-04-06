import React from 'react'
import SectionTitle from '../ui/SectionTitle'

const services = [
  {
    number: '01',
    title: 'Residential Design',
    description:
      'Full-scope interior design for private residences — from concept to completion. We transform living spaces into deeply personal sanctuaries.',
    features: ['Space Planning', 'Material Curation', 'Furniture Design', 'Lighting Design'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
  },
  {
    number: '02',
    title: 'Commercial Spaces',
    description:
      'Bespoke environments for offices, boutiques, hotels, and restaurants that reflect brand identity while creating memorable experiences.',
    features: ['Brand Alignment', 'Spatial Strategy', 'Custom Joinery', 'FF&E Procurement'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
  },
  {
    number: '03',
    title: 'Renovation & Styling',
    description:
      'Thoughtful renovations and expert styling for spaces that need a refined refresh — respecting the existing while elevating the whole.',
    features: ['Design Audits', 'Colour Consulting', 'Art Curation', 'Move-in Styling'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="reveal text-center mb-20">
          <SectionTitle
            eyebrow="What We Offer"
            title="Our Services"
            subtitle="A complete design offering — from the first sketch to the final flourish."
            center
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={s.number}
              className={`reveal reveal-delay-${i + 1} group bg-cream overflow-hidden flex flex-col`}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-104"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <span className="font-serif text-5xl text-beige font-light leading-none mb-4 select-none">{s.number}</span>
                <h3 className="font-serif font-light text-charcoal text-2xl mb-4">{s.title}</h3>
                <p className="text-stone text-sm font-light leading-relaxed mb-6 flex-1">{s.description}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-xs text-stone font-sans">
                      <span className="w-4 h-px bg-gold inline-block flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
