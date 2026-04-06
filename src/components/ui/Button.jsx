import React from 'react'

const variants = {
  primary:
    'bg-charcoal text-cream hover:bg-dark border border-charcoal px-8 py-3.5 text-sm tracking-widest2 uppercase font-sans font-medium transition-all duration-300 ease-luxury',
  outline:
    'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-cream px-8 py-3.5 text-sm tracking-widest2 uppercase font-sans font-medium transition-all duration-300 ease-luxury',
  gold:
    'bg-gold text-cream hover:bg-gold-light border border-gold px-8 py-3.5 text-sm tracking-widest2 uppercase font-sans font-medium transition-all duration-300 ease-luxury',
  'outline-white':
    'bg-transparent text-cream border border-cream hover:bg-cream hover:text-charcoal px-8 py-3.5 text-sm tracking-widest2 uppercase font-sans font-medium transition-all duration-300 ease-luxury',
}

export default function Button({ children, variant = 'primary', className = '', as: Tag = 'button', ...props }) {
  return (
    <Tag className={`inline-block cursor-pointer ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
