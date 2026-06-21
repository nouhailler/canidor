import { C } from '../theme'

// Terracotta rounded square with the cream paw mark.
export function Logo({ size = 28, radius = 9 }) {
  const paw = Math.round(size * 0.6)
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <Paw size={paw} />
    </div>
  )
}

export function Paw({ size = 17, fill = '#FFF7F0' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="none">
      <ellipse cx="7" cy="9.2" rx="1.6" ry="2.2" />
      <ellipse cx="12" cy="7.4" rx="1.7" ry="2.4" />
      <ellipse cx="17" cy="9.2" rx="1.6" ry="2.2" />
      <path d="M12 11.4c-2.4 0-4.3 1.9-4.3 3.9 0 1.7 1.4 2.8 3 2.8.6 0 .9-.2 1.3-.2s.7.2 1.3.2c1.6 0 3-1.1 3-2.8 0-2-1.9-3.9-4.3-3.9z" />
    </svg>
  )
}
