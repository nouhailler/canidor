// Cache local des dépistages conseillés générés par l'IA, par race (écran
// Maladies génétiques). Conservé jusqu'à régénération explicite.

const LS = 'canidor_breed_screenings'

function readAll() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function loadScreenings(nom) {
  return readAll()[String(nom).toLowerCase()] || null
}

export function saveScreenings(nom, text) {
  try {
    const all = readAll()
    all[String(nom).toLowerCase()] = text
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore (quota / mode privé) */ }
}

export function removeScreenings(nom) {
  try {
    const all = readAll()
    delete all[String(nom).toLowerCase()]
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore */ }
}

// Découpe un texte en puces en une liste de dépistages.
export function parseScreenings(text) {
  return String(text || '')
    .split('\n')
    .map((l) => l.replace(/^\s*[-*•\d.)]+\s*/, '').trim())
    .filter((l) => l.length > 1)
    .slice(0, 12)
}
