import React, { useState } from 'react'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'

/* ─── Form state helpers ─────────────────────────────────────── */
const ROOM_TYPES = [
  'Living Room',
  'Master Bedroom',
  'Guest Bedroom',
  'Kitchen',
  'Dining Room',
  'Home Office',
  'Bathroom',
  'Children\'s Room',
  'Pooja / Prayer Room',
  'Entryway / Foyer',
]

const STYLES = [
  { id: 'contemporary', label: 'Contemporary' },
  { id: 'classic',      label: 'Classic' },
  { id: 'minimalist',   label: 'Minimalist' },
  { id: 'luxury',       label: 'Luxury' },
  { id: 'rustic',       label: 'Rustic' },
  { id: 'eclectic',     label: 'Eclectic' },
]

const SCOPES = [
  { id: 'full',     label: 'Full Design',   desc: 'Complete redesign from scratch' },
  { id: 'partial',  label: 'Partial Refresh', desc: 'Update key elements only' },
  { id: 'consult',  label: 'Consultation',  desc: 'Expert advice & direction' },
  { id: 'styling',  label: 'Styling Only',  desc: 'Final styling & accessorising' },
]

const BUDGET_BANDS = [
  '₹5L – ₹10L',
  '₹10L – ₹25L',
  '₹25L – ₹50L',
  '₹50L – ₹1Cr',
  '₹1Cr+',
]

const TIMELINES = [
  'Flexible (3+ months)',
  'Standard (6–8 weeks)',
  'Expedited (4 weeks)',
  'Rush (2 weeks)',
]

/* ─── Base rate lookup (INR per sq ft, illustrative) ─────────── */
const BASE_RATE = { full: 2500, partial: 1200, consult: 300, styling: 600 }

/* ─── Component ─────────────────────────────────────────────── */
export default function QuotePage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    // Step 1
    propertyType: '',
    area: '',
    rooms: [],
    // Step 2
    style: '',
    scope: '',
    budget: '',
    timeline: '',
    // Step 3
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  /* ── helpers ── */
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleRoom(room) {
    setForm((prev) => ({
      ...prev,
      rooms: prev.rooms.includes(room)
        ? prev.rooms.filter((r) => r !== room)
        : [...prev.rooms, room],
    }))
  }

  /* ── rough estimate ── */
  function getEstimate() {
    const sqft = parseFloat(form.area) || 0
    const rate = BASE_RATE[form.scope] || 0
    const min = Math.round((sqft * rate * 0.85) / 100) * 100
    const max = Math.round((sqft * rate * 1.15) / 100) * 100
    if (!sqft || !form.scope) return null
    return { min, max }
  }

  const estimate = getEstimate()

  /* ── validation ── */
  function canGoNext() {
    if (step === 1) return form.propertyType && form.area && form.rooms.length > 0
    if (step === 2) return form.style && form.scope && form.budget && form.timeline
    if (step === 3) return form.name && form.email
    return true
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  /* ── step labels ── */
  const steps = ['Property', 'Design', 'Contact']

  return (
    <>
      {/* Page hero */}
      <section className="pt-36 pb-16 bg-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-widest3 uppercase text-stone mb-4 font-sans">Complimentary</p>
          <h1 className="font-serif font-light text-cream text-5xl md:text-6xl leading-tight mb-6">
            Quote Estimator
          </h1>
          <p className="text-sand font-light text-base leading-relaxed">
            Answer a few questions and receive a personalised design estimate within 24 hours.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-20 bg-cream min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-6">

          {submitted ? (
            <ThankYou name={form.name} />
          ) : (
            <>
              {/* Progress stepper */}
              <Stepper steps={steps} current={step} />

              <form onSubmit={handleSubmit} noValidate>
                {step === 1 && (
                  <StepProperty form={form} set={set} toggleRoom={toggleRoom} />
                )}
                {step === 2 && (
                  <StepDesign form={form} set={set} estimate={estimate} />
                )}
                {step === 3 && (
                  <StepContact form={form} set={set} estimate={estimate} />
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-12 pt-8 border-t border-beige">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="text-xs tracking-widest uppercase font-sans text-stone hover:text-charcoal transition-colors"
                    >
                      ← Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setStep((s) => s + 1)}
                      className={canGoNext() ? '' : 'opacity-40 pointer-events-none'}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="gold"
                      className={canGoNext() ? '' : 'opacity-40 pointer-events-none'}
                    >
                      Send Request
                    </Button>
                  )}
                </div>
              </form>
            </>
          )}

        </div>
      </section>
    </>
  )
}

/* ─── Sub-components ─────────────────────────────────────────── */

function Stepper({ steps, current }) {
  return (
    <div className="flex items-center mb-14">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < current
        const active = idx === current
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all duration-300 ${
                  done    ? 'bg-charcoal text-cream' :
                  active  ? 'bg-gold text-cream' :
                            'bg-beige text-stone'
                }`}
              >
                {done ? '✓' : idx}
              </div>
              <span className={`text-[10px] tracking-wider uppercase font-sans ${active ? 'text-charcoal' : 'text-stone'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 mb-5 transition-colors duration-300 ${done ? 'bg-charcoal' : 'bg-beige'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function StepProperty({ form, set, toggleRoom }) {
  return (
    <div className="space-y-10">
      <div>
        <Label>Property Type</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {['Apartment', 'Villa / Bungalow', 'Penthouse', 'Townhouse', 'Commercial Office', 'Retail / Boutique'].map((pt) => (
            <SelectCard
              key={pt}
              label={pt}
              selected={form.propertyType === pt}
              onClick={() => set('propertyType', pt)}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>Total Built-up Area (sq. ft)</Label>
        <input
          type="number"
          min="100"
          max="50000"
          placeholder="e.g. 2500"
          value={form.area}
          onChange={(e) => set('area', e.target.value)}
          className="mt-3 w-full max-w-xs border border-beige bg-cream text-charcoal px-4 py-3 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors"
        />
      </div>

      <div>
        <Label>Rooms to Design <span className="text-stone font-light">(select all that apply)</span></Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {ROOM_TYPES.map((room) => (
            <SelectCard
              key={room}
              label={room}
              selected={form.rooms.includes(room)}
              onClick={() => toggleRoom(room)}
              multi
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepDesign({ form, set, estimate }) {
  return (
    <div className="space-y-10">
      <div>
        <Label>Preferred Style</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {STYLES.map((s) => (
            <SelectCard
              key={s.id}
              label={s.label}
              selected={form.style === s.id}
              onClick={() => set('style', s.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>Scope of Work</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {SCOPES.map((s) => (
            <SelectCard
              key={s.id}
              label={s.label}
              desc={s.desc}
              selected={form.scope === s.id}
              onClick={() => set('scope', s.id)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <Label>Budget Range</Label>
          <select
            value={form.budget}
            onChange={(e) => set('budget', e.target.value)}
            className="mt-3 w-full border border-beige bg-cream text-charcoal px-4 py-3 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors appearance-none"
          >
            <option value="">Select budget</option>
            {BUDGET_BANDS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <Label>Timeline</Label>
          <select
            value={form.timeline}
            onChange={(e) => set('timeline', e.target.value)}
            className="mt-3 w-full border border-beige bg-cream text-charcoal px-4 py-3 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors appearance-none"
          >
            <option value="">Select timeline</option>
            {TIMELINES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {estimate && (
        <EstimateCard estimate={estimate} />
      )}
    </div>
  )
}

function StepContact({ form, set, estimate }) {
  return (
    <div className="space-y-8">
      {estimate && <EstimateCard estimate={estimate} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Full Name *" type="text" value={form.name} onChange={(v) => set('name', v)} placeholder="Your name" />
        <FormField label="Email Address *" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@example.com" />
        <FormField label="Phone Number" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+91 98765 43210" />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase font-sans text-stone mb-2">
          Additional Notes
        </label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Tell us about your vision, inspiration, or any specific requirements..."
          className="w-full border border-beige bg-cream text-charcoal px-4 py-3 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors resize-none"
        />
      </div>

      <p className="text-xs text-stone font-light">
        By submitting this form you agree to be contacted by our design team.
        We respect your privacy and never share your information.
      </p>
    </div>
  )
}

function EstimateCard({ estimate }) {
  const fmt = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : `₹${n.toLocaleString('en-IN')}`
  return (
    <div className="bg-dark text-cream p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-[10px] tracking-widest uppercase text-stone font-sans mb-1">Indicative Estimate</p>
        <p className="font-serif font-light text-3xl">
          {fmt(estimate.min)} – {fmt(estimate.max)}
        </p>
        <p className="text-xs text-stone mt-1 font-light">
          Final investment subject to detailed scope discussion
        </p>
      </div>
      <div className="w-px h-12 bg-stone hidden sm:block" />
      <p className="text-xs text-sand font-light max-w-[200px]">
        Includes design fees, project management, and site supervision.
      </p>
    </div>
  )
}

function SelectCard({ label, desc, selected, onClick, multi = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-4 py-3 border text-sm font-sans font-light transition-all duration-200 ${
        selected
          ? 'border-charcoal bg-charcoal text-cream'
          : 'border-beige bg-cream text-charcoal hover:border-stone'
      }`}
    >
      <span className="block font-medium text-xs tracking-wide">{label}</span>
      {desc && <span className="block text-[11px] mt-0.5 opacity-70">{desc}</span>}
    </button>
  )
}

function Label({ children }) {
  return (
    <label className="block text-xs tracking-widest uppercase font-sans text-stone">
      {children}
    </label>
  )
}

function FormField({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase font-sans text-stone mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-beige bg-cream text-charcoal px-4 py-3 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors"
      />
    </div>
  )
}

function ThankYou({ name }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="font-serif font-light text-charcoal text-4xl mb-4">
        Thank You{name ? `, ${name.split(' ')[0]}` : ''}
      </h2>
      <p className="text-stone font-light text-base max-w-md mx-auto leading-relaxed mb-10">
        Your enquiry has been received. A member of our design team will be in
        touch within 24 hours to discuss your project.
      </p>
      <Button variant="outline" as="a" href="/">
        Back to Home
      </Button>
    </div>
  )
}
