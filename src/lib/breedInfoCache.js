// Cache local des compléments d'information de race générés par l'IA (écran
// Fiche de race). Une fois enregistrée, la fiche IA d'une race est réaffichée
// sans nouvel appel, jusqu'à régénération explicite.

const LS = 'canidor_breed_info'

function readAll() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function loadInfo(nom) {
  return readAll()[String(nom).toLowerCase()] || null
}

export function saveInfo(nom, text) {
  try {
    const all = readAll()
    all[String(nom).toLowerCase()] = text
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore (quota / mode privé) */ }
}

export function removeInfo(nom) {
  try {
    const all = readAll()
    delete all[String(nom).toLowerCase()]
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore */ }
}
