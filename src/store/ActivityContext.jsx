import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useApp } from './AppContext'
import { ACTIVITY_POOL } from '../data/datasets'
import { chatCompletion } from '../lib/openrouter'
import { systemPrompt } from '../lib/prompts'

const ActivityContext = createContext(null)
export const useActivity = () => useContext(ActivityContext)

const LS = 'canidor_activity'
const WEATHERS = ['Ensoleillé · 22°', 'Nuageux · 17°', 'Couvert · 14°', 'Éclaircies · 19°', 'Pluie fine · 12°']

const dayKey = () => new Date().toISOString().slice(0, 10)

// Tiny deterministic string hash so the daily pick is stable but varies per day/dog.
function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

// Deterministic recommendation drawn from the pool. `salt` lets "regenerate"
// produce a different set offline without breaking the same-day default.
function presetActivities(dog, salt = 0) {
  const seed = hash(dayKey() + (dog?.nom || '') + ':' + salt)
  const n = ACTIVITY_POOL.length
  const i = seed % n
  const today = ACTIVITY_POOL[i]
  const list = [1, 2, 3, 4].map((k) => ACTIVITY_POOL[(i + k) % n])
  return { today, list, weather: WEATHERS[seed % WEATHERS.length], source: 'preset' }
}

function loadStored() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || 'null')
    if (raw && raw.day === dayKey() && raw.today) return raw
  } catch { /* ignore */ }
  return null
}

function buildInstruction(dog) {
  return (
    `Propose un programme d'activités pour aujourd'hui adapté à ${dog.nom} (${dog.race}, ${dog.ageAnnees} ans, ${dog.poidsKg} kg). ` +
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
  const [state, setState] = useState(() => loadStored() || presetActivities(dog))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const salt = useRef(0)
  const abort = useRef(null)

  const persist = useCallback((next) => {
    setState(next)
    try { localStorage.setItem(LS, JSON.stringify({ day: dayKey(), ...next })) } catch { /* ignore */ }
  }, [])

  const regenerate = useCallback(async () => {
    setError('')
    if (!aiReady) {
      salt.current += 1
      persist(presetActivities(dog, salt.current))
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
          { role: 'user', content: buildInstruction(dog) },
        ],
        signal: controller.signal,
        maxTokens: 600,
      })
      const parsed = parseActivities(text)
      persist({ ...parsed, weather: state.weather, source: 'ai' })
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message || 'Échec de la génération IA.')
        salt.current += 1
        persist(presetActivities(dog, salt.current))
      }
    } finally {
      setLoading(false)
    }
  }, [aiReady, orKey, orModel, dog, state.weather, persist])

  const value = useMemo(
    () => ({ ...state, loading, error, aiReady, regenerate }),
    [state, loading, error, aiReady, regenerate],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}
