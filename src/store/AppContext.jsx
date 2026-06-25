import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { FREE_MODELS } from '../data/models'
import * as OR from '../lib/openrouter'
import { buildMessages } from '../lib/prompts'
import { validateVisionKey, fetchVisionModels, visionComplete } from '../lib/visionProviders'

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
const LS_VPROVIDER = 'canidor_v_provider'
const LS_VKEY = 'canidor_v_key'
const LS_VMODEL = 'canidor_v_model'

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

  // ----- fournisseur « vision » (OpenAI / Anthropic / Google) -----
  const [vProvider, setVProvider] = useState('openai')
  const [vKey, setVKey] = useState('')
  const [vStatus, setVStatus] = useState('idle') // idle | checking | valid | invalid
  const [vMsg, setVMsg] = useState('')
  const [vModel, setVModel] = useState(null)
  const [vModels, setVModels] = useState([])
  const [vShow, setVShow] = useState(false)

  // Réhydrate la config vision et recharge la liste de modèles si une clé existe.
  useEffect(() => {
    try {
      const p = localStorage.getItem(LS_VPROVIDER)
      const k = localStorage.getItem(LS_VKEY)
      const m = localStorage.getItem(LS_VMODEL)
      if (p) setVProvider(p)
      if (m) setVModel(m)
      if (k) {
        setVKey(k)
        setVStatus('valid')
        setVMsg('Clé enregistrée sur cet appareil.')
        fetchVisionModels(p || 'openai', k).then((list) => { if (list && list.length) setVModels(list) }).catch(() => {})
      }
    } catch { /* ignore */ }
  }, [])

  const onVKeyChange = useCallback((v) => { setVKey(v); setVStatus('idle'); setVMsg('') }, [])
  const toggleVShow = useCallback(() => setVShow((s) => !s), [])

  // Changer de fournisseur : on repart d'une config vierge pour ce fournisseur.
  const selectVProvider = useCallback((id) => {
    setVProvider(id); setVStatus('idle'); setVMsg(''); setVModel(null); setVModels([])
    try { localStorage.setItem(LS_VPROVIDER, id); localStorage.removeItem(LS_VKEY); localStorage.removeItem(LS_VMODEL) } catch { /* ignore */ }
  }, [])

  const validateVKey = useCallback(async () => {
    setVStatus('checking'); setVMsg('')
    const res = await validateVisionKey(vProvider, vKey)
    setVStatus(res.status); setVMsg(res.msg); setVModels(res.models)
    if (res.status === 'valid') {
      try { localStorage.setItem(LS_VPROVIDER, vProvider); localStorage.setItem(LS_VKEY, (vKey || '').trim()) } catch { /* ignore */ }
      // Conserve le modèle choisi s'il existe encore, sinon on réinitialise.
      setVModel((cur) => (res.models.some((m) => m.id === cur) ? cur : null))
    }
  }, [vProvider, vKey])

  const selectVModel = useCallback((id) => {
    setVModel(id)
    try { localStorage.setItem(LS_VMODEL, id) } catch { /* ignore */ }
  }, [])

  const visionReady = vStatus === 'valid' && !!vModel
  const visionModelName = useMemo(
    () => (vModels.find((m) => m.id === vModel) || {}).name || vModel || 'aucun sélectionné',
    [vModels, vModel],
  )

  // Routeur d'analyse : une image part vers le fournisseur vision si configuré,
  // sinon vers OpenRouter ; le texte préfère OpenRouter, à défaut la vision.
  const runAnalysis = useCallback(({ instruction, image, images, signal }) => {
    const imgs = images && images.length ? images : image ? [image] : null
    if (imgs && visionReady) {
      return visionComplete({ provider: vProvider, key: vKey, model: vModel, dog, instruction, images: imgs, signal })
    }
    if (aiReady) {
      return OR.chatCompletion({ key: orKey, model: orModel, messages: buildMessages({ dog, instruction, image: imgs ? imgs[0] : undefined }), signal })
    }
    if (visionReady) {
      return visionComplete({ provider: vProvider, key: vKey, model: vModel, dog, instruction, images: imgs || undefined, signal })
    }
    return Promise.reject(new Error('Aucun modèle IA configuré.'))
  }, [visionReady, aiReady, vProvider, vKey, vModel, orKey, orModel, dog])

  const value = {
    // onboarding
    onboarded, completeOnboarding, replayOnboarding,
    // dog
    dog, updateDog,
    // openrouter
    orKey, orStatus, orMsg, orModel, orShow, models, aiReady, modelName,
    onKeyChange, toggleShow, selectModel, validateKey,
    // fournisseur vision
    vProvider, vKey, vStatus, vMsg, vModel, vModels, vShow, visionReady, visionModelName,
    onVKeyChange, toggleVShow, selectVProvider, validateVKey, selectVModel,
    // routeur d'analyse (image → vision si dispo, sinon OpenRouter)
    runAnalysis,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
