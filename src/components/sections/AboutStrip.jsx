import React from 'react'

const stats = [
  { value: '150+', label: 'Projects Completed' },
  { value: '12',   label: 'Years of Excellence' },
  { value: '98%',  label: 'Client Satisfaction' },
  { value: '3',    label: 'Design Awards' },
]

export default function AboutStrip() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div>
            <p className="reveal text-xs tracking-widest3 uppercase text-stone mb-6 font-sans">Our Philosophy</p>
            <h2 className="reveal font-serif font-light text-charcoal text-4xl md:text-5xl leading-tight mb-8">
              Design Is Not<br />
              <em className="italic">Just How It Looks</em>
            </h2>
            <p className="reveal reveal-delay-1 text-stone font-light text-base leading-relaxed mb-6 max-w-md">
              At Lodha Elements, we believe that a great interior is a living experience.
              It is the warmth of morning light filtered through chosen fabrics, the
              satisfaction of a perfectly scaled room, the quiet confidence of materials
              that age beautifully.
            </p>
            <p className="reveal reveal-delay-2 text-stone font-light text-base leading-relaxed max-w-md">
              Our process is deliberate, collaborative, and deeply personal — because
              every space we design is a reflection of the people who inhabit it.
            </p>
          </div>

          {/* Image + stats */}
          <div className="flex flex-col gap-8">
            <div className="reveal relative overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80"
                alt="Design studio process"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={s.label} className={`reveal-delay-${i + 1}`}>
                  <p className="font-serif font-light text-charcoal text-3xl leading-none mb-1">{s.value}</p>
                  <p className="text-xs text-stone font-light leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
