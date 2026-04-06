/* ─── Config loader ────────────────────────────────────────── */
let _config = null

export async function loadConfig() {
  if (_config) return _config
  const res = await fetch('/config/quote-config.json')
  if (!res.ok) throw new Error('Failed to load quote config')
  _config = await res.json()
  return _config
}

export function getConfig() {
  return _config
}

/* ─── Factory functions (config-driven) ────────────────────── */
let _quoteCounter = 1

export function createQuote(config) {
  const defaults = config?.defaults || {}
  const today = new Date()
  const validDate = new Date(today)
  validDate.setDate(validDate.getDate() + (defaults.validityDays || 15))

  return {
    quoteId: `QT-${String(_quoteCounter++).padStart(3, '0')}`,
    revision: 1,
    date: today.toISOString().slice(0, 10),
    validTill: validDate.toISOString().slice(0, 10),
    client: { name: '', phone: '', email: '', address: '' },
    project: { name: '', location: '', type: (config?.projectTypes || [])[0] || 'Residential' },
    rooms: [],
    addons: [],
    materials: { ...(defaults.materials || { core: 'BWP Ply', plywoodCompany: 'Saburi', hardware: 'Hettich' }) },
    pricing: {
      subtotal: 0,
      addonsTotal: 0,
      discount: defaults.pricing?.discount || 0,
      gstPercent: defaults.pricing?.gstPercent || 18,
      gstAmount: 0,
      grandTotal: 0,
    },
    terms: { ...(defaults.terms || {}) },
  }
}

let _roomId = 0
export function createRoom(name = 'New Room') {
  return { id: ++_roomId, roomName: name, items: [], subtotal: 0 }
}

let _itemId = 0
export function createItem(component = '', config) {
  const preset = config?.componentPresets?.[component] || {}
  const defaults = config?.defaults?.materials || {}
  return {
    id: ++_itemId,
    category: preset.category || (config?.categories || [])[0] || 'Storage',
    component,
    structure: preset.structure || (config?.structures || [])[0] || 'Box',
    surfaceFinish: (config?.finishes || [])[0] || 'Laminate',
    material: {
      core: defaults.core || 'BWP Ply',
      plywoodCompany: defaults.plywoodCompany || 'Saburi',
      hardware: defaults.hardware || 'Hettich',
    },
    dimensions: {
      length: 72,
      height: preset.height || 48,
    },
    unit: 'sqft',
    quantity: 1,
    rate: 0,
    amount: 0,
    calculationType: 'AREA',
    included: true,
    remarks: '',
  }
}

let _addonId = 0
export function createAddon() {
  return { id: ++_addonId, name: '', type: 'LUMPSUM', amount: 0, included: true }
}

/* ─── Calculation engine (pure) ────────────────────────────── */
export function calculateItem(item) {
  if (!item.included) return 0

  switch (item.calculationType) {
    case 'AREA': {
      const sft = (item.dimensions.length * item.dimensions.height) / 144
      return Math.round(sft * item.rate)
    }
    case 'LENGTH': {
      const rft = item.dimensions.length / 12
      return Math.round(rft * item.rate)
    }
    case 'UNIT':
      return Math.round(item.quantity * item.rate)
    case 'LUMPSUM':
      return Math.round(item.rate)
    default:
      return 0
  }
}

export function calculateRoom(room) {
  return room.items.reduce((sum, item) => sum + calculateItem(item), 0)
}

export function calculatePricing(quote) {
  const subtotal = quote.rooms.reduce((sum, room) => sum + calculateRoom(room), 0)
  const addonsTotal = quote.addons
    .filter((a) => a.included)
    .reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0)

  const afterDiscount = subtotal + addonsTotal - (parseFloat(quote.pricing.discount) || 0)
  const gstAmount = Math.round((afterDiscount * (quote.pricing.gstPercent || 18)) / 100)
  const grandTotal = afterDiscount + gstAmount

  return { subtotal, addonsTotal, gstAmount, grandTotal }
}

/* ─── Rate lookup (config-driven) ──────────────────────────── */
export function lookupRate(structure, finish, config) {
  const key = `${structure}_${finish}`
  return config?.rateCard?.[key] || 0
}

/* ─── Currency formatter ───────────────────────────────────── */
export function formatINR(n) {
  if (n == null || isNaN(n)) return '₹0'
  return '₹' + Number(n).toLocaleString('en-IN')
}
