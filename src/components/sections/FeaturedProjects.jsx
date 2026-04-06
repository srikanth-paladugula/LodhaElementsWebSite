import React from 'react'
import SectionTitle from '../ui/SectionTitle'
import Button from '../ui/Button'

const projects = [
  {
    id: 1,
    title: 'The Arora Residence',
    category: 'Residential · Mumbai',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&auto=format&fit=crop&q=80',
    size: 'large',
  },
  {
    id: 2,
    title: 'Serenity Penthouse',
    category: 'Residential · Delhi',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop&q=80',
    size: 'small',
  },
  {
    id: 3,
    title: 'The Meridian Club',
    category: 'Commercial · Bangalore',
    image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=900&auto=format&fit=crop&q=80',
    size: 'small',
  },
  {
    id: 4,
    title: 'Casa de Luna Villa',
    category: 'Residential · Goa',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop&q=80',
    size: 'medium',
  },
  {
    id: 5,
    title: 'Azure Sky Retreat',
    category: 'Hospitality · Udaipur',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&auto=format&fit=crop&q=80',
    size: 'medium',
  },
]

function ProjectCard({ project, delay = 0 }) {
  return (
    <div
      className={`reveal reveal-delay-${delay} group relative overflow-hidden cursor-pointer bg-beige`}
      style={{ aspectRatio: project.size === 'large' ? '3/2' : '4/5' }}
    >
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-luxury">
        <p className="text-[10px] tracking-widest uppercase text-sand mb-1 font-sans">{project.category}</p>
        <h3 className="font-serif font-light text-cream text-xl">{project.title}</h3>
      </div>
    </div>
  )
}

export default function FeaturedProjects() {
  return (
    <section id="projects" className="py-24 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="reveal">
            <SectionTitle
              eyebrow="Our Work"
              title={<>Selected<br />Projects</>}
            />
          </div>
          <div className="reveal reveal-delay-1 mb-2">
            <Button variant="outline" as="a" href="/#projects">
              All Projects
            </Button>
          </div>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Large feature */}
          <div className="md:col-span-2 md:row-span-2">
            <ProjectCard project={projects[0]} delay={1} />
          </div>
          {/* Stacked small cards */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <ProjectCard project={projects[1]} delay={2} />
            <ProjectCard project={projects[2]} delay={3} />
          </div>
          {/* Bottom row */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <ProjectCard project={projects[3]} delay={1} />
            <ProjectCard project={projects[4]} delay={2} />
          </div>
        </div>
      </div>
    </section>
  )
}
