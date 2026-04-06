import React from 'react'

export default function SectionTitle({ eyebrow, title, subtitle, center = false, light = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className={`text-xs tracking-widest3 uppercase mb-4 ${light ? 'text-sand' : 'text-stone'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif font-light leading-tight text-4xl md:text-5xl lg:text-6xl ${light ? 'text-cream' : 'text-charcoal'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base font-light leading-relaxed max-w-xl ${center ? 'mx-auto' : ''} ${light ? 'text-sand' : 'text-stone'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
