import { C, serif } from '../theme'
import { useApp } from '../store/AppContext'
import { useActivity } from '../store/ActivityContext'
import { useChrome } from '../store/ChromeContext'
import { Screen, Avatar, IconTile } from '../components/ui'
import { HOME_ALERTS, HOME_QUICK } from '../data/tools'

export default function Home() {
  const { dog } = useApp()
  const { today, loading } = useActivity()
  const { goScreen } = useChrome()
  const sexSym = dog.sexe === 'Femelle' ? '♀' : '♂'

  return (
    <Screen>
      {/* Profile hero */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.espresso, color: C.cream, borderRadius: 22, padding: 16 }}>
        <Avatar size={58} radius={16} fontSize={26} letter={dog.nom[0]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 24, lineHeight: 1 }}>{dog.nom}</div>
          <div style={{ fontSize: 13, color: C.label, marginTop: 4 }}>{`${dog.race} · ${dog.ageAnnees} ans · ${sexSym}`}</div>
        </div>
        <div style={{ textAlign: 'center', flex: 'none' }}>
          <div style={{ fontFamily: serif, fontSize: 22 }}>{dog.forme}</div>
          <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: C.label }}>forme</div>
        </div>
      </div>

      {/* Activité du jour */}
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '14px 16px' }}>
        <IconTile size={34} radius={10} fontSize={16}>{today.icon || '☀'}</IconTile>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>Activité du jour</div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{loading ? 'Génération en cours…' : `${today.duree} · ${today.titre}`}</div>
        </div>
        <button className="reset" onClick={() => goScreen('activities')} style={{ fontSize: 13, fontWeight: 600, color: C.espresso, borderBottom: `1.5px solid ${C.espresso}`, cursor: 'pointer', flex: 'none' }}>Voir</button>
      </div>

      {/* Alertes santé */}
      <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>Alertes santé</div>
        <button className="reset" onClick={() => goScreen('carnet')} style={{ fontSize: 12, color: C.sub, cursor: 'pointer' }}>Carnet ›</button>
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {HOME_ALERTS.map((a) => (
          <div key={a.text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '13px 14px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flex: 'none' }} />
            <div style={{ flex: 1, fontSize: 13.5 }}>{a.text}</div>
            <div style={{ fontSize: 12, color: C.label, flex: 'none' }}>{a.when}</div>
          </div>
        ))}
      </div>

      {/* Accès rapide */}
      <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>Accès rapide</div>
        <button className="reset" onClick={() => goScreen('tools')} style={{ fontSize: 12, color: C.sub, cursor: 'pointer' }}>Tout voir ›</button>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {HOME_QUICK.map((q) => (
          <div key={q.title} onClick={() => goScreen(q.id)} className="hoverable" style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 16, cursor: 'pointer', minHeight: 104, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <IconTile size={36} radius={11} fontSize={17} tint={q.tint}>{q.icon}</IconTile>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.15 }}>{q.title}</div>
              <div style={{ fontSize: 11.5, color: C.label, marginTop: 2 }}>{q.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Catalogue */}
      <div onClick={() => goScreen('catalogue')} style={{ marginTop: 24, background: C.espresso, color: C.cream, borderRadius: 20, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', flex: 'none' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'repeating-linear-gradient(45deg,#4A3928,#4A3928 6px,#3A2C20 6px,#3A2C20 12px)', border: `2px solid ${C.espresso}` }} />
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'repeating-linear-gradient(45deg,#574431,#574431 6px,#38362F 6px,#38362F 12px)', border: `2px solid ${C.espresso}`, marginLeft: -16 }} />
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'repeating-linear-gradient(45deg,#664F39,#664F39 6px,#444239 6px,#444239 12px)', border: `2px solid ${C.espresso}`, marginLeft: -16 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Catalogue</div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.15, marginTop: 2 }}>Explorer toutes les races</div>
          <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>Photos & caractéristiques</div>
        </div>
        <div style={{ fontSize: 22, color: C.faint, flex: 'none' }}>›</div>
      </div>
    </Screen>
  )
}
