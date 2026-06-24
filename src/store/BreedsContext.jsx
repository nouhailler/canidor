import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useApp } from './AppContext'
import { BREEDS as SEED } from '../data/datasets'
import { normalizeBreed, parseImportJSON, generateBreed, fetchDogApiBreeds } from '../lib/breeds'

const BreedsContext = createContext(null)
export const useBreeds = () => useContext(BreedsContext)

const LS = 'canidor_breeds_added'

// Static seed breeds, tagged as the immutable base of the catalogue.
const base = SEED.map((b, i) => normalizeBreed({ ...b, id: `base-${i}` }, 'base'))

function loadAdded() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || '[]')
    if (Array.isArray(raw)) return raw.map((b) => normalizeBreed(b, b.source || 'import'))
  } catch { /* ignore */ }
  return []
}

// Merge base + added, deduped by name (added overrides/updates a base entry in
// place; brand-new breeds are appended).
function merge(added) {
  const list = base.map((b) => ({ ...b }))
  const byName = new Map(list.map((b, i) => [b.nom.toLowerCase(), i]))
  for (const a of added) {
    const k = a.nom.toLowerCase()
    if (byName.has(k)) list[byName.get(k)] = a
    else { byName.set(k, list.length); list.push(a) }
  }
  return list
}

export function BreedsProvider({ children }) {
  const { aiReady, orKey, orModel } = useApp()
  const [added, setAdded] = useState(loadAdded)
  const [loading, setLoading] = useState('') // '' | 'ai' | 'dogapi'
  const [error, setError] = useState('')
  const abort = useRef(null)

  const persist = useCallback((next) => {
    setAdded(next)
    try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
  }, [])

  const breeds = useMemo(() => merge(added), [added])

  // Add or replace breeds (dedupe by name, newest wins).
  const addBreeds = useCallback((items) => {
    setAdded((prev) => {
      const byName = new Map(prev.map((b, i) => [b.nom.toLowerCase(), i]))
      const next = [...prev]
      for (const it of items) {
        const k = it.nom.toLowerCase()
        if (byName.has(k)) next[byName.get(k)] = it
        else { byName.set(k, next.length); next.push(it) }
      }
      try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  // Met à jour l'image d'une race (override par nom, persisté localement).
  // Fonctionne aussi pour les races de base : un override est créé sans les
  // rendre supprimables (la source d'origine est conservée).
  const setBreedImage = useCallback((breed, image) => {
    addBreeds([{ ...breed, image: image || '' }])
  }, [addBreeds])

  const removeBreed = useCallback((id) => {
    setAdded((prev) => {
      const next = prev.filter((b) => b.id !== id)
      try { localStorage.setItem(LS, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const resetCatalogue = useCallback(() => persist([]), [persist])

  // JSON import → { count, error }
  const importJSON = useCallback((text) => {
    setError('')
    const { breeds: parsed, error: e } = parseImportJSON(text)
    if (e) { setError(e); return { count: 0, error: e } }
    addBreeds(parsed)
    return { count: parsed.length, error: '' }
  }, [addBreeds])

  // AI generation of a single breed by name.
  const generateAI = useCallback(async (name) => {
    setError('')
    if (!aiReady) { setError('Connectez une clé OpenRouter dans Paramètres.'); return { ok: false } }
    if (abort.current) abort.current.abort()
    const controller = new AbortController()
    abort.current = controller
    setLoading('ai')
    try {
      const breed = await generateBreed({ name, key: orKey, model: orModel, signal: controller.signal })
      addBreeds([breed])
      return { ok: true, breed }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Échec de la génération IA.')
      return { ok: false }
    } finally {
      setLoading('')
    }
  }, [aiReady, orKey, orModel, addBreeds])

  // The Dog API import (real data + photos).
  const importDogApi = useCallback(async () => {
    setError('')
    if (abort.current) abort.current.abort()
    const controller = new AbortController()
    abort.current = controller
    setLoading('dogapi')
    try {
      const list = await fetchDogApiBreeds({ signal: controller.signal })
      addBreeds(list)
      return { count: list.length }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Échec de l’import The Dog API.')
      return { count: 0 }
    } finally {
      setLoading('')
    }
  }, [addBreeds])

  const value = useMemo(
    () => ({ breeds, loading, error, setError, addBreeds, setBreedImage, removeBreed, resetCatalogue, importJSON, generateAI, importDogApi, addedCount: added.length }),
    [breeds, loading, error, addBreeds, setBreedImage, removeBreed, resetCatalogue, importJSON, generateAI, importDogApi, added.length],
  )
  return <BreedsContext.Provider value={value}>{children}</BreedsContext.Provider>
}
