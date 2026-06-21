import { C, serif, mono, card, placeholderLight, placeholderUpload, placeholderDark } from '../theme'

// ---- layout shells ----
export function Screen({ children, flush = false, style }) {
  // Standard padded screen with the rise animation. flush removes h-padding for hero images.
  return (
    <div style={{ padding: flush ? '0' : '4px 20px 0', animation: 'rise .35s ease', ...style }}>
      {children}
    </div>
  )
}

export function Intro({ children }) {
  return <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.5 }}>{children}</div>
}

export function SectionLabel({ children, style }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: C.label, fontWeight: 600, ...style }}>
      {children}
    </div>
  )
}

export function Card({ children, onClick, hoverable, style }) {
  return (
    <div
      onClick={onClick}
      className={hoverable ? 'hoverable' : undefined}
      style={{ ...card, borderRadius: 14, padding: 14, cursor: onClick ? 'pointer' : undefined, ...style }}
    >
      {children}
    </div>
  )
}

export function Hero({ children, style }) {
  return (
    <div style={{ background: C.espresso, color: C.onDark, borderRadius: 22, padding: 22, ...style }}>
      {children}
    </div>
  )
}

// ---- buttons ----
export function PrimaryButton({ children, onClick, style }) {
  return (
    <button
      className="reset"
      onClick={onClick}
      style={{ width: '100%', background: C.accent, color: C.onAccent, borderRadius: 999, padding: 16, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 48, ...style }}
    >
      {children}
    </button>
  )
}

export function OutlineButton({ children, onClick, style }) {
  return (
    <button
      className="reset"
      onClick={onClick}
      style={{ width: '100%', border: `1px solid ${C.grayB}`, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...style }}
    >
      {children}
    </button>
  )
}

// "↻ Régénérer" style ghost button
export function RegenButton({ children, onClick }) {
  return <OutlineButton onClick={onClick}>↻ {children}</OutlineButton>
}

// ---- notes / disclaimers ----
export function TipNote({ children, style }) {
  return (
    <div style={{ background: C.tile, borderRadius: 14, padding: '15px 16px', fontSize: 13, color: C.body, lineHeight: 1.55, ...style }}>
      {children}
    </div>
  )
}

export function VetDisclaimer({ children }) {
  return (
    <div style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: 14, padding: 14, fontSize: 12.5, color: C.danger, lineHeight: 1.5 }}>
      ⚠ {children || "Cette analyse ne remplace pas l'avis d'un vétérinaire. En cas de doute, consultez."}
    </div>
  )
}

// ---- bars ----
export function Bar({ value, color = C.espresso, track = C.track, height = 6, animate = true }) {
  return (
    <div style={{ height, background: track, borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, borderRadius: height / 2, width: `${value}%`, animation: animate ? 'bar .8s ease' : undefined }} />
    </div>
  )
}

export function TraitRow({ label, value, suffix = '%', color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: color || C.label, fontWeight: color ? 600 : 400 }}>{value}{suffix}</span>
      </div>
      <Bar value={value} color={color || C.espresso} />
    </div>
  )
}

// ---- tiles & avatars ----
export function IconTile({ children, tint = C.tile, size = 38, radius = 11, fontSize = 18, style }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, flex: 'none', ...style }}>
      {children}
    </div>
  )
}

export function Avatar({ size = 58, radius = 16, fontSize = 26, letter = 'B' }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, flex: 'none', background: 'repeating-linear-gradient(45deg,#3A2C20,#3A2C20 7px,#2F2316 7px,#2F2316 14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize, color: C.faint }}>
      {letter}
    </div>
  )
}

// ---- placeholders ----
export function PhotoPlaceholder({ caption, height = 150, radius = 20, align = 'center', dashed = false, style }) {
  return (
    <div
      style={{
        height,
        borderRadius: radius,
        background: placeholderLight,
        border: dashed ? `1.5px dashed ${C.grayA}` : undefined,
        display: 'flex',
        alignItems: align === 'bottom' ? 'flex-end' : 'center',
        justifyContent: 'center',
        paddingBottom: align === 'bottom' ? 10 : 0,
        ...style,
      }}
    >
      <span style={{ fontFamily: mono, fontSize: 11, color: C.label, letterSpacing: '.05em' }}>{caption}</span>
    </div>
  )
}

// Upload dropzone (dashed warm stripes + circular icon)
export function UploadBox({ icon, caption, height = 280 }) {
  return (
    <div style={{ height, borderRadius: 22, border: `1.5px dashed ${C.grayA}`, background: placeholderUpload, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 14px rgba(0,0,0,.08)' }}>{icon}</div>
      <span style={{ fontFamily: mono, fontSize: 11, color: C.label }}>{caption}</span>
    </div>
  )
}

// Analyzing overlay with scanline + spinner
export function ScanBox({ label, height = 280, scanDur = '1.6s' }) {
  return (
    <div style={{ height, borderRadius: 22, overflow: 'hidden', position: 'relative', background: placeholderDark }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'linear-gradient(90deg,transparent,#F5EFE4,transparent)', boxShadow: '0 0 14px #F5EFE4', animation: `scanline ${scanDur} ease-in-out infinite alternate` }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: C.onDark }}>
        <div style={{ width: 32, height: 32, border: '3px solid #5A4636', borderTopColor: '#F5EFE4', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <div style={{ fontSize: 13, letterSpacing: '.05em', textAlign: 'center', padding: '0 24px' }}>{label}</div>
      </div>
    </div>
  )
}

// Pill / tag
export function Tag({ children, style }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color: C.body, background: C.tile, borderRadius: 999, padding: '5px 12px', ...style }}>
      {children}
    </span>
  )
}

// Selectable chip with active (espresso) / inactive (white) styling
export function Chip({ children, active, onClick, dashed, style }) {
  const base = active
    ? { background: C.espresso, color: C.onDark, border: `1px solid ${C.espresso}` }
    : { background: dashed ? 'transparent' : '#fff', color: dashed ? C.label : C.body, border: dashed ? `1px dashed ${C.grayB}` : `1px solid ${C.cardBorder}`, boxShadow: dashed ? undefined : C.cardShadow }
  return (
    <button className="reset" onClick={onClick} style={{ fontSize: 13, fontWeight: 600, borderRadius: 999, padding: '9px 14px', cursor: onClick ? 'pointer' : 'default', ...base, ...style }}>
      {children}
    </button>
  )
}

// Bullet list line: variant 'cause'|'do'|'avoid'|'plain'|'info'
const BULLETS = {
  cause: { mark: '•', color: C.warn },
  do: { mark: '✓', color: C.successDk },
  avoid: { mark: '✕', color: C.danger },
  plain: { mark: '•', color: C.espresso },
  info: { mark: '•', color: C.sub },
}
export function BulletLine({ variant = 'plain', children, boxed = false }) {
  const b = BULLETS[variant] || BULLETS.plain
  const inner = (
    <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.45, display: 'flex', gap: 9 }}>
      <span style={{ color: b.color, flex: 'none' }}>{b.mark}</span>
      <span>{children}</span>
    </div>
  )
  if (!boxed) return inner
  return <Card style={{ borderRadius: 12, padding: '12px 14px' }}>{inner}</Card>
}

export function StatTile({ k, v, color }) {
  return (
    <Card style={{ borderRadius: 14, padding: '13px 14px' }}>
      <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{k}</div>
      <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 4, color: color || C.espresso }}>{v}</div>
    </Card>
  )
}

export function Stack({ gap = 10, children, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{children}</div>
}
