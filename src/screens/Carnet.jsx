import { C, serif } from '../theme'
import { useChrome } from '../store/ChromeContext'
import { Screen, SectionLabel } from '../components/ui'
import { HEALTH } from '../data/datasets'

const Label = ({ children }) => <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>{children}</SectionLabel>

export default function Carnet() {
  const { goScreen } = useChrome()
  const vaccins = HEALTH.vaccins.map((v) => ({ name: v[0], status: v[1], detail: v[2], color: v[3] === 'ok' ? C.successDk : C.warn }))
  const poidsBars = HEALTH.poids.map((p) => ({ m: p[0], kg: String(p[1]).replace('.', ','), h: Math.max(14, Math.round(((p[1] - 12.4) / 1.0) * 100)) }))

  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 18, padding: '15px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.warn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flex: 'none' }}>🔔</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>2 rappels à venir</div>
          <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>Prochain : vaccin CHPPiL dans 15 jours</div>
        </div>
      </div>

      <Label>Vaccins</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {vaccins.map((v) => (
          <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color, flex: 'none' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>{v.detail}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: v.color, border: `1px solid ${v.color}`, borderRadius: 999, padding: '4px 10px', flex: 'none' }}>{v.status}</div>
          </div>
        ))}
      </div>

      <Label>Vermifuges & traitements</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...HEALTH.vermifuges, ...HEALTH.traitements].map((v) => (
          <div key={v[0]} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{v[0]}</div>
            <div style={{ fontSize: 12, color: C.label, marginTop: 3 }}>{v[2]}</div>
          </div>
        ))}
      </div>

      <Label>Courbe de poids</Label>
      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '18px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 110 }}>
          {poidsBars.map((p) => (
            <div key={p.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: 10, color: C.sub, fontWeight: 600 }}>{p.kg}</div>
              <div style={{ width: '70%', background: C.espresso, borderRadius: '5px 5px 0 0', height: `${p.h}%`, animation: 'bar .8s ease' }} />
              <div style={{ fontSize: 10, color: C.label }}>{p.m}</div>
            </div>
          ))}
        </div>
      </div>

      <Label>Rendez-vous</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {HEALTH.rdv.map((r) => (
          <div key={r[0]} style={{ display: 'flex', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
            <div style={{ textAlign: 'center', flex: 'none', width: 46 }}>
              <div style={{ fontFamily: serif, fontSize: 18, lineHeight: 1 }}>{r[0]}</div>
            </div>
            <div style={{ borderLeft: `1px solid ${C.track}`, paddingLeft: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{r[1]}</div>
              <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>{r[2]}</div>
            </div>
          </div>
        ))}
      </div>

      <div onClick={() => goScreen('healthphoto')} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, background: C.tile, borderRadius: 16, padding: '15px 16px', cursor: 'pointer' }}>
        <div style={{ fontSize: 18 }}>🔬</div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Analyser un symptôme par photo</div>
        <div style={{ color: C.label, fontSize: 20 }}>›</div>
      </div>
    </Screen>
  )
}
