// Canidor design tokens — single source of truth (from design handoff README + prototype).
export const C = {
  cream: '#F5EFE4',        // app background
  espresso: '#2A211B',     // ink / hero / dark cards / letterbox
  onDark: '#F5EFE4',       // text on dark
  accent: '#C2603C',       // primary accent (buttons, active tab, links)
  onAccent: '#FFF7F0',     // text on accent
  card: '#FFFFFF',         // card surface
  cardBorder: '#ECDFCB',   // card border
  cardShadow: '0 2px 14px rgba(86,56,24,.05)',
  tile: '#F4E8D5',         // default icon tile / info note
  track: '#E9DBC6',        // progress track / segments
  body: '#564B40',         // body text
  sub: '#897A67',          // secondary text
  label: '#A89878',        // tertiary / labels
  faint: '#9B8A74',        // faint text on dark
  grayA: '#D7C7AF',
  grayB: '#DBCBB2',
  grayC: '#B6A488',
  success: '#4E9A66',
  successDk: '#4E7A45',
  successDk2: '#3F6B4E',
  successBg: '#E7F0E2',
  warn: '#BC7A2C',
  danger: '#B0543E',
  dangerBg: '#F7E6DA',
  dangerBorder: '#E6C2AE',
  tabActiveBg: '#F6E2D8',
  navInactive: '#B6A488',
  // pastel section tints (Fonctions)
  tintSable: '#F3E2C6',
  tintSauge: '#E2ECDA',
  tintBlush: '#F4DFD7',
  tintMenthe: '#DBEAE0',
  tintArgile: '#F0E1CC',
  tintCiel: '#DDE7EF',
  tintLilas: '#E7E1EF',
}

export const serif = "'Instrument Serif', serif"
export const mono = 'ui-monospace, monospace'

// Striped placeholder background (replaces missing photos).
export const stripes = (a, b, w = 11) =>
  `repeating-linear-gradient(45deg,${a},${a} ${w}px,${b} ${w}px,${b} ${w * 2}px)`

export const placeholderLight = stripes('#ECDECA', '#E1D1B7')
export const placeholderDark = stripes('#3A2C20', '#2F2316')
export const placeholderUpload = stripes('#F1E6D4', '#E5D6C0')

export const card = {
  background: C.card,
  border: `1px solid ${C.cardBorder}`,
  boxShadow: C.cardShadow,
}
