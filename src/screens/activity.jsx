import { useState } from 'react'
import { C, serif } from '../theme'
import { Screen, Intro, SectionLabel, RegenButton, TipNote, BulletLine, IconTile } from '../components/ui'
import { COACH, ACTIVITIES, NF } from '../data/datasets'

/* ---------------- Coach éducation ---------------- */
export function Coach() {
  const col = (prog) => (prog === 100 ? C.successDk : prog > 0 ? C.espresso : C.grayA)
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 22, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ textAlign: 'center', flex: 'none' }}>
          <div style={{ fontFamily: serif, fontSize: 40, lineHeight: 1 }}>40%</div>
          <div style={{ fontSize: 10, color: C.faint, letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 2 }}>programme</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Éducation de base</div>
          <div style={{ fontSize: 12.5, color: C.label, marginTop: 4, lineHeight: 1.4 }}>5 paliers adaptés à un Cocker de 4 ans. Semaine 2 en cours.</div>
        </div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Paliers</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {COACH.map((c) => (
          <div key={c.n} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '15px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: C.tile, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: C.body, flex: 'none' }}>{c.n}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.theme}</div>
                <div style={{ fontSize: 12, color: C.label, marginTop: 1 }}>{c.desc}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: col(c.prog), flex: 'none' }}>{c.state}</div>
            </div>
            <div style={{ height: 5, background: C.track, borderRadius: 3, overflow: 'hidden', marginTop: 12 }}>
              <div style={{ height: '100%', borderRadius: 3, background: col(c.prog), width: `${c.prog}%`, animation: 'bar .8s ease' }} />
            </div>
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 18, color: C.sub }}>💡 Mieux vaut 3 séances de 10 min par jour qu'une seule longue. Le Cocker reste concentré sur de courtes durées.</TipNote>
    </Screen>
  )
}

/* ---------------- Activités du jour (Générateur) ---------------- */
export function Activities() {
  const t = ACTIVITIES.today
  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.sub }}><span style={{ fontSize: 15 }}>☁</span>{t.weather} · adapté au Cocker</div>
      <div style={{ marginTop: 14, background: C.espresso, color: C.cream, borderRadius: 22, padding: 22 }}>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Recommandé aujourd'hui</div>
        <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.1, marginTop: 10 }}>{t.titre}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, background: '#342817', borderRadius: 999, padding: '6px 12px' }}>⏱ {t.duree}</div>
          <div style={{ fontSize: 12, fontWeight: 600, background: '#342817', borderRadius: 999, padding: '6px 12px' }}>👃 Flair</div>
        </div>
        <div style={{ fontSize: 13.5, color: C.grayA, lineHeight: 1.5, marginTop: 14 }}>{t.why}</div>
      </div>
      <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Autres idées</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACTIVITIES.list.map((a) => (
          <div key={a[0]} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14 }}>
            <IconTile size={44} radius={13} fontSize={20}>{a[3]}</IconTile>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{a[0]}</div>
              <div style={{ fontSize: 12.5, color: C.label, marginTop: 2 }}>{a[2]}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, flex: 'none' }}>{a[1]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><RegenButton>Générer d'autres activités</RegenButton></div>
    </Screen>
  )
}

/* ---------------- Programmes météo (Générateur · onglets) ---------------- */
export function Weatherprog() {
  const [tab, setTab] = useState('Pluie')
  const tabs = Object.keys(NF.weather)
  const items = NF.weather[tab].items
  return (
    <Screen>
      <Intro>Quand la météo bloque les sorties, voici de quoi dépenser Stanley.</Intro>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {tabs.map((k) => {
          const on = tab === k
          return (
            <button key={k} className="reset" onClick={() => setTab(k)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600, borderRadius: 12, padding: 11, cursor: 'pointer', background: on ? C.espresso : '#fff', color: on ? C.cream : C.body, border: `1px solid ${on ? C.espresso : C.cardBorder}` }}>
              {NF.weather[k].icon} {k}
            </button>
          )
        })}
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((i) => (
          <div key={i[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{i[0]}</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: C.sub, background: C.tile, borderRadius: 999, padding: '4px 9px' }}>{i[2]}</span>
            </div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: 1.45 }}>{i[1]}</div>
          </div>
        ))}
      </div>
    </Screen>
  )
}

/* ---------------- Parcours de promenade (Générateur) ---------------- */
export function Walkroute() {
  const w = NF.walk
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 20, padding: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Parcours suggéré</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
          <WalkStat v={w.duree} k="durée" />
          <WalkStat v={w.dist} k="distance" />
          <WalkStat v={w.rythme} k="rythme" />
        </div>
        <div style={{ fontSize: 12, color: C.label, marginTop: 14 }}>Terrain : {w.terrain}</div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Déroulé</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {w.segments.map((s) => (
          <div key={s[0]} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
            <IconTile size={40} radius={12} fontSize={18}>{s[2]}</IconTile>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s[1]}</div>
              <div style={{ fontSize: 12, color: C.label, marginTop: 1 }}>{s[0]}</div>
            </div>
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 16 }}>{w.note}</TipNote>
      <div style={{ marginTop: 14 }}><RegenButton>Générer un autre parcours</RegenButton></div>
    </Screen>
  )
}
const WalkStat = ({ v, k }) => (
  <div><div style={{ fontFamily: serif, fontSize: 26 }}>{v}</div><div style={{ fontSize: 10, color: C.faint, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k}</div></div>
)

/* ---------------- Exercices mentaux (Générateur) ---------------- */
export function Mentalex() {
  const m = NF.mentalex
  const col = (lvl) => (lvl === 'Facile' ? C.successDk : lvl === 'Moyen' ? C.warn : C.danger)
  return (
    <Screen>
      <Intro>Exercices de réflexion calibrés pour un <span style={{ fontWeight: 600, color: C.body }}>{m.breed}</span>.</Intro>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {m.items.map((i) => (
          <div key={i[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{i[0]}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: col(i[2]), border: `1px solid ${col(i[2])}`, borderRadius: 999, padding: '3px 10px' }}>{i[2]}</span>
            </div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: 1.45 }}>{i[1]}</div>
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 16, color: C.sub }}>💡 10 minutes de réflexion fatiguent autant qu'une longue promenade.</TipNote>
    </Screen>
  )
}

/* ---------------- Niveau d'activité (Calcul/Info) ---------------- */
export function Activitylevel() {
  const a = NF.activitylevel
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 20, padding: 22, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Diagnostic</div>
        <div style={{ fontFamily: serif, fontSize: 30, marginTop: 8 }}>{a.level}</div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
        {a.scale.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 6, borderRadius: 3, background: i === 1 ? C.espresso : C.track }} />
            <div style={{ fontSize: 10, color: C.label, marginTop: 6, fontWeight: 600 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {a.stats.map((s) => (
          <div key={s[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '13px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: 18 }}>{s[1]}</div>
            <div style={{ fontSize: 10, letterSpacing: '.04em', textTransform: 'uppercase', color: C.label, marginTop: 3 }}>{s[0]}</div>
          </div>
        ))}
      </div>
      <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Recommandations</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {a.recos.map((r) => <BulletLine key={r} variant="plain" boxed>{r}</BulletLine>)}
      </div>
    </Screen>
  )
}
