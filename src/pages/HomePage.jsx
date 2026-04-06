import React, { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import AboutStrip from '../components/sections/AboutStrip'
import ImageMarquee from '../components/sections/ImageMarquee'
import Services from '../components/sections/Services'
import Testimonials from '../components/sections/Testimonials'
import CTABanner from '../components/sections/CTABanner'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function HomePage() {
  useScrollReveal()

  return (
    <>
      <Hero />
      <FeaturedProjects />
      <AboutStrip />
      <ImageMarquee />
      <Services />
      <Testimonials />
      <CTABanner />
    </>
  )
}
