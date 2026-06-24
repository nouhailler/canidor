import { useCallback, useRef, useState } from 'react'
import { useApp } from '../store/AppContext'

// Capture-IA stage machine shared by photo/video/audio screens.
// Quand un modèle est configuré, l'analyse part vers le fournisseur vision
// (OpenAI/Anthropic/Google) si une image est fournie, sinon vers OpenRouter ;
// à défaut de clé, on retombe sur la simulation 2s du prototype.
export function useAnalysis() {
  const { aiReady, visionReady, runAnalysis } = useApp()
  const ready = aiReady || visionReady
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

    if (!ready || !opts.instruction) {
      timer.current = setTimeout(() => setStage('result'), 2000)
      return
    }

    const controller = new AbortController()
    abort.current = controller
    const startedAt = Date.now()
    runAnalysis({ instruction: opts.instruction, image: opts.image, signal: controller.signal })
      .then((text) => setAiText(text))
      .catch((e) => { if (e.name !== 'AbortError') setAiError(e.message || 'Échec de l’analyse IA.') })
      .finally(() => {
        const wait = Math.max(0, 1200 - (Date.now() - startedAt))
        timer.current = setTimeout(() => setStage('result'), wait)
      })
  }, [ready, runAnalysis])

  return { stage, start, reset, aiText, aiError, aiReady: ready }
}

// One-shot text generation for Rapport/Explainer panels (no scan overlay).
// Route via runAnalysis : image → fournisseur vision si configuré.
export function useAIText() {
  const { aiReady, visionReady, runAnalysis } = useApp()
  const ready = aiReady || visionReady
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const abort = useRef(null)

  const run = useCallback((instruction, image) => {
    if (!ready) return
    if (abort.current) abort.current.abort()
    const controller = new AbortController()
    abort.current = controller
    setLoading(true)
    setError('')
    setText('')
    runAnalysis({ instruction, image, signal: controller.signal })
      .then((t) => setText(t))
      .catch((e) => { if (e.name !== 'AbortError') setError(e.message || 'Échec de l’analyse IA.') })
      .finally(() => setLoading(false))
  }, [ready, runAnalysis])

  const reset = useCallback(() => { setText(''); setError(''); setLoading(false) }, [])

  return { aiReady: ready, loading, text, error, run, reset }
}
