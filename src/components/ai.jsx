import { useChrome } from '../store/ChromeContext'
import { useAIText } from '../hooks/useAnalysis'
import { C } from '../theme'

// Minimal markdown-ish renderer (paragraphs, bullets, **bold**).
function RichText({ text }) {
  const lines = text.split('\n').map((l) => l.trimEnd())
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 2 }} />
        const bullet = /^\s*([-*•])\s+/.test(line)
        const clean = line.replace(/^\s*([-*•])\s+/, '').replace(/^\s*#+\s*/, '')
        const heading = /^\s*#+\s/.test(line)
        return (
          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13.5, lineHeight: 1.5, color: C.body, fontWeight: heading ? 700 : 400 }}>
            {bullet && <span style={{ color: C.accent, flex: 'none' }}>•</span>}
            <span>{renderBold(clean)}</span>
          </div>
        )
      })}
    </div>
  )
}

function renderBold(s) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
  )
}

export function ConnectKeyNote({ compact }) {
  const { goScreen } = useChrome()
  return (
    <div
      onClick={() => goScreen('settings')}
      style={{ background: C.tile, borderRadius: 14, padding: compact ? '12px 14px' : '15px 16px', fontSize: 12.5, color: C.body, lineHeight: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
    >
      <span style={{ fontSize: 16, flex: 'none' }}>🔌</span>
      <span>
        Connectez une clé OpenRouter dans <strong style={{ color: C.accent }}>Paramètres</strong> pour activer l'analyse IA en temps réel.
      </span>
    </div>
  )
}

// Result card shown after a Capture-IA scan when AI is wired.
export function AIResultCard({ text, error }) {
  if (!text && !error) return null
  return (
    <div style={{ ...cardBase }}>
      <Badge />
      {error ? (
        <div style={{ marginTop: 10, fontSize: 13, color: C.danger, lineHeight: 1.5 }}>⚠ {error}</div>
      ) : (
        <div style={{ marginTop: 10 }}><RichText text={text} /></div>
      )}
    </div>
  )
}

const cardBase = { background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16 }

function Badge() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: C.accent, fontWeight: 700 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent }} />
      Analyse IA
    </div>
  )
}

// Self-contained panel for Rapport/Explainer screens.
// buildInstruction: () => string ; image optional.
export function AIPanel({ buildInstruction, image, label = "Analyser avec l'IA", regenLabel = 'Régénérer' }) {
  const { aiReady, loading, text, error, run } = useAIText()
  if (!aiReady) return <ConnectKeyNote />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(text || error) && <AIResultCard text={text} error={error} />}
      <button
        className="reset"
        disabled={loading}
        onClick={() => run(buildInstruction(), image)}
        style={{ width: '100%', border: `1px solid ${C.grayB}`, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 }}
      >
        {loading ? (
          <>
            <span style={{ width: 16, height: 16, border: '2px solid #C9B89B', borderTopColor: C.espresso, borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' }} />
            Analyse en cours…
          </>
        ) : text || error ? `↻ ${regenLabel}` : `✨ ${label}`}
      </button>
    </div>
  )
}
