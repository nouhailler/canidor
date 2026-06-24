// Cache local des explications de dépistages générées par l'IA (écran Maladies
// génétiques). Indexé par nom de dépistage, jusqu'à régénération explicite.

const LS = 'canidor_screening_info'

function readAll() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function loadInfo(test) {
  return readAll()[String(test).toLowerCase()] || null
}

export function saveInfo(test, text) {
  try {
    const all = readAll()
    all[String(test).toLowerCase()] = text
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore (quota / mode privé) */ }
}

export function removeInfo(test) {
  try {
    const all = readAll()
    delete all[String(test).toLowerCase()]
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore */ }
}
