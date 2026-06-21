import { useState } from 'react'
import { C, serif } from '../theme'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, TipNote, Bar } from '../components/ui'
import { AIPanel } from '../components/ai'
import { NF, COMPAT, SIM, COMPAT_FIELDS } from '../data/datasets'
import { INSTRUCTIONS } from '../lib/prompts'

const PillField = ({ k, v }) => (
  <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <div style={{ fontSize: 14, fontWeight: 500 }}>{k}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: C.onAccent, background: C.accent, borderRadius: 999, padding: '6px 13px', textAlign: 'right' }}>{v}</div>
  </div>
)

/* ---------------- Mode de vie (Rapport) ---------------- */
export function Lifestyle() {
  const [done, setDone] = useState(false)
  const ls = NF.lifestyle
  const col = (pct) => (pct >= 80 ? C.successDk2 : pct >= 60 ? C.warn : C.danger)

  if (!done) {
    return (
      <Screen>
        <Intro>Décrivez votre quotidien : l'IA évalue votre compatibilité avec chaque race.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ls.fields.map((f) => <PillField key={f[0]} k={f[0]} v={f[1]} />)}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => setDone(true)}>Générer le rapport</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 20, padding: 20, fontSize: 14, lineHeight: 1.55 }}>{ls.summary}</div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 14 }}>Compatibilité par race</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ls.results.map((r) => (
          <div key={r[0]}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>{r[0]}</span>
              <span style={{ color: col(r[1]), fontWeight: 600 }}>{r[1]}%</span>
            </div>
            <Bar value={r[1]} color={col(r[1])} height={8} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.lifestyle(ls.fields.map((f) => `${f[0]}: ${f[1]}`).join(', '))} /></div>
      <div style={{ marginTop: 16 }}><OutlineButton onClick={() => setDone(false)}>Modifier mon quotidien</OutlineButton></div>
    </Screen>
  )
}

/* ---------------- Compatibilité adoption (Rapport) ---------------- */
export function Compat() {
  const [done, setDone] = useState(false)
  if (!done) {
    return (
      <Screen>
        <Intro>Décrivez votre mode de vie pour découvrir les races les plus adaptées.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COMPAT_FIELDS.map((f) => <PillField key={f.k} k={f.k} v={f.v} />)}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => setDone(true)}>Trouver mes races</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <SectionLabel style={{ marginBottom: 14 }}>Top 5 pour votre mode de vie</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {COMPAT.map((c, i) => (
          <div key={c[0]} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14 }}>
            <div style={{ fontFamily: serif, fontSize: 24, color: C.grayA, width: 24, textAlign: 'center', flex: 'none' }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{c[0]}</div>
              <div style={{ fontSize: 12.5, color: C.label, marginTop: 2, lineHeight: 1.35 }}>{c[2]}</div>
            </div>
            <div style={{ textAlign: 'center', flex: 'none' }}>
              <div style={{ fontFamily: serif, fontSize: 20 }}>{c[1]}</div>
              <div style={{ fontSize: 9, color: C.label, letterSpacing: '.05em' }}>SCORE</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.compat(COMPAT_FIELDS.map((f) => `${f.k}: ${f.v}`).join(', '))} /></div>
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
