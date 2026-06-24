import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from './AppContext'
import { ACTIVITY_POOL } from '../data/datasets'
import { chatCompletion } from '../lib/openrouter'
import { systemPrompt } from '../lib/prompts'
import { getLocationWeather } from '../lib/weather'

const ActivityContext = createContext(null)
export const useActivity = () => useContext(ActivityContext)

const LS = 'canidor_activity'
const LS_HISTORY = 'canidor_activity_history'

// Météo de repli (objet, même forme que weather.js) quand la position est
// refusée/indisponible : on varie le libellé selon le jour pour rester vivant.
const FALLBACK_WEATHER = [
  { label: 'Ensoleillé', icon: '☀', temp: 22, cond: 'clear', outdoorOK: true, place: '' },
  { label: 'Nuageux', icon: '⛅', temp: 17, cond: 'clouds', outdoorOK: true, place: '' },
  { label: 'Couvert', icon: '☁', temp: 14, cond: 'clouds', outdoorOK: true, place: '' },
  { label: 'Éclaircies', icon: '🌤', temp: 19, cond: 'clear', outdoorOK: true, place: '' },
  { label: 'Pluie fine', icon: '🌧', temp: 12, cond: 'rain', outdoorOK: false, place: '' },
]

// Activités praticables en intérieur (utilisé quand la météo bloque les sorties).
const OUTDOOR_TAGS = new Set(['Physique', 'Promenade', 'Exploration'])
const isIndoor = (a) => !OUTDOOR_TAGS.has(a.tag)

const dayKey = () => new Date().toISOString().slice(0, 10)
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

// Tiny deterministic string hash so the daily pick is stable but varies per day/dog.
function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

// Recommandation déterministe tirée du pool, adaptée à la météo : si une vraie
// sortie est déconseillée (pluie/neige/froid…), on ne pioche que des activités
// d'intérieur. `salt` permet à « régénérer » de varier hors-ligne sans casser
// le défaut du jour.
function presetActivities(dog, weather, salt = 0) {
  const seed = hash(dayKey() + (dog?.nom || '') + ':' + salt)
  const pool = weather && weather.outdoorOK === false
    ? ACTIVITY_POOL.filter(isIndoor)
    : ACTIVITY_POOL
  const src = pool.length >= 5 ? pool : ACTIVITY_POOL
  const n = src.length
  const i = seed % n
  const today = src[i]
  const list = [1, 2, 3, 4].map((k) => src[(i + k) % n])
  return { today, list, source: 'preset' }
}

function loadStored() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || 'null')
    if (raw && raw.day === dayKey() && raw.today) return raw
  } catch { /* ignore */ }
  return null
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]') } catch { return [] }
}

function weatherLine(weather) {
  if (!weather) return ''
  const where = weather.place ? ` à ${weather.place}` : ''
  const adv = weather.outdoorOK
    ? 'Les sorties extérieures sont possibles.'
    : 'Évite les activités extérieures et privilégie l’intérieur.'
  return `Conditions météo aujourd'hui${where} : ${weather.label}, ${weather.temp}°C. ${adv} `
}

function buildInstruction(dog, weather) {
  return (
    `Propose un programme d'activités pour aujourd'hui adapté à ${dog.nom} (${dog.race}, ${dog.ageAnnees} ans, ${dog.poidsKg} kg). ` +
    weatherLine(weather) +
    'Donne UNE activité phare recommandée puis 4 idées alternatives variées (flair, physique, mental, calme). ' +
    'Réponds UNIQUEMENT par un objet JSON valide, sans texte ni balises autour, au format exact : ' +
    '{"today":{"titre":"...","duree":"20 min","tag":"Flair","icon":"👃","why":"1 à 2 phrases concrètes"},' +
    '"list":[{"titre":"...","duree":"15 min","tag":"Mental","icon":"🧠","why":"phrase courte"}]}. ' +
    'Le champ "icon" doit être un seul emoji. La liste "list" contient exactement 4 entrées.'
  )
}

// Pull the first {...} block out of the model output and validate the shape.
function parseActivities(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Réponse IA illisible.')
  const obj = JSON.parse(text.slice(start, end + 1))
  const ok = (a) => a && typeof a.titre === 'string' && typeof a.why === 'string'
  if (!ok(obj.today) || !Array.isArray(obj.list)) throw new Error('Format IA inattendu.')
  const norm = (a) => ({ titre: a.titre, duree: a.duree || '—', tag: a.tag || 'Activité', icon: a.icon || '🐾', why: a.why })
  return { today: norm(obj.today), list: obj.list.filter(ok).slice(0, 4).map(norm) }
}

export function ActivityProvider({ children }) {
  const { dog, aiReady, orKey, orModel } = useApp()
  const [weather, setWeather] = useState(() => FALLBACK_WEATHER[hash(dayKey()) % FALLBACK_WEATHER.length])
  const [state, setState] = useState(() => {
    const stored = loadStored()
    return stored || presetActivities(dog, null)
  })
  const [history, setHistory] = useState(loadHistory)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geoStatus, setGeoStatus] = useState('idle') // idle | locating | ok | denied
  const salt = useRef(0)
  const abort = useRef(null)

  const persist = useCallback((next) => {
    setState(next)
    try { localStorage.setItem(LS, JSON.stringify({ day: dayKey(), ...next })) } catch { /* ignore */ }
  }, [])

  // Récupère la vraie météo au montage. Si la position est refusée/indisponible,
  // on conserve la météo de repli (pas d'erreur bloquante). Quand on est encore
  // sur une reco hors-ligne, on la ré-adapte à la météo réelle obtenue.
  useEffect(() => {
    let alive = true
    setGeoStatus('locating')
    getLocationWeather()
      .then((w) => {
        if (!alive) return
        setWeather(w)
        setGeoStatus('ok')
        setState((prev) => {
          if (prev.source !== 'preset') return prev
          const next = presetActivities(dog, w)
          try { localStorage.setItem(LS, JSON.stringify({ day: dayKey(), ...next })) } catch { /* ignore */ }
          return next
        })
      })
      .catch(() => { if (alive) setGeoStatus('denied') })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const regenerate = useCallback(async () => {
    setError('')
    if (!aiReady) {
      salt.current += 1
      persist(presetActivities(dog, weather, salt.current))
      return
    }
    if (abort.current) abort.current.abort()
    const controller = new AbortController()
    abort.current = controller
    setLoading(true)
    try {
      const text = await chatCompletion({
        key: orKey,
        model: orModel,
        messages: [
          { role: 'system', content: systemPrompt(dog) },
          { role: 'user', content: buildInstruction(dog, weather) },
        ],
        signal: controller.signal,
        maxTokens: 600,
      })
      const parsed = parseActivities(text)
      persist({ ...parsed, source: 'ai' })
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message || 'Échec de la génération IA.')
        salt.current += 1
        persist(presetActivities(dog, weather, salt.current))
      }
    } finally {
      setLoading(false)
    }
  }, [aiReady, orKey, orModel, dog, weather, persist])

  // ----- historique des activités -----
  const persistHistory = useCallback((next) => {
    setHistory(next)
    try { localStorage.setItem(LS_HISTORY, JSON.stringify(next)) } catch { /* ignore */ }
  }, [])

  const saveToHistory = useCallback((act) => {
    const entry = {
      id: uid(),
      date: new Date().toISOString(),
      titre: act.titre, duree: act.duree, tag: act.tag, icon: act.icon, why: act.why,
    }
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 100)
      try { localStorage.setItem(LS_HISTORY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
    return entry
  }, [])

  const removeFromHistory = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id)
      try { localStorage.setItem(LS_HISTORY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const clearHistory = useCallback(() => persistHistory([]), [persistHistory])

  const value = useMemo(
    () => ({
      ...state, weather, geoStatus, loading, error, aiReady, regenerate,
      history, saveToHistory, removeFromHistory, clearHistory,
    }),
    [state, weather, geoStatus, loading, error, aiReady, regenerate, history, saveToHistory, removeFromHistory, clearHistory],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}
