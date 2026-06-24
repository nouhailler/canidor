// Cache local des explications de pathologies générées par l'IA (problèmes de
// santé fréquents, écran Fiche de race). Indexé par nom de pathologie : une
// même condition est réutilisable d'une race à l'autre, jusqu'à régénération.

const LS = 'canidor_health_info'

function readAll() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function loadInfo(cond) {
  return readAll()[String(cond).toLowerCase()] || null
}

export function saveInfo(cond, text) {
  try {
    const all = readAll()
    all[String(cond).toLowerCase()] = text
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore (quota / mode privé) */ }
}

export function removeInfo(cond) {
  try {
    const all = readAll()
    delete all[String(cond).toLowerCase()]
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore */ }
}
