import { C } from '../theme'

// Faux iOS status bar (9:41, signal, 5G, battery).
export default function StatusBar() {
  return (
    <div style={{ flex: 'none', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 14, fontWeight: 600, background: C.cream, zIndex: 5 }}>
      <span>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, letterSpacing: '1px' }}>●●●●</span>
        <span style={{ fontSize: 12 }}>5G</span>
        <div style={{ width: 24, height: 12, border: `1.5px solid ${C.espresso}`, borderRadius: 3, padding: 1.5, position: 'relative' }}>
          <div style={{ width: '70%', height: '100%', background: C.espresso, borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 5, background: C.espresso, borderRadius: '0 1px 1px 0' }} />
        </div>
      </div>
    </div>
  )
}
