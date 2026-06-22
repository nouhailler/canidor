import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { HEALTH } from '../data/datasets'

const CarnetContext = createContext(null)
export const useCarnet = () => useContext(CarnetContext)

const LS = 'canidor_carnet'
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

// Seed the editable carnet from the static dataset on first run, converting the
// prototype's tuple rows into objects with stable ids.
function seed() {
  return {
    vaccins: HEALTH.vaccins.map((v) => ({ id: uid(), name: v[0], status: v[1], detail: v[2] })),
    soins: [...HEALTH.vermifuges, ...HEALTH.traitements].map((v) => ({ id: uid(), name: v[0], detail: v[2] })),
    poids: HEALTH.poids.map((p) => ({ id: uid(), m: p[0], kg: p[1] })),
    rdv: HEALTH.rdv.map((r) => ({ id: uid(), date: r[0], label: r[1], who: r[2] })),
  }
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || 'null')
    if (raw && raw.vaccins && raw.soins && raw.poids && raw.rdv) return raw
  } catch { /* ignore */ }
  return seed()
}

export function CarnetProvider({ children }) {
  const [data, setData] = useState(load)

  const persist = useCallback((next) => {
    setData(next)
    try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
  }, [])

  const addItem = useCallback((section, item) => {
    setData((d) => {
      const next = { ...d, [section]: [...d[section], { id: uid(), ...item }] }
      try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const updateItem = useCallback((section, id, patch) => {
    setData((d) => {
      const next = { ...d, [section]: d[section].map((it) => (it.id === id ? { ...it, ...patch } : it)) }
      try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const removeItem = useCallback((section, id) => {
    setData((d) => {
      const next = { ...d, [section]: d[section].filter((it) => it.id !== id) }
      try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const resetCarnet = useCallback(() => persist(seed()), [persist])

  const value = useMemo(() => ({ ...data, addItem, updateItem, removeItem, resetCarnet }), [data, addItem, updateItem, removeItem, resetCarnet])
  return <CarnetContext.Provider value={value}>{children}</CarnetContext.Provider>
}
