import { useState } from 'react'
import { C, serif } from '../theme'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, TipNote, Bar } from '../components/ui'
import { AIPanel } from '../components/ai'
import { useBreeds } from '../store/BreedsContext'
import { NF, SIM } from '../data/datasets'
import { INSTRUCTIONS } from '../lib/prompts'
import { LIFESTYLE_FIELDS, LIFESTYLE_DEFAULTS, estimateCompat, summarize, ADOPTION_FIELDS, ADOPTION_DEFAULTS, estimateAdoption } from '../lib/lifestyle'

/* ---------------- Mode de vie (Rapport dynamique) ---------------- */
const lifestyleSelectStyle = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 10, padding: '11px 12px', fontSize: 15, fontWeight: 600, color: C.espresso, outline: 'none', marginTop: 4 }

export function Lifestyle() {
  const { breeds } = useBreeds()
  const [done, setDone] = useState(false)
  const [fields, setFields] = useState(LIFESTYLE_DEFAULTS)
  const [results, setResults] = useState([])
  const set = (k) => (e) => setFields((s) => ({ ...s, [k]: e.target.value }))
  const fieldsLine = LIFESTYLE_FIELDS.map((f) => `${f.k}: ${fields[f.k]}`).join(', ')
  const col = (pct) => (pct >= 80 ? C.successDk2 : pct >= 60 ? C.warn : C.danger)

  const generate = () => { setResults(estimateCompat(fields, breeds)); setDone(true) }

  if (!done) {
    return (
      <Screen>
        <Intro>Décrivez votre quotidien : l'estimation évalue votre compatibilité avec chaque race du catalogue.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LIFESTYLE_FIELDS.map((f) => (
            <label key={f.k} style={{ display: 'block', background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{f.k}</div>
              <select style={lifestyleSelectStyle} value={fields[f.k]} onChange={set(f.k)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={generate}>Générer le rapport</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 20, padding: 20, fontSize: 14, lineHeight: 1.55 }}>{summarize(results)}</div>

      {/* Rappel du quotidien décrit */}
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {LIFESTYLE_FIELDS.map((f) => (
          <span key={f.k} style={{ fontSize: 11.5, color: C.body, background: C.tile, borderRadius: 999, padding: '5px 10px' }}>{f.k} : <b style={{ fontWeight: 600 }}>{fields[f.k]}</b></span>
        ))}
      </div>

      <SectionLabel style={{ marginTop: 22, marginBottom: 14 }}>Compatibilité par race</SectionLabel>
      {results.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {results.map((r) => (
            <div key={r.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <span style={{ color: col(r.pct), fontWeight: 600 }}>{r.pct}%</span>
              </div>
              <Bar value={r.pct} color={col(r.pct)} height={8} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13.5, color: C.label, lineHeight: 1.5 }}>Aucune race chiffrée dans le catalogue. Ajoutez-en pour obtenir une estimation.</div>
      )}

      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.lifestyle(fieldsLine)} label="Rapport détaillé avec l'IA" /></div>
      <div style={{ marginTop: 16 }}><OutlineButton onClick={() => setDone(false)}>Modifier mon quotidien</OutlineButton></div>
    </Screen>
  )
}

/* ---------------- Compatibilité adoption (Rapport dynamique) ---------------- */
export function Compat() {
  const { breeds } = useBreeds()
  const [done, setDone] = useState(false)
  const [fields, setFields] = useState(ADOPTION_DEFAULTS)
  const [results, setResults] = useState([])
  const set = (k) => (e) => setFields((s) => ({ ...s, [k]: e.target.value }))
  const fieldsLine = ADOPTION_FIELDS.map((f) => `${f.k}: ${fields[f.k]}`).join(', ')
  const scoreCol = (pct) => (pct >= 80 ? C.successDk2 : pct >= 60 ? C.warn : C.danger)

  const generate = () => { setResults(estimateAdoption(fields, breeds)); setDone(true) }

  if (!done) {
    return (
      <Screen>
        <Intro>Décrivez votre mode de vie pour découvrir les races les plus adaptées du catalogue.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ADOPTION_FIELDS.map((f) => (
            <label key={f.k} style={{ display: 'block', background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{f.k}</div>
              <select style={lifestyleSelectStyle} value={fields[f.k]} onChange={set(f.k)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={generate}>Trouver mes races</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <SectionLabel style={{ marginBottom: 10 }}>Top {results.length || 5} pour votre mode de vie</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {ADOPTION_FIELDS.map((f) => (
          <span key={f.k} style={{ fontSize: 11.5, color: C.body, background: C.tile, borderRadius: 999, padding: '5px 10px' }}>{f.k} : <b style={{ fontWeight: 600 }}>{fields[f.k]}</b></span>
        ))}
      </div>
      {results.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {results.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14 }}>
              <div style={{ fontFamily: serif, fontSize: 24, color: C.grayA, width: 24, textAlign: 'center', flex: 'none' }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: C.label, marginTop: 2, lineHeight: 1.35 }}>{c.reason}</div>
              </div>
              <div style={{ textAlign: 'center', flex: 'none' }}>
                <div style={{ fontFamily: serif, fontSize: 20, color: scoreCol(c.pct) }}>{c.pct}</div>
                <div style={{ fontSize: 9, color: C.label, letterSpacing: '.05em' }}>SCORE</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13.5, color: C.label, lineHeight: 1.5 }}>Aucune race chiffrée dans le catalogue. Ajoutez-en pour obtenir un classement.</div>
      )}
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.compat(fieldsLine)} label="Conseils détaillés avec l'IA" /></div>
      <div style={{ marginTop: 16 }}><OutlineButton onClick={() => setDone(false)}>Modifier mes critères</OutlineButton></div>
    </Screen>
  )
}

/* ---------------- Compatibilité entre chiens (Rapport) ---------------- */
export function Dogcompat() {
  const [done, setDone] = useState(false)
  const dc = NF.dogcompat
  if (!done) {
    return (
      <Screen>
        <Intro>Comparez Stanley à un autre chien pour estimer leur entente.</Intro>
        <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, background: C.espresso, color: C.cream, borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', color: C.faint }}>Chien A</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{dc.a}</div>
          </div>
          <div style={{ fontSize: 13, color: C.label, fontWeight: 600 }}>vs</div>
          <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', color: C.label }}>Chien B</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{dc.b}</div>
          </div>
        </div>
        <SectionLabel style={{ marginTop: 14, marginBottom: 10 }}>Profil du chien B</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dc.bProfile.map((p) => (
            <div key={p[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '14px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{p[0]}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.onAccent, background: C.accent, borderRadius: 999, padding: '5px 13px' }}>{p[1]}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => setDone(true)}>Estimer la compatibilité</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 24, textAlign: 'center' }}>
        <div style={{ fontFamily: serif, fontSize: 54, lineHeight: 1 }}>{dc.score}%</div>
        <div style={{ fontSize: 14, color: C.label, marginTop: 6 }}>{dc.verdict} · {dc.a} & {dc.b}</div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Points d'attention</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {dc.points.map((p) => (
          <div key={p} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
            <span style={{ color: C.espresso, flex: 'none' }}>•</span>{p}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.dogcompat(dc.a, dc.b, dc.bProfile.map((p) => `${p[0]}: ${p[1]}`).join(', '))} /></div>
      <div style={{ marginTop: 16 }}><OutlineButton onClick={() => setDone(false)}>Tester un autre chien</OutlineButton></div>
    </Screen>
  )
}

/* ---------------- Simulateur d'adoption (Calcul/Info) ---------------- */
export function Simulator() {
  const s = SIM
  return (
    <Screen>
      <Intro>Visualisez ce que représente vraiment la vie avec une race, avant d'adopter.</Intro>
      <div style={{ marginTop: 16, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>Race simulée</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>{s.breed}</div>
        </div>
        <div style={{ color: C.grayA, fontSize: 18 }}>⌄</div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: C.espresso, color: C.cream, borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 10, color: C.faint, letterSpacing: '.05em', textTransform: 'uppercase' }}>Budget annuel</div>
          <div style={{ fontFamily: serif, fontSize: 23, marginTop: 6 }}>{s.annual}</div>
        </div>
        <div style={{ flex: 1, background: C.espresso, color: C.cream, borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 10, color: C.faint, letterSpacing: '.05em', textTransform: 'uppercase' }}>Temps / jour</div>
          <div style={{ fontFamily: serif, fontSize: 23, marginTop: 6 }}>{s.time}</div>
        </div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 14 }}>Exigences</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {s.rows.map((r) => (
          <div key={r[0]}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 500 }}>{r[0]}</span>
              <span style={{ color: C.label }}>{r[2]}</span>
            </div>
            <Bar value={r[1]} />
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 18 }}>{s.note}</TipNote>
    </Screen>
  )
}
