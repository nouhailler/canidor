// Cache local des cas de comportement générés par l'IA (écran Assistant
// comportement). Évite de relancer une analyse à chaque sélection : une fois
// générée, une fiche est conservée jusqu'à régénération explicite.

const LS = 'canidor_behavior_cases'

function readAll() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function loadCase(name) {
  return readAll()[String(name).toLowerCase()] || null
}

export function saveCase(name, data) {
  try {
    const all = readAll()
    all[String(name).toLowerCase()] = data
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore (quota / mode privé) */ }
}

// Parse la réponse IA (objet JSON éventuellement entouré de texte) en fiche
// structurée. Lève si le JSON est introuvable/invalide.
export function parseCase(text) {
  const s = text.indexOf('{')
  const e = text.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('Réponse IA illisible.')
  const o = JSON.parse(text.slice(s, e + 1))
  const arr = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [])
  return {
    ctx: String(o.ctx || '').trim(),
    causes: arr(o.causes),
    exos: arr(o.exos),
    avoid: arr(o.avoid),
  }
}
