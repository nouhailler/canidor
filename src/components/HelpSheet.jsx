import { C, serif } from '../theme'
import { HELP } from '../data/help'

export default function HelpSheet({ screen, title, onClose }) {
  const help = HELP[screen] || HELP.home
  const tips = (help.tips || []).map((t, i) => ({ n: i + 1, title: t[0], body: t[1] }))

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(16,15,13,.45)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', background: C.cream, borderRadius: '26px 26px 0 0', padding: '10px 24px 36px', animation: 'sheetup .32s cubic-bezier(.2,.8,.2,1)', maxHeight: '86%', overflowY: 'auto' }}
      >
        <div style={{ width: 38, height: 4, borderRadius: 2, background: C.grayB, margin: '8px auto 18px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.espresso, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flex: 'none' }}>?</div>
          <div style={{ fontFamily: serif, fontSize: 26 }}>{`Aide — ${title}`}</div>
        </div>
        <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5, margin: '8px 0 18px' }}>{help.intro}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tips.map((t) => (
            <div key={t.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: C.tile, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.body, flex: 'none' }}>{t.n}</div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.5, marginTop: 2 }}>{t.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: C.tile, borderRadius: 14, padding: '13px 14px', fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
          ⚠ Les analyses par IA sont indicatives et ne remplacent jamais l'avis d'un vétérinaire ou d'un éducateur professionnel.
        </div>
        <button className="reset" onClick={onClose} style={{ width: '100%', marginTop: 18, background: C.accent, color: C.onAccent, borderRadius: 999, padding: 15, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          J'ai compris
        </button>
      </div>
    </div>
  )
}
