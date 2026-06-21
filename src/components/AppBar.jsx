import { C, serif } from '../theme'

const circleBtn = {
  width: 38, height: 38, borderRadius: '50%', border: `1px solid ${C.cardBorder}`,
  boxShadow: C.cardShadow, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flex: 'none', background: C.cream,
}

export default function AppBar({ title, showBack, onBack, onHelp }) {
  return (
    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 12px', background: C.cream, zIndex: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {showBack && (
          <button className="reset" aria-label="Retour" onClick={onBack} style={{ ...circleBtn, fontSize: 18 }}>‹</button>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 25, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        </div>
      </div>
      <button className="reset" aria-label="Aide" onClick={onHelp} style={{ ...circleBtn, fontSize: 14, fontWeight: 700 }}>?</button>
    </div>
  )
}
