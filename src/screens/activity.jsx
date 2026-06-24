import { useEffect, useState } from 'react'
import { C, serif } from '../theme'
import { Screen, Intro, SectionLabel, RegenButton, TipNote, BulletLine, IconTile } from '../components/ui'
import { COACH, NF } from '../data/datasets'
import { useApp } from '../store/AppContext'
import { useActivity } from '../store/ActivityContext'
import { chatCompletion } from '../lib/openrouter'
import { buildMessages, INSTRUCTIONS } from '../lib/prompts'
import { loadDetail, saveDetail, parseDetail } from '../lib/activityDetail'

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
  const { dog } = useApp()
  const { today: t, list, weather, geoStatus, source, loading, error, aiReady, regenerate, history, saveToHistory, removeFromHistory } = useActivity()
  const [detail, setDetail] = useState(null) // activité ouverte dans la fiche détail

  const place = weather.place ? ` · ${weather.place}` : ''
  const weatherTip = geoStatus === 'denied'
    ? 'Localisation indisponible · météo estimée'
    : weather.outdoorOK ? 'Sorties extérieures possibles' : 'Mieux vaut rester à l’intérieur'

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.sub }}>
        <span style={{ fontSize: 16 }}>{weather.icon}</span>
        <span><b style={{ color: C.body, fontWeight: 600 }}>{weather.label} · {weather.temp}°</b>{place} · adapté à {dog.nom}</span>
      </div>
      <div style={{ fontSize: 11.5, color: C.label, marginTop: 4 }}>{weatherTip}</div>

      <div onClick={() => setDetail(t)} className="hoverable" style={{ marginTop: 14, background: C.espresso, color: C.cream, borderRadius: 22, padding: 22, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Recommandé aujourd'hui</div>
          {source === 'ai' && <div style={{ fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: C.accent, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />IA</div>}
        </div>
        <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.1, marginTop: 10 }}>{t.titre}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, background: '#342817', borderRadius: 999, padding: '6px 12px' }}>⏱ {t.duree}</div>
          <div style={{ fontSize: 12, fontWeight: 600, background: '#342817', borderRadius: 999, padding: '6px 12px' }}>{t.icon} {t.tag}</div>
        </div>
        <div style={{ fontSize: 13.5, color: C.grayA, lineHeight: 1.5, marginTop: 14 }}>{t.why}</div>
        <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginTop: 14 }}>Voir le détail ›</div>
      </div>

      <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Autres idées</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((a) => (
          <div key={a.titre} onClick={() => setDetail(a)} className="hoverable" style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14, cursor: 'pointer' }}>
            <IconTile size={44} radius={13} fontSize={20}>{a.icon}</IconTile>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{a.titre}</div>
              <div style={{ fontSize: 12.5, color: C.label, marginTop: 2 }}>{a.why}</div>
            </div>
            <div style={{ fontSize: 18, color: C.grayA, flex: 'none' }}>›</div>
          </div>
        ))}
      </div>
      {error && <div style={{ marginTop: 14, fontSize: 12.5, color: C.danger, lineHeight: 1.5 }}>⚠ {error} Idées proposées hors ligne.</div>}
      <div style={{ marginTop: 18 }}>
        <RegenButton onClick={loading ? undefined : regenerate}>
          {loading ? 'Génération en cours…' : aiReady ? 'Générer avec l’IA' : "Générer d'autres activités"}
        </RegenButton>
      </div>

      <ActivityHistory history={history} onRemove={removeFromHistory} onOpen={setDetail} />

      {detail && (
        <ActivityDetail
          activity={detail}
          onClose={() => setDetail(null)}
          onSave={() => saveToHistory(detail)}
        />
      )}
    </Screen>
  )
}

// Fiche détail d'une activité (overlay) : description complète, étapes
// détaillées par l'IA (mises en cache) et enregistrement dans l'historique.
function ActivityDetail({ activity: a, onClose, onSave }) {
  const { aiReady, orKey, orModel, dog } = useApp()
  const [det, setDet] = useState(() => loadDetail(a.titre))
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { setDet(loadDetail(a.titre)); setErr(''); setSaved(false) }, [a.titre])

  const generate = async () => {
    if (!aiReady || loading) return
    setLoading(true); setErr('')
    try {
      const text = await chatCompletion({
        key: orKey,
        model: orModel,
        messages: buildMessages({ dog, instruction: INSTRUCTIONS.activityDetail(a) }),
      })
      const parsed = parseDetail(text)
      saveDetail(a.titre, parsed)
      setDet(parsed)
    } catch (e) {
      setErr(e.message || 'Échec de la génération.')
    } finally {
      setLoading(false)
    }
  }

  const save = () => { onSave(); setSaved(true) }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(30,22,14,.5)', zIndex: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 440, maxHeight: '88vh', overflowY: 'auto', background: C.cream, borderRadius: '22px 22px 0 0', padding: 22, animation: 'rise .25s ease' }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: C.grayB, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile size={48} radius={14} fontSize={22}>{a.icon}</IconTile>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: serif, fontSize: 23, lineHeight: 1.1 }}>{a.titre}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: C.tile, borderRadius: 999, padding: '4px 10px' }}>⏱ {a.duree}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: C.tile, borderRadius: 999, padding: '4px 10px' }}>{a.tag}</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: C.body, lineHeight: 1.55, marginTop: 16 }}>{a.why}</div>

        {det && (
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!!det.materiel.length && <DetailBlock label="Matériel" items={det.materiel} />}
            {!!det.etapes.length && <DetailBlock label="Étapes" items={det.etapes} ordered />}
            {det.conseil && <TipNote style={{ marginTop: 0 }}>💡 {det.conseil}</TipNote>}
          </div>
        )}

        {err && <div style={{ marginTop: 12, fontSize: 13, color: C.danger, lineHeight: 1.5 }}>⚠ {err}</div>}

        {aiReady && (
          <button className="reset" disabled={loading} onClick={generate}
            style={{ marginTop: 16, width: '100%', border: `1px solid ${C.grayB}`, borderRadius: 999, padding: 13, textAlign: 'center', fontWeight: 600, fontSize: 14, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1, minHeight: 46 }}>
            {loading ? 'Analyse en cours…' : det ? '↻ Régénérer les étapes' : '✨ Détailler les étapes avec l’IA'}
          </button>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="reset" disabled={saved} onClick={save}
            style={{ flex: 1, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 14, cursor: saved ? 'default' : 'pointer', background: saved ? C.tile : C.espresso, color: saved ? C.sub : C.cream, minHeight: 48 }}>
            {saved ? '✓ Ajouté à l’historique' : '✓ Marquer comme fait'}
          </button>
          <button className="reset" onClick={onClose} style={{ borderRadius: 999, padding: '14px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: `1px solid ${C.grayB}`, background: '#fff', color: C.body }}>Fermer</button>
        </div>
      </div>
    </div>
  )
}

function DetailBlock({ label, items, ordered }) {
  return (
    <div>
      <SectionLabel style={{ marginBottom: 10 }}>{label}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: C.body, lineHeight: 1.45 }}>
            <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: C.tile, color: C.sub, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ordered ? idx + 1 : '•'}</span>
            <span>{it}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Historique des activités réalisées (persisté localement).
function ActivityHistory({ history, onRemove, onOpen }) {
  if (!history.length) return null
  const fmt = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
  return (
    <>
      <SectionLabel style={{ marginTop: 28, marginBottom: 12 }}>Historique des activités</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {history.map((h) => (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '11px 14px' }}>
            <span style={{ fontSize: 18, flex: 'none' }}>{h.icon}</span>
            <div onClick={() => onOpen(h)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{h.titre}</div>
              <div style={{ fontSize: 11.5, color: C.label, marginTop: 1 }}>{fmt(h.date)} · {h.tag} · {h.duree}</div>
            </div>
            <button className="reset" onClick={() => onRemove(h.id)} style={{ flex: 'none', fontSize: 16, color: C.grayA, cursor: 'pointer', padding: 4 }}>✕</button>
          </div>
        ))}
      </div>
    </>
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
