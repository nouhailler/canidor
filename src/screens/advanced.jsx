import { C, serif } from '../theme'
import { Screen, Intro, SectionLabel, TipNote } from '../components/ui'
import { NF, PEDIGREE } from '../data/datasets'

/* ---------------- Chronologie de vie (Liste) ---------------- */
export function Timeline() {
  return (
    <Screen>
      <Intro>Le journal de vie de Stanley, composé automatiquement.</Intro>
      <div style={{ marginTop: 18, position: 'relative', paddingLeft: 8 }}>
        <div style={{ position: 'absolute', left: 26, top: 8, bottom: 8, width: 2, background: C.track }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {NF.timeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flex: 'none', zIndex: 1 }}>{t[3]}</div>
              <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '13px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{t[1]}</span>
                  <span style={{ fontSize: 11, color: C.label }}>{t[0]}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4, lineHeight: 1.35 }}>{t[2]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}

/* ---------------- Jumeau numérique (Calcul/Info) ---------------- */
export function Twin() {
  const t = NF.twin
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, flex: 'none', background: 'repeating-linear-gradient(45deg,#3A2C20,#3A2C20 7px,#2F2316 7px,#2F2316 14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 22, color: C.faint }}>B</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 23, lineHeight: 1 }}>Jumeau numérique</div>
            <div style={{ fontSize: 12, color: C.label, marginTop: 4 }}>Modèle vivant de Stanley</div>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {t.now.map((r) => (
            <div key={r[0]} style={{ background: '#241A11', borderRadius: 12, padding: '11px 13px' }}>
              <div style={{ fontSize: 10, letterSpacing: '.04em', textTransform: 'uppercase', color: '#7C6754' }}>{r[0]}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}>{r[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Projection</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t.proj.map((p) => (
          <div key={p[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p[0]}</div>
              <div style={{ fontSize: 12, color: C.label, marginTop: 2, lineHeight: 1.35 }}>{p[2]}</div>
            </div>
            <div style={{ fontFamily: serif, fontSize: 21, flex: 'none' }}>{p[1]}</div>
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 18, borderRadius: 16 }}>{t.scenario}</TipNote>
    </Screen>
  )
}

/* ---------------- Pedigree & lignées (Liste/détail) ---------------- */
export function Pedigree() {
  const p = PEDIGREE
  return (
    <Screen>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontSize: 22 }}>{p.coi}</div>
          <div style={{ fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', color: C.label, marginTop: 2 }}>Consanguinité</div>
        </div>
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: serif, fontSize: 22 }}>{p.champs} ★</div>
          <div style={{ fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', color: C.label, marginTop: 2 }}>Champions</div>
        </div>
      </div>

      <SectionLabel style={{ marginTop: 22, marginBottom: 14 }}>Arbre généalogique</SectionLabel>
      <div style={{ fontSize: 10, color: C.label, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 8 }}>Grands-parents</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {p.gp.map((g) => (
          <div key={g.name} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 12, padding: '11px 12px', fontSize: 12.5, fontWeight: 600, lineHeight: 1.25, display: 'flex', alignItems: 'center', gap: 6 }}>
            {g.champ && <span style={{ color: C.warn }}>★</span>}{g.name}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: C.grayB, fontSize: 18, margin: '6px 0' }}>⌄</div>
      <div style={{ fontSize: 10, color: C.label, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 8 }}>Parents</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {p.parents.map((pa) => (
          <div key={pa.name} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 12, padding: 13, fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>
            <span style={{ color: C.label }}>{pa.sex}</span> {pa.champ && <span style={{ color: C.warn }}>★</span>} {pa.name}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: C.grayB, fontSize: 18, margin: '6px 0' }}>⌄</div>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 16, padding: 18, textAlign: 'center' }}>
        <div style={{ fontFamily: serif, fontSize: 26 }}>Stanley</div>
        <div style={{ fontSize: 12, color: C.label, marginTop: 4 }}>Génération actuelle · {p.desc}</div>
      </div>
    </Screen>
  )
}
