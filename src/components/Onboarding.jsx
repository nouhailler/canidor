import { useState } from 'react'
import { C, serif } from '../theme'
import { OB } from '../data/datasets'
import { Logo } from './Logo'

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const ob = OB[step]
  const last = step >= OB.length - 1
  const next = () => (last ? onDone() : setStep((s) => s + 1))

  return (
    <div style={{ position: 'absolute', inset: 0, top: 44, background: C.espresso, color: C.cream, display: 'flex', flexDirection: 'column', zIndex: 40, animation: 'rise .4s ease' }}>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 9, padding: '26px 34px 0' }}>
        <Logo size={28} radius={9} />
        <div style={{ fontFamily: serif, fontSize: 23, letterSpacing: '.01em' }}>Canidor</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px' }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: C.faint, fontWeight: 600, marginBottom: 18 }}>{ob.kicker}</div>
        <div style={{ fontFamily: serif, fontSize: 46, lineHeight: 1.05, marginBottom: 18 }}>{ob.title}</div>
        <div style={{ fontSize: 16, lineHeight: 1.55, color: C.grayA, maxWidth: 300 }}>{ob.body}</div>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          {ob.features.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#EADECA' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.cream, flex: 'none' }} />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 'none', padding: '24px 34px 40px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {OB.map((_, i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? C.cream : '#4A3928' }} />
          ))}
        </div>
        <button className="reset" onClick={next} style={{ width: '100%', background: C.cream, color: C.espresso, borderRadius: 999, padding: 17, textAlign: 'center', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
          {last ? 'Commencer' : 'Continuer'}
        </button>
        <button className="reset" onClick={onDone} style={{ width: '100%', textAlign: 'center', marginTop: 16, color: C.faint, fontSize: 14, cursor: 'pointer' }}>
          Passer l'introduction
        </button>
      </div>
    </div>
  )
}
