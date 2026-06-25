import { useState } from 'react'
import { C, serif } from '../theme'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, TipNote, Bar } from '../components/ui'
import { AIPanel } from '../components/ai'
import { useApp } from '../store/AppContext'
import { useBreeds } from '../store/BreedsContext'
import { INSTRUCTIONS } from '../lib/prompts'
import { LIFESTYLE_FIELDS, LIFESTYLE_DEFAULTS, estimateCompat, summarize, ADOPTION_FIELDS, ADOPTION_DEFAULTS, estimateAdoption } from '../lib/lifestyle'
import { TEMPERAMENTS, estimateDogCompat } from '../lib/dogcompat'
import { estimateSimulation } from '../lib/simulator'

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

/* ---------------- Compatibilité entre chiens (Rapport dynamique) ---------------- */
const dcInput = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 10, padding: '10px 11px', fontSize: 14, color: C.espresso, outline: 'none', marginTop: 4 }
const dcLabel = { fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }

// Éditeur d'un chien (race au choix dans le catalogue + sexe, âge, tempérament).
function DogEditor({ title, dog, onChange, raceNames }) {
  const set = (k) => (e) => onChange({ ...dog, [k]: e.target.value })
  return (
    <div style={{ flex: 1, minWidth: 0, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: C.accent, fontWeight: 700, textAlign: 'center' }}>{title}</div>
      <label><div style={dcLabel}>Nom</div><input style={dcInput} value={dog.nom} onChange={set('nom')} placeholder="Optionnel" /></label>
      <label><div style={dcLabel}>Race</div>
        <select style={dcInput} value={dog.race} onChange={set('race')}>
          {raceNames.map((n) => <option key={n}>{n}</option>)}
        </select>
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <label style={{ flex: 1 }}><div style={dcLabel}>Sexe</div>
          <select style={dcInput} value={dog.sexe} onChange={set('sexe')}><option>Mâle</option><option>Femelle</option></select>
        </label>
        <label style={{ width: 76, flex: 'none' }}><div style={dcLabel}>Âge</div>
          <input type="number" min="0" style={dcInput} value={dog.age} onChange={set('age')} />
        </label>
      </div>
      <label><div style={dcLabel}>Tempérament</div>
        <select style={dcInput} value={dog.temperament} onChange={set('temperament')}>{TEMPERAMENTS.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
    </div>
  )
}

export function Dogcompat() {
  const { dog } = useApp()
  const { breeds } = useBreeds()
  const raceNames = breeds.map((br) => br.nom)
  // Côté A : pré-rempli avec le chien du profil si sa race est au catalogue.
  const profileRace = raceNames.includes(dog.race) ? dog.race : (raceNames[0] || '')
  const otherRace = raceNames.find((n) => n !== profileRace) || profileRace || ''

  const [a, setA] = useState({ nom: dog.nom || '', race: profileRace, sexe: dog.sexe || 'Mâle', age: dog.ageAnnees ?? 3, temperament: 'Équilibré' })
  const [b, setB] = useState({ nom: '', race: otherRace, sexe: 'Femelle', age: 3, temperament: 'Équilibré' })
  const [res, setRes] = useState(null)
  const [done, setDone] = useState(false)

  const generate = () => { setRes(estimateDogCompat(a, b, breeds)); setDone(true) }
  const col = (pct) => (pct >= 80 ? C.successDk2 : pct >= 60 ? C.warn : C.danger)

  if (!raceNames.length) {
    return <Screen><Intro>Comparez deux chiens pour estimer leur entente.</Intro><div style={{ marginTop: 20, fontSize: 13.5, color: C.label }}>Ajoutez des races au catalogue pour comparer deux chiens.</div></Screen>
  }

  if (!done) {
    return (
      <Screen>
        <Intro>Choisissez deux chiens (race, sexe, âge, tempérament) pour estimer leur entente. Calcul local, sans IA.</Intro>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <DogEditor title="Chien A" dog={a} onChange={setA} raceNames={raceNames} />
          <DogEditor title="Chien B" dog={b} onChange={setB} raceNames={raceNames} />
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={generate}>Estimer la compatibilité</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 24, textAlign: 'center' }}>
        <div style={{ fontFamily: serif, fontSize: 54, lineHeight: 1, color: col(res.score) }}>{res.score}%</div>
        <div style={{ fontSize: 14, color: C.label, marginTop: 6 }}>{res.verdict} · {res.names.a} & {res.names.b}</div>
        <div style={{ fontSize: 11.5, color: C.faint, marginTop: 6 }}>{a.race} ({a.sexe}, {a.age} ans) · {b.race} ({b.sexe}, {b.age} ans)</div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Points d'attention</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {res.points.map((p) => (
          <div key={p} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
            <span style={{ color: C.espresso, flex: 'none' }}>•</span>{p}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.dogcompat(`${res.names.a} (${a.race}, ${a.sexe}, ${a.age} ans, ${a.temperament})`, res.names.b, `${b.race}, ${b.sexe}, ${b.age} ans, tempérament ${b.temperament}`)} label="Conseils détaillés avec l'IA" /></div>
      <div style={{ marginTop: 16 }}><OutlineButton onClick={() => setDone(false)}>Modifier les chiens</OutlineButton></div>
    </Screen>
  )
}

/* ---------------- Simulateur d'adoption (dynamique) ---------------- */
const simSelectStyle = { border: 'none', background: 'transparent', fontSize: 16, fontWeight: 600, color: C.espresso, outline: 'none', cursor: 'pointer', textAlignLast: 'right', maxWidth: 200 }

export function Simulator() {
  const { dog } = useApp()
  const { breeds } = useBreeds()
  const usable = breeds.filter((b) => Array.isArray(b.traits) && b.traits.length)
  const initial = Math.max(0, usable.findIndex((b) => b.nom === dog.race))
  const [sel, setSel] = useState(initial)

  if (!usable.length) {
    return (
      <Screen>
        <Intro>Visualisez ce que représente vraiment la vie avec une race, avant d'adopter.</Intro>
        <div style={{ marginTop: 20, fontSize: 13.5, color: C.label, lineHeight: 1.5 }}>Aucune race chiffrée dans le catalogue. Ajoutez-en pour lancer une simulation.</div>
      </Screen>
    )
  }

  const breed = usable[Math.min(sel, usable.length - 1)]
  const s = estimateSimulation(breed)

  return (
    <Screen>
      <Intro>Visualisez ce que représente vraiment la vie avec une race, avant d'adopter.</Intro>
      <div style={{ marginTop: 16, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600, flex: 'none' }}>Race simulée</div>
        <select style={simSelectStyle} value={Math.min(sel, usable.length - 1)} onChange={(e) => setSel(Number(e.target.value))}>
          {usable.map((b, i) => <option key={b.id} value={i}>{b.nom}</option>)}
        </select>
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
