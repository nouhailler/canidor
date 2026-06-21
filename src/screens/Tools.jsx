import { C } from '../theme'
import { useChrome } from '../store/ChromeContext'
import { Screen, IconTile } from '../components/ui'
import { TOOL_GROUPS } from '../data/tools'

export default function Tools() {
  const { goScreen } = useChrome()
  return (
    <Screen>
      <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, marginBottom: 22 }}>
        Toutes les fonctions intelligentes pour comprendre et accompagner Stanley.
      </div>
      {TOOL_GROUPS.map((g) => (
        <div key={g.label} style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 12 }}>{g.label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {g.items.map((t) => (
              <div key={t.title} onClick={() => goScreen(t.id)} className="hoverable" style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 96 }}>
                <IconTile size={38} radius={11} fontSize={18} tint={g.tint}>{t.icon}</IconTile>
                <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25 }}>{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Screen>
  )
}
