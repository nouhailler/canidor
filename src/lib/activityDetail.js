// Cache local des détails d'activité générés par l'IA (écran Activités du jour).
// Une activité détaillée (matériel, étapes, conseil) est conservée jusqu'à
// régénération explicite, pour éviter un appel à chaque ouverture de la fiche.

const LS = 'canidor_activity_details'

function readAll() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function loadDetail(titre) {
  return readAll()[String(titre).toLowerCase()] || null
}

export function saveDetail(titre, data) {
  try {
    const all = readAll()
    all[String(titre).toLowerCase()] = data
    localStorage.setItem(LS, JSON.stringify(all))
  } catch { /* ignore (quota / mode privé) */ }
}

// Parse la réponse IA (objet JSON éventuellement entouré de texte) en détail
// structuré. Lève si le JSON est introuvable/invalide.
export function parseDetail(text) {
  const s = text.indexOf('{')
  const e = text.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('Réponse IA illisible.')
  const o = JSON.parse(text.slice(s, e + 1))
  const arr = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [])
  return {
    materiel: arr(o.materiel),
    etapes: arr(o.etapes),
    conseil: String(o.conseil || '').trim(),
  }
}
