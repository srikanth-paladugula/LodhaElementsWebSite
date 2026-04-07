import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  loadConfig,
  createQuote, createRoom, createItem, createAddon,
  calculateItem, calculateRoom, calculatePricing, lookupRate, formatINR,
} from '../utils/quoteEngine'

/* ─── Shared tiny components ─────────────────────────────────── */
function Label({ children }) {
  return <label className="block text-xs tracking-widest uppercase font-sans text-stone mb-1">{children}</label>
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-beige bg-cream text-charcoal px-3 py-2 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors ${className}`}
      {...props}
    />
  )
}

function Select({ options, className = '', ...props }) {
  return (
    <select
      className={`w-full border border-beige bg-cream text-charcoal px-3 py-2 text-sm font-sans font-light focus:outline-none focus:border-stone transition-colors appearance-none ${className}`}
      {...props}
    >
      {options.map((o) =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}

/* ─── Inline grid cell helpers ────────────────────────────────── */
const cellBase = 'border border-beige bg-cream text-charcoal px-2 py-1.5 text-xs font-sans font-light focus:outline-none focus:border-stone transition-colors'
function CellInput({ className = '', ...props }) {
  return <input className={`${cellBase} w-full ${className}`} {...props} />
}
function CellSelect({ options, className = '', ...props }) {
  return (
    <select className={`${cellBase} w-full appearance-none ${className}`} {...props}>
      {options.map((o) =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}

/* ─── Collapsible section ─────────────────────────────────────── */
function Section({ title, badge, defaultOpen = true, actions, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-stone/30 rounded">
      <div className="w-full flex items-center justify-between px-5 py-3 bg-dark hover:bg-dark/90 transition-colors cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-cream text-xs font-sans">{open ? '▾' : '▸'}</span>
          <h2 className="font-serif font-light text-cream text-lg md:text-xl leading-none">{title}</h2>
          {badge != null && (
            <span className="text-[10px] tracking-wider uppercase font-sans text-gold bg-cream/10 px-2 py-0.5">{badge}</span>
          )}
        </div>
        {actions && <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>
      {open && <div className="px-5 pb-5 pt-3 bg-white border-t border-stone/20">{children}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE COMPONENT                                           */
/* ═══════════════════════════════════════════════════════════════ */
export default function QuoteBuilderPage() {
  const [config, setConfig] = useState(null)
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pricesAdded, setPricesAdded] = useState(false)
  const previewRef = useRef(null)

  /* ── Load config and init quote ── */
  useEffect(() => {
    loadConfig().then((cfg) => {
      setConfig(cfg)
      setQuote(createQuote(cfg))
      setLoading(false)
    })
  }, [])

  /* ── immutable-ish updaters ── */
  const update = useCallback((path, value) => {
    setQuote((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }, [])

  const setRooms = useCallback((fn) => {
    setQuote((prev) => ({ ...prev, rooms: fn(prev.rooms) }))
  }, [])

  const setAddons = useCallback((fn) => {
    setQuote((prev) => ({ ...prev, addons: fn(prev.addons) }))
  }, [])

  const handleAddPrices = useCallback(() => {
    setQuote((prev) => {
      if (!prev) return prev
      setPricesAdded(true)
      return {
        ...prev,
        rooms: prev.rooms.map((room) => ({
          ...room,
          items: room.items.map((item) => {
            const rate = item.rate > 0 ? item.rate : lookupRate(item.structure, item.surfaceFinish, config)
            const updated = { ...item, rate }
            updated.amount = calculateItem(updated)
            return updated
          })
        }))
      }
    })
  }, [config])

  if (loading || !config || !quote) {
    return (
      <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
        <p className="text-stone font-sans text-sm tracking-widest uppercase">Loading configuration…</p>
      </div>
    )
  }

  /* ── pricing recalc ── */
  const pricing = calculatePricing(quote)

  /* ── PDF export via html2pdf.js ── */
  async function handleExportPDF() {
    const el = previewRef.current
    if (!el) return
    setExporting(true)
    try {
      const { default: html2pdf } = await import('html2pdf.js')
      await html2pdf()
        .set({
          margin: [15, 10, 15, 10],
          filename: `${quote.quoteId}_${quote.client.name || 'quote'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(el)
        .save()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Spacer for fixed navbar */}
      <div className="h-20 md:h-24 shrink-0" />
      {/* ── Compact toolbar ── */}
      <div className="sticky top-0 z-40 bg-dark border-b-2 border-gold/40">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif font-light text-cream text-xl md:text-2xl leading-none">
              Quote Builder
            </h1>
            <span className="text-xs font-sans text-stone border border-stone/30 px-2.5 py-0.5">
              {quote.quoteId} &middot; Rev {quote.revision}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs tracking-widest uppercase font-sans text-stone hover:text-cream transition-colors"
            >
              {showPreview ? '← Edit' : 'Preview'}
            </button>
            <button
              type="button"
              onClick={() => { setShowPreview(true); setTimeout(handleExportPDF, 300) }}
              disabled={exporting}
              className="inline-flex items-center gap-2 bg-gold text-cream hover:bg-gold-light px-5 py-2 text-xs tracking-widest uppercase font-sans font-medium transition-all duration-300 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {exporting ? 'Generating…' : 'Export PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 bg-cream">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6">
          {showPreview ? (
            <PreviewSection quote={quote} pricing={pricing} previewRef={previewRef} config={config} />
          ) : (
            <div className="space-y-4">
              <Section title="Client & Project">
                <ClientFields quote={quote} update={update} config={config} />
              </Section>

              <RoomsSection quote={quote} setRooms={setRooms} config={config} pricesAdded={pricesAdded} setPricesAdded={setPricesAdded} handleAddPrices={handleAddPrices} />

              <AddonsSection quote={quote} setAddons={setAddons} config={config} />

              <Section title="Pricing & Terms">
                <PricingFields quote={quote} update={update} pricing={pricing} />
              </Section>

              {/* ── Grand total sticky bar ── */}
              <div className="sticky bottom-0 bg-dark text-cream px-6 py-4 -mx-6 lg:-mx-10 lg:px-10 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <SummaryChip label="Subtotal" value={pricing.subtotal} />
                  <SummaryChip label="Add-ons" value={pricing.addonsTotal} />
                  <SummaryChip label={`GST ${quote.pricing.gstPercent}%`} value={pricing.gstAmount} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] tracking-widest uppercase font-sans text-stone block">Grand Total</span>
                  <span className="font-serif font-light text-2xl text-gold">{formatINR(pricing.grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryChip({ label, value }) {
  return (
    <div>
      <span className="text-[10px] tracking-wider uppercase font-sans text-stone block">{label}</span>
      <span className="font-sans text-sm text-cream">{formatINR(value)}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  CLIENT & PROJECT FIELDS                                       */
/* ═══════════════════════════════════════════════════════════════ */
function ClientFields({ quote, update, config }) {
  const { client, project } = quote
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><Label>Client Name</Label><Input value={client.name} onChange={(e) => update('client.name', e.target.value)} placeholder="Full name" /></div>
        <div><Label>Phone</Label><Input value={client.phone} onChange={(e) => update('client.phone', e.target.value)} placeholder="+91 98765 43210" /></div>
        <div><Label>Email</Label><Input type="email" value={client.email} onChange={(e) => update('client.email', e.target.value)} placeholder="email@example.com" /></div>
        <div><Label>Address</Label><Input value={client.address} onChange={(e) => update('client.address', e.target.value)} placeholder="Site address" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div><Label>Project Name</Label><Input value={project.name} onChange={(e) => update('project.name', e.target.value)} placeholder="e.g. 2BHK Interior" /></div>
        <div><Label>Location</Label><Input value={project.location} onChange={(e) => update('project.location', e.target.value)} placeholder="City / Area" /></div>
        <div><Label>Type</Label><Select value={project.type} onChange={(e) => update('project.type', e.target.value)} options={config.projectTypes} /></div>
        <div><Label>Quote Date</Label><Input type="date" value={quote.date} onChange={(e) => update('date', e.target.value)} /></div>
        <div><Label>Valid Till</Label><Input type="date" value={quote.validTill} onChange={(e) => update('validTill', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><Label>Core Material</Label><Select value={quote.materials.core} onChange={(e) => update('materials.core', e.target.value)} options={config.coreMaterials} /></div>
        <div><Label>Plywood Company</Label><Select value={quote.materials.plywoodCompany} onChange={(e) => update('materials.plywoodCompany', e.target.value)} options={config.plywoodCompanies} /></div>
        <div><Label>Hardware Brand</Label><Select value={quote.materials.hardware} onChange={(e) => update('materials.hardware', e.target.value)} options={config.hardwareBrands} /></div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  ROOMS SECTION (each room is collapsible, items in grid)       */
/* ═══════════════════════════════════════════════════════════════ */
function RoomsSection({ quote, setRooms, config, pricesAdded, setPricesAdded, handleAddPrices }) {
  const [customName, setCustomName] = useState('')

  function addRoom(name) {
    if (!name) return
    setRooms((rooms) => [...rooms, createRoom(name)])
    setCustomName('')
    setPricesAdded(false)
  }

  function removeRoom(id) {
    setRooms((rooms) => rooms.filter((r) => r.id !== id))
    setPricesAdded(false)
  }

  function renameRoom(id, name) {
    setRooms((rooms) => rooms.map((r) => r.id === id ? { ...r, roomName: name } : r))
  }

  return (
    <Section
      title="Rooms"
      badge={`${quote.rooms.length} rooms`}
      actions={
        <div className="flex items-center gap-2">
          <input
            className="border border-beige bg-cream text-charcoal px-2 py-1 text-xs font-sans font-light focus:outline-none focus:border-stone w-36"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Custom room…"
            onKeyDown={(e) => e.key === 'Enter' && addRoom(customName)}
          />
          <button
            type="button"
            onClick={() => addRoom(customName)}
            className="text-[10px] tracking-wider uppercase font-sans bg-charcoal text-cream px-3 py-1 hover:bg-dark transition-colors"
          >
            + Add
          </button>
        </div>
      }
    >
      {/* Quick-add presets */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {config.roomPresets.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => addRoom(name)}
            className="text-[10px] border border-beige px-2.5 py-1 font-sans hover:border-charcoal hover:bg-charcoal hover:text-cream transition-all duration-200"
          >
            + {name}
          </button>
        ))}
      </div>

      {quote.rooms.length === 0 ? (
        <p className="text-stone font-light text-sm py-6 text-center">No rooms yet. Use the presets above or type a custom name to add one.</p>
      ) : (
        <div className="space-y-3">
          {quote.rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              quote={quote}
              config={config}
              setRooms={setRooms}
              onRename={(name) => renameRoom(room.id, name)}
              onRemove={() => removeRoom(room.id)}
              pricesAdded={pricesAdded}
              setPricesAdded={setPricesAdded}
            />
          ))}
        </div>
      )}

      {quote.rooms.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={pricesAdded ? () => setPricesAdded(false) : handleAddPrices}
            className="inline-flex items-center gap-2 bg-gold text-cream hover:bg-gold-light px-8 py-2.5 text-xs tracking-widest uppercase font-sans font-medium transition-all duration-300"
          >
            {pricesAdded ? '← Edit Items' : 'Add Prices'}
          </button>
        </div>
      )}
    </Section>
  )
}

/* ── Single room card with inline item grid ── */
function RoomCard({ room, quote, config, setRooms, onRename, onRemove, pricesAdded, setPricesAdded }) {
  const [open, setOpen] = useState(true)
  const roomTotal = calculateRoom(room)

  function addItem(component = '') {
    const item = createItem(component, config)
    item.material = { ...quote.materials }
    setRooms((rs) =>
      rs.map((r) => r.id === room.id ? { ...r, items: [...r.items, item] } : r)
    )
    setPricesAdded(false)
  }

  function updateItem(itemId, field, value) {
    setRooms((rs) =>
      rs.map((r) =>
        r.id === room.id
          ? {
              ...r,
              items: r.items.map((it) => {
                if (it.id !== itemId) return it
                const next = { ...it }
                if (field.includes('.')) {
                  const [parent, child] = field.split('.')
                  next[parent] = { ...next[parent], [child]: value }
                } else {
                  next[field] = value
                }
                if (field === 'component' && config.componentPresets?.[value]) {
                  const p = config.componentPresets[value]
                  next.structure = p.structure
                  next.category = p.category
                  next.dimensions = { ...next.dimensions, height: p.height }
                }
                return next
              }),
            }
          : r
      )
    )
    setPricesAdded(false)
  }

  function removeItem(itemId) {
    setRooms((rs) =>
      rs.map((r) =>
        r.id === room.id ? { ...r, items: r.items.filter((it) => it.id !== itemId) } : r
      )
    )
    setPricesAdded(false)
  }

  function cloneItem(itemId) {
    setRooms((rs) =>
      rs.map((r) => {
        if (r.id !== room.id) return r
        const original = r.items.find((it) => it.id === itemId)
        if (!original) return r
        const clone = { ...structuredClone(original), id: Date.now() + Math.random() }
        const idx = r.items.findIndex((it) => it.id === itemId)
        const newItems = [...r.items]
        newItems.splice(idx + 1, 0, clone)
        return { ...r, items: newItems }
      })
    )
    setPricesAdded(false)
  }

  function updateItemRate(itemId, newRate) {
    setRooms((rs) =>
      rs.map((r) =>
        r.id === room.id
          ? {
              ...r,
              items: r.items.map((it) => {
                if (it.id !== itemId) return it
                const updated = { ...it, rate: newRate }
                updated.amount = calculateItem(updated)
                return updated
              }),
            }
          : r
      )
    )
  }

  /* ── Build groups by Finish + Structure for priced view ── */
  function buildGroups() {
    const groups = {}
    room.items.forEach((item) => {
      const key = `${item.surfaceFinish}|${item.structure}`
      if (!groups[key]) groups[key] = { finish: item.surfaceFinish, structure: item.structure, items: [] }
      groups[key].items.push(item)
    })
    return Object.values(groups)
  }

  return (
    <div className="border border-beige bg-white">
      {/* Room header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-beige/30">
        <button type="button" onClick={() => setOpen(!open)} className="text-stone text-xs">{open ? '▾' : '▸'}</button>
        <input
          className="bg-transparent font-serif font-light text-charcoal text-base focus:outline-none flex-1 min-w-0"
          value={room.roomName}
          onChange={(e) => onRename(e.target.value)}
        />
        <span className="text-xs text-stone font-sans whitespace-nowrap">{room.items.length} items</span>
        {pricesAdded && <span className="text-xs font-sans font-medium text-charcoal whitespace-nowrap">{formatINR(roomTotal)}</span>}
        <button type="button" onClick={onRemove} className="text-stone hover:text-red-600 text-sm transition-colors ml-1" title="Remove room">✕</button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-2">
          {/* Quick-add component buttons (edit mode only) */}
          {!pricesAdded && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {config.components.slice(0, 10).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => addItem(c)}
                  className="text-[10px] border border-beige px-2 py-0.5 font-sans hover:border-charcoal hover:bg-charcoal hover:text-cream transition-all duration-200"
                >
                  + {c}
                </button>
              ))}
              <button
                type="button"
                onClick={() => addItem()}
                className="text-[10px] border border-gold text-gold px-2 py-0.5 font-sans hover:bg-gold hover:text-cream transition-all duration-200"
              >
                + Custom
              </button>
            </div>
          )}

          {room.items.length === 0 ? (
            <p className="text-stone font-light text-xs py-4 text-center">No items yet. Use the buttons above to add components.</p>
          ) : pricesAdded ? (
            /* ── Priced grouped view ── */
            <div className="overflow-x-auto space-y-3">
              {buildGroups().map((group) => {
                const groupSqft = group.items.reduce((sum, item) => {
                  if (item.calculationType === 'AREA' && item.included) return sum + (item.dimensions.length * item.dimensions.height) / 144
                  return sum
                }, 0)
                const groupAmount = group.items.reduce((sum, item) => sum + (item.included ? item.amount : 0), 0)
                return (
                  <div key={`${group.finish}-${group.structure}`}>
                    <div className="text-[10px] tracking-wider uppercase font-sans font-medium text-charcoal bg-beige/50 px-3 py-1.5 border border-beige">
                      {group.finish} &middot; {group.structure}
                    </div>
                    <table className="w-full text-xs font-sans border-collapse">
                      <thead>
                        <tr className="border-b border-beige">
                          <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Component</th>
                          <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Category</th>
                          <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-16">L (in)</th>
                          <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-16">H (in)</th>
                          <th className="text-right text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-16">Sqft</th>
                          <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-14">Qty</th>
                          <th className="text-right text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-20">Rate</th>
                          <th className="text-right text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-24">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.id} className={`border-b border-beige/50 ${!item.included ? 'opacity-40' : ''}`}>
                            <td className="py-1 px-1">{item.component}</td>
                            <td className="py-1 px-1">{item.category}</td>
                            <td className="py-1 px-1">{item.dimensions.length}</td>
                            <td className="py-1 px-1">{item.dimensions.height}</td>
                            <td className="py-1 px-1 text-right text-stone">
                              {item.calculationType === 'AREA' ? ((item.dimensions.length * item.dimensions.height) / 144).toFixed(2) : '—'}
                            </td>
                            <td className="py-1 px-1">{item.quantity}</td>
                            <td className="py-1 px-1">
                              <CellInput type="number" min="0" value={item.rate} onChange={(e) => updateItemRate(item.id, +e.target.value)} className="text-right w-20" />
                            </td>
                            <td className="py-1 px-1 text-right font-medium text-charcoal">{formatINR(item.amount)}</td>
                          </tr>
                        ))}
                        <tr className="border-t border-stone/30 bg-beige/20">
                          <td colSpan={4} className="py-1.5 px-1 text-right text-[10px] tracking-wider uppercase text-stone font-medium">Group Total</td>
                          <td className="py-1.5 px-1 text-right font-medium text-charcoal">{groupSqft.toFixed(2)}</td>
                          <td></td>
                          <td></td>
                          <td className="py-1.5 px-1 text-right font-medium text-charcoal">{formatINR(groupAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          ) : (
            /* ── Edit mode table ── */
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-beige">
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-6">✓</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Component</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Category</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Structure</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Finish</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-16">L (in)</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-16">H (in)</th>
                    <th className="text-right text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-16">Sqft</th>
                    <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-14">Qty</th>
                    <th className="w-14"></th>
                  </tr>
                </thead>
                <tbody>
                  {room.items.map((item) => (
                    <tr key={item.id} className={`border-b border-beige/50 ${!item.included ? 'opacity-40' : ''}`}>
                      <td className="py-1 px-1">
                        <input type="checkbox" checked={item.included} onChange={(e) => updateItem(item.id, 'included', e.target.checked)} className="accent-gold" />
                      </td>
                      <td className="py-1 px-1">
                        <CellSelect value={item.component} onChange={(e) => updateItem(item.id, 'component', e.target.value)} options={['', ...config.components]} />
                      </td>
                      <td className="py-1 px-1">
                        <CellSelect value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} options={config.categories} />
                      </td>
                      <td className="py-1 px-1">
                        <CellSelect value={item.structure} onChange={(e) => updateItem(item.id, 'structure', e.target.value)} options={config.structures} />
                      </td>
                      <td className="py-1 px-1">
                        <CellSelect value={item.surfaceFinish} onChange={(e) => updateItem(item.id, 'surfaceFinish', e.target.value)} options={config.finishes} />
                      </td>
                      <td className="py-1 px-1">
                        <CellInput type="number" min="0" value={item.dimensions.length} onChange={(e) => updateItem(item.id, 'dimensions.length', +e.target.value)} />
                      </td>
                      <td className="py-1 px-1">
                        <CellInput type="number" min="0" value={item.dimensions.height} onChange={(e) => updateItem(item.id, 'dimensions.height', +e.target.value)} />
                      </td>
                      <td className="py-1 px-1 text-right text-stone">
                        {item.calculationType === 'AREA' ? ((item.dimensions.length * item.dimensions.height) / 144).toFixed(2) : '—'}
                      </td>
                      <td className="py-1 px-1">
                        <CellInput type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', +e.target.value)} />
                      </td>
                      <td className="py-1 px-1">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => cloneItem(item.id)} className="text-stone hover:text-charcoal text-xs transition-colors" title="Clone">⧉</button>
                          <button type="button" onClick={() => removeItem(item.id)} className="text-stone hover:text-red-600 text-xs transition-colors" title="Remove">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pricesAdded && room.items.length > 0 && (
            <div className="flex justify-end pt-2">
              <span className="text-[10px] tracking-wider uppercase font-sans text-stone mr-3">Room Total</span>
              <span className="text-sm font-sans font-medium text-charcoal">{formatINR(roomTotal)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  ADD-ONS SECTION (editable grid)                               */
/* ═══════════════════════════════════════════════════════════════ */
function AddonsSection({ quote, setAddons, config }) {
  function addAddon() {
    setAddons((a) => [...a, createAddon()])
  }

  function updateAddon(id, field, value) {
    setAddons((addons) =>
      addons.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )
  }

  function removeAddon(id) {
    setAddons((addons) => addons.filter((a) => a.id !== id))
  }

  const addonsTotal = quote.addons.filter((a) => a.included).reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0)

  return (
    <Section
      title="Add-ons & Extras"
      badge={`${quote.addons.length} items`}
      actions={
        <button
          type="button"
          onClick={addAddon}
          className="text-[10px] tracking-wider uppercase font-sans bg-charcoal text-cream px-3 py-1 hover:bg-dark transition-colors"
        >
          + Add
        </button>
      }
    >
      {quote.addons.length === 0 ? (
        <p className="text-stone font-light text-xs py-4 text-center">No add-ons yet. Click "+ Add" to add extras like wallpaper, electrical, painting, etc.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-beige">
                <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-6">✓</th>
                <th className="text-left text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1">Name</th>
                <th className="text-right text-[10px] tracking-wider uppercase text-stone font-medium py-1.5 px-1 w-32">Amount (₹)</th>
                <th className="w-6"></th>
              </tr>
            </thead>
            <tbody>
              {quote.addons.map((addon) => (
                <tr key={addon.id} className={`border-b border-beige/50 ${!addon.included ? 'opacity-40' : ''}`}>
                  <td className="py-1 px-1">
                    <input type="checkbox" checked={addon.included} onChange={(e) => updateAddon(addon.id, 'included', e.target.checked)} className="accent-gold" />
                  </td>
                  <td className="py-1 px-1">
                    <CellInput value={addon.name} onChange={(e) => updateAddon(addon.id, 'name', e.target.value)} placeholder="e.g. Wallpaper, Painting" />
                  </td>
                  <td className="py-1 px-1">
                    <CellInput type="number" min="0" value={addon.amount} onChange={(e) => updateAddon(addon.id, 'amount', +e.target.value)} className="text-right" />
                  </td>
                  <td className="py-1 px-1">
                    <button type="button" onClick={() => removeAddon(addon.id)} className="text-stone hover:text-red-600 text-xs transition-colors">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-2">
            <span className="text-[10px] tracking-wider uppercase font-sans text-stone mr-3">Add-ons Total</span>
            <span className="text-sm font-sans font-medium text-charcoal">{formatINR(addonsTotal)}</span>
          </div>
        </div>
      )}
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PRICING & TERMS FIELDS                                        */
/* ═══════════════════════════════════════════════════════════════ */
function PricingFields({ quote, update, pricing }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><Label>GST %</Label><Input type="number" min="0" max="28" value={quote.pricing.gstPercent} onChange={(e) => update('pricing.gstPercent', +e.target.value)} /></div>
        <div><Label>Payment Terms</Label><Input value={quote.terms.paymentSlabs} onChange={(e) => update('terms.paymentSlabs', e.target.value)} /></div>
        <div><Label>Warranty</Label><Input value={quote.terms.warranty} onChange={(e) => update('terms.warranty', e.target.value)} /></div>
      </div>
      <div><Label>Exclusions</Label><Input value={quote.terms.exclusions} onChange={(e) => update('terms.exclusions', e.target.value)} /></div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PREVIEW (PDF template)                                        */
/* ═══════════════════════════════════════════════════════════════ */
function PreviewSection({ quote, pricing, previewRef, config }) {
  const company = config.company || {}
  const pdfStyles = config.pdf?.styles || ''

  return (
    <div ref={previewRef} style={{ background: '#fff', padding: 32, color: '#2C2C2C', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, lineHeight: 1.5 }}>
      <style>{pdfStyles}</style>
      <div className="pdf-page">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 28, margin: 0 }}>
            {company.name || 'Company'}
          </h1>
          <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#9E9082', margin: 0 }}>
            {company.tagline || ''}
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12 }}>
          <p><strong>{quote.quoteId}</strong> &middot; Rev {quote.revision}</p>
          <p>Date: {quote.date}</p>
          <p>Valid Till: {quote.validTill}</p>
        </div>
      </div>

      <h2>Client & Project</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 12, marginBottom: 12 }}>
        <p><strong>Client:</strong> {quote.client.name}</p>
        <p><strong>Project:</strong> {quote.project.name}</p>
        <p><strong>Phone:</strong> {quote.client.phone}</p>
        <p><strong>Location:</strong> {quote.project.location}</p>
        <p><strong>Email:</strong> {quote.client.email}</p>
        <p><strong>Type:</strong> {quote.project.type}</p>
      </div>

      {quote.rooms.map((room) => {
        const roomTotal = calculateRoom(room)
        const includedItems = room.items.filter((it) => it.included)
        const groups = {}
        includedItems.forEach((item) => {
          const key = `${item.surfaceFinish}|${item.structure}`
          if (!groups[key]) groups[key] = { finish: item.surfaceFinish, structure: item.structure, items: [] }
          groups[key].items.push(item)
        })
        const groupList = Object.values(groups)
        return (
          <div key={room.id} style={{ marginBottom: 16 }}>
            <h2>{room.roomName}</h2>
            {groupList.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Component (Structure + Finish)</th>
                    <th style={{ textAlign: 'right' }}>Total Sqft</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupList.map((group) => {
                    const groupSqft = group.items.reduce((sum, item) => {
                      if (item.calculationType === 'AREA') return sum + (item.dimensions.length * item.dimensions.height) / 144
                      return sum
                    }, 0)
                    const groupAmount = group.items.reduce((sum, item) => sum + (item.amount || calculateItem(item)), 0)
                    const componentNames = group.items.map((it) => it.component).filter(Boolean).join(', ')
                    return (
                      <tr key={`${group.finish}-${group.structure}`}>
                        <td>{componentNames} ({group.structure} + {group.finish})</td>
                        <td style={{ textAlign: 'right' }}>{groupSqft.toFixed(2)}</td>
                        <td style={{ textAlign: 'right' }}>{formatINR(groupAmount)}</td>
                      </tr>
                    )
                  })}
                  <tr style={{ fontWeight: 600 }}>
                    <td style={{ textAlign: 'right' }}>Room Subtotal</td>
                    <td></td>
                    <td style={{ textAlign: 'right' }}>{formatINR(roomTotal)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#9E9082', fontSize: 11 }}>No items</p>
            )}
          </div>
        )
      })}

      {quote.addons.length > 0 && (
        <>
          <h2>Add-ons & Extras</h2>
          <table>
            <thead>
              <tr><th>Name</th><th className="text-right">Amount</th></tr>
            </thead>
            <tbody>
              {quote.addons.filter((a) => a.included).map((a) => (
                <tr key={a.id}><td>{a.name}</td><td className="text-right">{formatINR(a.amount)}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Material Specifications</h2>
      <div style={{ fontSize: 12, marginBottom: 12 }}>
        <p><strong>Core:</strong> {quote.materials.core}</p>
        <p><strong>Plywood Company:</strong> {quote.materials.plywoodCompany}</p>
        <p><strong>Hardware:</strong> {quote.materials.hardware}</p>
      </div>

      <h2>Summary</h2>
      <table>
        <tbody>
          <tr><td>Work Subtotal</td><td className="text-right">{formatINR(pricing.subtotal)}</td></tr>
          <tr><td>Add-ons</td><td className="text-right">{formatINR(pricing.addonsTotal)}</td></tr>
          <tr><td>GST ({quote.pricing.gstPercent}%)</td><td className="text-right">{formatINR(pricing.gstAmount)}</td></tr>
          <tr style={{ fontWeight: 600 }}>
            <td><strong>Grand Total</strong></td><td className="text-right"><strong>{formatINR(pricing.grandTotal)}</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>Terms & Conditions</h2>
      <div style={{ fontSize: 11, color: '#9E9082' }}>
        <p><strong>Payment:</strong> {quote.terms.paymentSlabs}</p>
        <p><strong>Warranty:</strong> {quote.terms.warranty}</p>
        <p><strong>Exclusions:</strong> {quote.terms.exclusions}</p>
      </div>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
        <div className="sig-line">Client Signature</div>
        <div className="sig-line">Authorised Signature</div>
      </div>
      </div>{/* close pdf-page */}
    </div>
  )
}
