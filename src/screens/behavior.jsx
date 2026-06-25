import { useEffect, useState } from 'react'
import { C, serif, mono } from '../theme'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, Chip, BulletLine, UploadBox, Bar, ScanBox } from '../components/ui'
import CaptureScreen from '../components/CaptureScreen'
import { AIPanel, ConnectKeyNote, AIResultCard } from '../components/ai'
import { useAnalysis } from '../hooks/useAnalysis'
import { useApp } from '../store/AppContext'
import { useChrome } from '../store/ChromeContext'
import { chatCompletion } from '../lib/openrouter'
import { buildMessages } from '../lib/prompts'
import { BEHAVIOR, NF } from '../data/datasets'
import { INSTRUCTIONS } from '../lib/prompts'
import { loadCase, saveCase, parseCase } from '../lib/behaviorCache'
import { PSY_QUESTIONS, computeProfile, dimQualifier, profileSummary } from '../lib/psyProfile'
import { pickVideoFile, extractFrames } from '../lib/videoFrames'

const EXTRA_CASES = ['Léchage compulsif', 'Vol de nourriture', 'Réveils nocturnes', 'Pica (ingestion d’objets)']

/* ---------------- Assistant comportement (Explainer) ---------------- */
export function Behavior() {
  const [i, setI] = useState(0)
  const [extra, setExtra] = useState(null) // cas dynamique sélectionné (ou null)
  const b = BEHAVIOR[i]
  return (
    <Screen>
      <Intro>Choisissez un cas (causes, exercices, erreurs à éviter — sans IA) ou décrivez le vôtre. Approfondissez ensuite avec l'IA si besoin.</Intro>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {BEHAVIOR.map((c, idx) => (
          <Chip key={c.case} active={idx === i && !extra} onClick={() => { setI(idx); setExtra(null) }} style={{ fontSize: 12.5, padding: '7px 12px' }}>{c.case}</Chip>
        ))}
      </div>

      {!extra && <CaseCard title={b.case} ctx={b.ctx} causes={b.causes} exos={b.exos} avoid={b.avoid} />}

      <SectionLabel style={{ marginTop: 16, marginBottom: 8 }}>Autres cas (générés par l'IA)</SectionLabel>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {EXTRA_CASES.map((e) => (
          <Chip key={e} active={extra === e} dashed={extra !== e} style={{ fontSize: 12, padding: '7px 12px' }}
            onClick={() => setExtra((prev) => (prev === e ? null : e))}>{e}</Chip>
        ))}
      </div>

      {extra
        ? <GeneratedCase name={extra} />
        : (
          <div style={{ marginTop: 18 }}>
            <AIPanel buildInstruction={() => INSTRUCTIONS.behavior(b.case)} label="Approfondir avec l'IA" />
          </div>
        )}
      <InputBar placeholder="Décrire un autre problème…" />
    </Screen>
  )
}

// Carte d'analyse partagée par les cas prédéfinis et les cas générés par l'IA.
function CaseCard({ title, ctx, causes, exos, avoid }) {
  return (
    <div style={{ marginTop: 18, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.label }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.successDk }} />Analyse IA{ctx ? ` · ${ctx}` : ''}
      </div>
      <div style={{ fontFamily: serif, fontSize: 24, marginTop: 8 }}>« {title} »</div>
      <ExplainerBlock label="Causes probables" items={causes} variant="cause" />
      <ExplainerBlock label="Exercices conseillés" items={exos} variant="do" />
      <ExplainerBlock label="Erreurs à éviter" items={avoid} variant="avoid" />
    </div>
  )
}

// Cas dynamique : généré par l'IA puis mis en cache localement. Une fois
// sauvegardé, il est réaffiché instantanément et propose une régénération.
function GeneratedCase({ name }) {
  const { aiReady, orKey, orModel, dog } = useApp()
  const [data, setData] = useState(() => loadCase(name))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Recharge depuis le cache quand on change de cas.
  useEffect(() => { setData(loadCase(name)); setError(''); setLoading(false) }, [name])

  const generate = async () => {
    if (!aiReady || loading) return
    setLoading(true)
    setError('')
    try {
      const text = await chatCompletion({
        key: orKey,
        model: orModel,
        messages: buildMessages({ dog, instruction: INSTRUCTIONS.behaviorJSON(name) }),
      })
      const parsed = parseCase(text)
      saveCase(name, parsed)
      setData(parsed)
    } catch (e) {
      setError(e.message || 'Échec de la génération.')
    } finally {
      setLoading(false)
    }
  }

  if (!aiReady) return <div style={{ marginTop: 18 }}><ConnectKeyNote /></div>

  return (
    <div style={{ marginTop: 18 }}>
      {data && <CaseCard title={name} ctx={data.ctx} causes={data.causes} exos={data.exos} avoid={data.avoid} />}
      {error && <div style={{ marginTop: 12, fontSize: 13, color: C.danger, lineHeight: 1.5 }}>⚠ {error}</div>}
      {data && (
        <div style={{ marginTop: 10, fontSize: 11.5, color: C.label, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: C.successDk }}>✓</span>Sauvegardé localement — pas de nouvel appel à la sélection.
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <button
          className="reset"
          disabled={loading}
          onClick={generate}
          style={{ width: '100%', border: `1px solid ${C.grayB}`, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: '2px solid #C9B89B', borderTopColor: C.espresso, borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' }} />
              Analyse en cours…
            </>
          ) : data ? '↻ Régénérer' : `✨ Générer l'analyse de « ${name} »`}
        </button>
      </div>
    </div>
  )
}

function ExplainerBlock({ label, items, variant }) {
  return (
    <>
      <div style={{ marginTop: 16, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {items.map((x) => <BulletLine key={x} variant={variant}>{x}</BulletLine>)}
      </div>
    </>
  )
}

export function InputBar({ placeholder }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 999, padding: '7px 7px 7px 18px' }}>
      <div style={{ flex: 1, fontSize: 14, color: C.grayC }}>{placeholder}</div>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.espresso, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>↑</div>
    </div>
  )
}

/* ---------------- Profil psychologique (Questionnaire) ---------------- */
export function Psy() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([]) // index d'option par question
  const [done, setDone] = useState(false)

  const restart = () => { setStep(0); setAnswers([]); setDone(false) }

  if (done) {
    const profile = computeProfile(answers)
    return (
      <Screen>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>Profil dominant</div>
          <div style={{ fontFamily: serif, fontSize: 32, lineHeight: 1.1, marginTop: 10 }}>{profile.archetype}</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: C.body, marginTop: 12 }}>{profile.blurb}</div>
        </div>

        <SectionLabel style={{ marginTop: 24, marginBottom: 14 }}>Profil de personnalité</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {profile.dims.map((d) => (
            <div key={d.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{d.label}</span>
                <span style={{ color: C.label }}>{dimQualifier(d.key, d.pct)} · {d.pct}%</span>
              </div>
              <Bar value={d.pct} height={8} />
            </div>
          ))}
        </div>

        {!!profile.strengths.length && (<>
          <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Points forts</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profile.strengths.map((s) => (
              <div key={s} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
                <span style={{ color: C.successDk, flex: 'none' }}>✓</span>{s}
              </div>
            ))}
          </div>
        </>)}

        {!!profile.watch.length && (<>
          <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Points de vigilance</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profile.watch.map((w) => (
              <div key={w} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
                <span style={{ color: C.warn, flex: 'none' }}>!</span>{w}
              </div>
            ))}
          </div>
        </>)}

        <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Recommandations</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profile.recos.map((r) => (
            <div key={r} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
              <span style={{ color: C.espresso, flex: 'none' }}>›</span>{r}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <AIPanel buildInstruction={() => INSTRUCTIONS.psy(profileSummary(profile))} label="Analyse approfondie avec l'IA" />
        </div>
        <div style={{ marginTop: 14 }}><OutlineButton onClick={restart}>Refaire le test</OutlineButton></div>
      </Screen>
    )
  }

  const q = PSY_QUESTIONS[step]
  const prog = Math.round((step / PSY_QUESTIONS.length) * 100)
  const choose = (optIdx) => {
    const next = [...answers]
    next[step] = optIdx
    setAnswers(next)
    if (step >= PSY_QUESTIONS.length - 1) setDone(true)
    else setStep(step + 1)
  }
  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ fontSize: 12, color: C.label, fontWeight: 600 }}>{`Question ${step + 1} / ${PSY_QUESTIONS.length}`}</div>
        {step > 0 && <button className="reset" onClick={() => setStep(step - 1)} style={{ fontSize: 12.5, color: C.sub, cursor: 'pointer' }}>‹ Précédent</button>}
      </div>
      <div style={{ height: 5, background: C.track, borderRadius: 3, overflow: 'hidden', marginTop: 10 }}>
        <div style={{ height: '100%', background: C.espresso, borderRadius: 3, transition: 'width .3s', width: `${prog}%` }} />
      </div>
      <div style={{ fontFamily: serif, fontSize: 26, lineHeight: 1.25, marginTop: 28 }}>{q.q}</div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {q.opts.map((o, idx) => (
          <button key={o.label} className="reset hoverable" onClick={() => choose(idx)} style={{ textAlign: 'left', background: answers[step] === idx ? C.tile : '#fff', border: `1px solid ${answers[step] === idx ? C.accent : C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 18, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>{o.label}</button>
        ))}
      </div>
    </Screen>
  )
}

/* ---------------- Traducteur canin (vision IA · photo ou frames vidéo) ---------------- */
function parseTranslate(text) {
  const s = text.indexOf('{')
  const e = text.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('Réponse IA illisible.')
  const o = JSON.parse(text.slice(s, e + 1))
  const signals = Array.isArray(o.signals)
    ? o.signals.map((x) => ({ zone: String(x.zone || '').trim(), obs: String(x.obs || '').trim() })).filter((x) => x.zone || x.obs).slice(0, 6)
    : []
  return {
    emotion: String(o.emotion || '—').trim(),
    emoji: String(o.emoji || '🐾').trim(),
    confidence: Math.max(0, Math.min(100, Math.round(Number(o.confidence) || 0))),
    signals,
    advice: String(o.advice || '').trim(),
  }
}

export function Translate() {
  const { visionReady, runAnalysis } = useApp()
  const { goScreen } = useChrome()
  const [media, setMedia] = useState(null) // { kind:'photo'|'video', preview, images:[], frames }
  const [stage, setStage] = useState('idle') // idle | extracting | analyzing | result
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const setPhoto = (dataUrl) => { setMedia({ kind: 'photo', preview: dataUrl, images: [dataUrl] }); setError(''); setResult(null) }
  const pickVideo = () => pickVideoFile(async (file) => {
    setError(''); setResult(null); setStage('extracting')
    try {
      const frames = await extractFrames(file, 3)
      setMedia({ kind: 'video', preview: frames[0], images: frames, frames: frames.length })
    } catch (e) { setError(e.message || 'Extraction des images impossible.') }
    finally { setStage('idle') }
  }, setError)

  const analyze = async () => {
    if (!media) return
    setStage('analyzing'); setError(''); setResult(null)
    try {
      const text = await runAnalysis({ instruction: INSTRUCTIONS.translateJSON, images: media.images })
      setResult(parseTranslate(text)); setStage('result')
    } catch (e) {
      setError(e.message || 'Échec de l’analyse.'); setStage('idle')
    }
  }

  const reset = () => { setMedia(null); setResult(null); setError(''); setStage('idle') }

  if (stage === 'analyzing') {
    return <Screen><div style={{ marginTop: 18 }}><ScanBox label="Lecture du langage corporel…" height={300} scanDur="1.7s" /></div></Screen>
  }

  if (stage === 'result' && result) {
    return (
      <Screen style={{ animation: 'rise .4s ease' }}>
        <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Émotion dominante</div>
          <div style={{ fontSize: 40, marginTop: 10 }}>{result.emoji}</div>
          <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.1, marginTop: 8 }}>{result.emotion}</div>
          <div style={{ fontSize: 13, color: C.label, marginTop: 8 }}>Confiance {result.confidence}%{media?.kind === 'video' ? ` · ${media.frames} images analysées` : ''}</div>
        </div>
        {!!result.signals.length && (<>
          <SectionLabel style={{ marginTop: 18, marginBottom: 12 }}>Signaux observés</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.signals.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, flex: 'none' }}>{s.zone || '—'}</span>
                <span style={{ fontSize: 13, color: C.sub, textAlign: 'right' }}>{s.obs}</span>
              </div>
            ))}
          </div>
        </>)}
        {result.advice && <TipNoteLine>{result.advice}</TipNoteLine>}
        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <OutlineButton onClick={() => setStage('idle')} style={{ flex: 1 }}>Réanalyser</OutlineButton>
          <OutlineButton onClick={reset} style={{ flex: 1 }}>Nouveau média</OutlineButton>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <Intro>Importez une photo, ou une courte vidéo : l'IA en extrait quelques images et interprète la posture, la queue, les oreilles et l'expression.</Intro>

      {!visionReady && (
        <div onClick={() => goScreen('settings')} style={{ marginTop: 14, background: C.tile, borderRadius: 14, padding: '13px 15px', fontSize: 12.5, color: C.body, lineHeight: 1.5, cursor: 'pointer', display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 16, flex: 'none' }}>👁️</span>
          <span>L'interprétation de posture nécessite un <strong style={{ color: C.accent }}>modèle d'analyse d'images</strong> (OpenAI, Anthropic ou Google). Configurez-le dans <strong style={{ color: C.accent }}>Paramètres</strong>.</span>
        </div>
      )}

      <div style={{ marginTop: 16 }}><UploadBox icon="🐕" caption="photo du chien" height={260} image={media?.preview} onPick={setPhoto} /></div>
      <div style={{ marginTop: 12 }}>
        <OutlineButton onClick={pickVideo}>{stage === 'extracting' ? 'Extraction des images…' : '🎥 Importer une courte vidéo'}</OutlineButton>
      </div>
      {media?.kind === 'video' && <div style={{ marginTop: 10, fontSize: 12, color: C.label }}>{media.frames} images extraites de la vidéo, prêtes à analyser.</div>}
      {error && <div style={{ marginTop: 12, fontSize: 12.5, color: C.danger, lineHeight: 1.5 }}>⚠ {error}</div>}

      {media && visionReady && (
        <div style={{ marginTop: 16 }}><PrimaryButton onClick={analyze}>Interpréter le langage corporel</PrimaryButton></div>
      )}
    </Screen>
  )
}

// Petit encart conseil (réutilise le style des notes).
function TipNoteLine({ children }) {
  return (
    <div style={{ marginTop: 16, background: C.tile, borderRadius: 14, padding: '13px 15px', fontSize: 13, color: C.body, lineHeight: 1.5, display: 'flex', gap: 8 }}>
      <span style={{ flex: 'none' }}>💡</span><span>{children}</span>
    </div>
  )
}

/* ---------------- Langage corporel (Capture IA) ---------------- */
export function Bodylang() {
  const bl = NF.bodylang
  return (
    <CaptureScreen
      analyzingLabel="Lecture des signaux…"
      scanDur="1.5s"
      scanHeight={240}
      buildInstruction={() => INSTRUCTIONS.bodylang('')}
      idle={({ start, image, pickImage }) => (
        <>
          <Intro>Importez une photo, ou décrivez la scène. L'IA décode oreilles, queue, regard et posture.</Intro>
          <div style={{ marginTop: 16 }}><UploadBox icon="📷" caption="photo du chien" height={200} image={image} onPick={pickImage} /></div>
          <div style={{ marginTop: 16 }}><PrimaryButton onClick={start}>Décoder le langage</PrimaryButton></div>
          <div style={{ marginTop: 16, fontSize: 12, color: C.label }}>Émotions détectables : {bl.detect.map((d) => <span key={d} style={{ color: C.body, fontWeight: 600 }}>{d} · </span>)}</div>
        </>
      )}
      result={({ reset }) => (
        <>
          <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 36 }}>{bl.emoji}</div>
            <div style={{ fontFamily: serif, fontSize: 28, marginTop: 6 }}>{bl.emotion}</div>
            <div style={{ fontSize: 12, color: C.label, marginTop: 6 }}>Confiance {bl.conf}</div>
          </div>
          <SectionLabel style={{ marginTop: 18, marginBottom: 12 }}>Lecture détaillée</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bl.parts.map((p) => (
              <div key={p[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p[0]}</div>
                <div style={{ fontSize: 13, color: C.sub, marginTop: 3, lineHeight: 1.45 }}>{p[1]}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}><OutlineButton onClick={reset}>Nouvelle analyse</OutlineButton></div>
        </>
      )}
    />
  )
}

/* ---------------- Pourquoi mon chien ? (Explainer) ---------------- */
export function Whydog() {
  const [i, setI] = useState(0)
  const cases = NF.why.cases
  const c = cases[i]
  return (
    <Screen>
      <Intro>Choisissez une question fréquente — ou décrivez la vôtre.</Intro>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {cases.map((x, idx) => <Chip key={x.q} active={idx === i} onClick={() => setI(idx)} style={{ fontSize: 12.5, padding: '9px 13px' }}>{x.q}</Chip>)}
      </div>
      <div style={{ marginTop: 18, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 18 }}>
        <div style={{ fontFamily: serif, fontSize: 23, lineHeight: 1.2 }}>« {c.q} »</div>
        <div style={{ marginTop: 16, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 6 }}>Origine comportementale</div>
        <div style={{ fontSize: 14, color: C.body, lineHeight: 1.55 }}>{c.origin}</div>
        <div style={{ marginTop: 16, background: C.successBg, borderRadius: 12, padding: 13 }}>
          <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.successDk, fontWeight: 700 }}>Fréquence</div>
          <div style={{ fontSize: 13, color: C.successDk2, marginTop: 4, lineHeight: 1.4 }}>{c.freq}</div>
        </div>
        <div style={{ marginTop: 10, background: C.dangerBg, borderRadius: 12, padding: 13 }}>
          <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.danger, fontWeight: 700 }}>Signe d'alerte</div>
          <div style={{ fontSize: 13, color: C.danger, marginTop: 4, lineHeight: 1.4 }}>{c.alert}</div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}><AIPanel buildInstruction={() => INSTRUCTIONS.whydog(c.q)} label="Demander à l'IA" /></div>
      <InputBar placeholder="Décrire un autre comportement…" />
    </Screen>
  )
}

/* ---------------- Anti-aboiement (Explainer) ---------------- */
export function Barkprevent() {
  const bp = NF.barkprevent
  const [ti, setTi] = useState(0)
  return (
    <Screen>
      <Intro>Identifiez le déclencheur, puis suivez la méthode pas à pas.</Intro>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {bp.triggers.map((t, idx) => <Chip key={t} active={idx === ti} onClick={() => setTi(idx)}>{t}</Chip>)}
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Méthode</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bp.steps.map((s, idx) => (
          <div key={s[0]} style={{ display: 'flex', gap: 13, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: C.espresso, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flex: 'none' }}>{idx + 1}</div>
            <div><div style={{ fontSize: 14.5, fontWeight: 600 }}>{s[0]}</div><div style={{ fontSize: 13, color: C.sub, lineHeight: 1.45, marginTop: 2 }}>{s[1]}</div></div>
          </div>
        ))}
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>À éviter</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bp.avoid.map((a) => <BulletLine key={a} variant="avoid" boxed>{a}</BulletLine>)}
      </div>
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.barkprevent(bp.triggers[ti])} label="Plan personnalisé IA" /></div>
    </Screen>
  )
}

/* ---------------- Reconnaissance d'aboiement (Capture IA · audio) ---------------- */
export function Barkrecog() {
  const bark = NF.bark
  const { stage, start, reset, aiText, aiError, aiReady } = useAnalysis()

  if (stage === 'analyzing') {
    return (
      <Screen>
        <div style={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 70 }}>
            {[[30, '1s'], [70, '.8s'], [100, '.6s'], [55, '.9s'], [85, '.7s'], [40, '1.1s']].map(([h, d], k) => (
              <div key={k} style={{ width: 6, background: C.espresso, borderRadius: 3, height: `${h}%`, animation: `pulsered ${d} infinite` }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.sub }}>Écoute en cours…</div>
        </div>
      </Screen>
    )
  }

  if (stage === 'result') {
    return (
      <Screen>
        <div style={{ animation: 'rise .4s ease' }}>
          <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36 }}>{bark.emoji}</div>
            <div style={{ fontFamily: serif, fontSize: 28, marginTop: 6 }}>{bark.result}</div>
            <div style={{ fontSize: 12, color: C.label, marginTop: 6 }}>Confiance {bark.conf}</div>
          </div>
          <div style={{ marginTop: 16, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, fontSize: 13.5, color: C.body, lineHeight: 1.55 }}>{bark.advice}</div>
          {aiReady ? ((aiText || aiError) && <div style={{ marginTop: 14 }}><AIResultCard text={aiText} error={aiError} /></div>) : <div style={{ marginTop: 14 }}><ConnectKeyNote compact /></div>}
          <div style={{ marginTop: 14 }}><OutlineButton onClick={reset}>Réécouter</OutlineButton></div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <Intro>Approchez le micro de votre chien : l'IA tente de classer le type d'aboiement.</Intro>
      <div onClick={() => start({ instruction: INSTRUCTIONS.barkrecog })} style={{ marginTop: 24, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, cursor: 'pointer' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: C.espresso, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>🎙</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.espresso }}>Toucher pour écouter</div>
      </div>
      <SectionLabel style={{ marginTop: 8, marginBottom: 10 }}>Types reconnus</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {bark.types.map((t) => (
          <div key={t[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t[0]}</div>
            <div style={{ fontSize: 11.5, color: C.label, marginTop: 2 }}>{t[1]}</div>
          </div>
        ))}
      </div>
    </Screen>
  )
}
