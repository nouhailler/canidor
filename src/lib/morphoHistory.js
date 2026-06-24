// Historique local des analyses morphologiques. Chaque entrée garde les
// caractéristiques observées et les races estimées, pour pouvoir les revoir
// ou les recharger plus tard.

const LS = 'canidor_morpho_history'

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS) || '[]') } catch { return [] }
}

function persist(list) {
  try { localStorage.setItem(LS, JSON.stringify(list)) } catch { /* ignore (quota / mode privé) */ }
  return list
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

// Ajoute une recherche en tête de liste (max 50) et renvoie la nouvelle liste.
export function addEntry(prev, { fields, results }) {
  const entry = { id: uid(), date: new Date().toISOString(), fields: { ...fields }, results: results.map((r) => ({ name: r.name, pct: r.pct })) }
  return persist([entry, ...prev].slice(0, 50))
}

export function removeEntry(prev, id) {
  return persist(prev.filter((h) => h.id !== id))
}

export function clearHistory() {
  return persist([])
}
