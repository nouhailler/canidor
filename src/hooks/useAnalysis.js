import { useCallback, useRef, useState } from 'react'
import { useApp } from '../store/AppContext'
import { chatCompletion } from '../lib/openrouter'
import { buildMessages } from '../lib/prompts'

// Capture-IA stage machine shared by photo/video/audio screens.
// When a key+model are configured it performs a real OpenRouter call; otherwise
// it falls back to the prototype's 2s simulation so the demo UI still works.
export function useAnalysis() {
  const { aiReady, orKey, orModel, dog } = useApp()
  const [stage, setStage] = useState('idle') // idle | analyzing | result
  const [aiText, setAiText] = useState('')
  const [aiError, setAiError] = useState('')
  const timer = useRef(null)
  const abort = useRef(null)

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    if (abort.current) abort.current.abort()
    setStage('idle')
    setAiText('')
    setAiError('')
  }, [])

  // opts: { instruction, image }
  const start = useCallback((opts = {}) => {
    setAiText('')
    setAiError('')
    setStage('analyzing')

    if (!aiReady || !opts.instruction) {
      timer.current = setTimeout(() => setStage('result'), 2000)
      return
    }

    const controller = new AbortController()
    abort.current = controller
    const startedAt = Date.now()
    chatCompletion({
      key: orKey,
      model: orModel,
      messages: buildMessages({ dog, instruction: opts.instruction, image: opts.image }),
      signal: controller.signal,
    })
      .then((text) => setAiText(text))
      .catch((e) => { if (e.name !== 'AbortError') setAiError(e.message || 'Échec de l’analyse IA.') })
      .finally(() => {
        const wait = Math.max(0, 1200 - (Date.now() - startedAt))
        timer.current = setTimeout(() => setStage('result'), wait)
      })
  }, [aiReady, orKey, orModel, dog])

  return { stage, start, reset, aiText, aiError, aiReady }
}

// One-shot text generation for Rapport/Explainer panels (no scan overlay).
export function useAIText() {
  const { aiReady, orKey, orModel, dog } = useApp()
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const abort = useRef(null)

  const run = useCallback((instruction, image) => {
    if (!aiReady) return
    if (abort.current) abort.current.abort()
    const controller = new AbortController()
    abort.current = controller
    setLoading(true)
    setError('')
    setText('')
    chatCompletion({ key: orKey, model: orModel, messages: buildMessages({ dog, instruction, image }), signal: controller.signal })
      .then((t) => setText(t))
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message || 'Échec de l’analyse IA.') })
      .finally(() => setLoading(false))
  }, [aiReady, orKey, orModel, dog])

  const reset = useCallback(() => { setText(''); setError(''); setLoading(false) }, [])

  return { aiReady, loading, text, error, run, reset }
}
