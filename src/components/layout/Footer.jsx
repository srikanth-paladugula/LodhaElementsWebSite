import React from 'react'
import { Link } from 'react-router-dom'

const footerLinks = {
  Studio: [
    { label: 'Our Story',  href: '/#about' },
    { label: 'Services',   href: '/#services' },
    { label: 'Projects',   href: '/#projects' },
    { label: 'Process',    href: '/#process' },
  ],
  Connect: [
    { label: 'Contact Us',       href: '/#contact' },
    { label: 'Get a Quote',      href: '/quote' },
    { label: 'Consultations',    href: '/quote' },
    { label: 'Press & Media',    href: '/#contact' },
  ],
}

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'Pinterest',  href: 'https://pinterest.com', icon: PinterestIcon },
  { label: 'LinkedIn',   href: 'https://linkedin.com',  icon: LinkedInIcon },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.498 1.806 1.476 1.806 1.772 0 3.138-1.868 3.138-4.565 0-2.386-1.715-4.054-4.163-4.054-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.286c-.076.315-.244.995-.277 1.134-.045.183-.15.222-.345.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-dark text-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex flex-col leading-none mb-6">
              <span className="font-serif font-light text-2xl tracking-wider text-cream">Lodha Elements</span>
              <span className="text-[9px] tracking-widest3 uppercase text-stone mt-1">Interiors and Exteriors</span>
            </Link>
            <p className="text-sm font-light leading-relaxed text-stone max-w-xs">
              Crafting extraordinary living spaces that blend timeless elegance with
              contemporary sensibility. Every detail, deliberate.
            </p>
            <div className="flex gap-4 mt-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone hover:text-cream transition-colors duration-300"
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group}>
              <p className="text-[10px] tracking-widest3 uppercase text-stone mb-5">{group}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm font-light text-sand hover:text-cream transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-charcoal pt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-stone font-light">
            © {new Date().getFullYear()} Lodha Elements. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-stone hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-stone hover:text-cream transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
