import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { FREE_MODELS } from '../data/models'
import * as OR from '../lib/openrouter'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const DEFAULT_DOG = {
  nom: 'Stanley',
  race: 'Cocker Spaniel Anglais',
  sexe: 'Mâle',
  ageAnnees: 4,
  poidsKg: 17,
  forme: 76,
  lof: true,
}

const LS_DOG = 'canidor_dog'
const LS_ONBOARDED = 'canidor_onboarded'

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  // ----- onboarding -----
  const [onboarded, setOnboarded] = useState(() => loadJSON(LS_ONBOARDED, false) === true)
  const completeOnboarding = useCallback(() => {
    setOnboarded(true)
    try { localStorage.setItem(LS_ONBOARDED, 'true') } catch { /* ignore */ }
  }, [])
  const replayOnboarding = useCallback(() => {
    setOnboarded(false)
    try { localStorage.setItem(LS_ONBOARDED, 'false') } catch { /* ignore */ }
  }, [])

  // ----- editable dog profile -----
  const [dog, setDog] = useState(() => ({ ...DEFAULT_DOG, ...loadJSON(LS_DOG, {}) }))
  const updateDog = useCallback((patch) => {
    setDog((d) => {
      const next = { ...d, ...patch }
      try { localStorage.setItem(LS_DOG, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  // ----- OpenRouter settings -----
  const [orKey, setOrKey] = useState('')
  const [orStatus, setOrStatus] = useState('idle') // idle | checking | valid | invalid
  const [orMsg, setOrMsg] = useState('')
  const [orModel, setOrModel] = useState(null)
  const [orShow, setOrShow] = useState(false)
  const [models, setModels] = useState(FREE_MODELS)

  // Load persisted key/model once at mount (rehydrate exactly like the prototype).
  useEffect(() => {
    try {
      const k = localStorage.getItem(OR.LS_KEY)
      const m = localStorage.getItem(OR.LS_MODEL)
      if (k) {
        setOrKey(k)
        setOrStatus('valid')
        setOrMsg('Clé enregistrée sur cet appareil.')
        setOrModel(m || null)
      } else if (m) {
        setOrModel(m)
      }
    } catch { /* ignore */ }
  }, [])

  // Dynamically refresh the free-model list when a valid key is present.
  useEffect(() => {
    if (orStatus !== 'valid') return
    let alive = true
    OR.fetchFreeModels(orKey).then((list) => {
      if (alive && list && list.length) {
        // Keep curated names where ids overlap, append any new ones.
        const byId = new Map(FREE_MODELS.map((m) => [m.id, m]))
        const merged = list.map((m) => byId.get(m.id) || m)
        setModels(merged)
      }
    })
    return () => { alive = false }
  }, [orStatus, orKey])

  const onKeyChange = useCallback((v) => {
    setOrKey(v)
    setOrStatus('idle')
    setOrMsg('')
  }, [])

  const toggleShow = useCallback(() => setOrShow((s) => !s), [])

  const selectModel = useCallback((id) => {
    try { localStorage.setItem(OR.LS_MODEL, id) } catch { /* ignore */ }
    setOrModel(id)
  }, [])

  const validateKey = useCallback(async () => {
    setOrStatus('checking')
    setOrMsg('')
    const res = await OR.validateKey(orKey)
    if (res.status === 'valid') {
      try { localStorage.setItem(OR.LS_KEY, (orKey || '').trim()) } catch { /* ignore */ }
    }
    setOrStatus(res.status)
    setOrMsg(res.msg)
  }, [orKey])

  const aiReady = orStatus === 'valid' && !!orModel
  const modelName = useMemo(
    () => (models.find((m) => m.id === orModel) || {}).name || 'aucun sélectionné',
    [models, orModel],
  )

  const value = {
    // onboarding
    onboarded, completeOnboarding, replayOnboarding,
    // dog
    dog, updateDog,
    // openrouter
    orKey, orStatus, orMsg, orModel, orShow, models, aiReady, modelName,
    onKeyChange, toggleShow, selectModel, validateKey,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
