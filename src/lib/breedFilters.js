// Helpers de filtrage du catalogue : extraction de valeurs numériques depuis
// les champs texte (taille, poids, espérance de vie) et lecture des traits
// chiffrés (énergie, éducation, sociabilité, entretien du poil).

const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// "61–67 cm" / "32-45 kg" / "10 à 13 ans" → [lo, hi] ; un seul nombre → [n, n].
export function parseRange(str) {
  const nums = String(str || '').replace(',', '.').match(/\d+(?:\.\d+)?/g)
  if (!nums || !nums.length) return null
  const a = parseFloat(nums[0])
  const b = nums[1] != null ? parseFloat(nums[1]) : a
  return [Math.min(a, b), Math.max(a, b)]
}

// Intervalle [lo, hi] d'un attribut physique d'une race ('taille'|'poids'|'vie').
export function breedRange(b, key) {
  return parseRange(b[key])
}

// Valeur 0–100 d'un trait, repéré par sous-chaîne normalisée (ex. 'sociab').
export function traitValue(b, match) {
  const t = (b.traits || []).find((x) => norm(x[0]).includes(match))
  return t ? Number(t[1]) : null
}

// Bornes [min, max] d'un attribut sur l'ensemble du catalogue (pour calibrer
// les curseurs). Renvoie null si aucune race n'a de valeur exploitable.
export function metricBounds(breeds, key) {
  let lo = Infinity, hi = -Infinity
  for (const b of breeds) {
    const r = breedRange(b, key)
    if (!r) continue
    lo = Math.min(lo, r[0]); hi = Math.max(hi, r[1])
  }
  if (lo === Infinity) return null
  return [Math.floor(lo), Math.ceil(hi)]
}

// Une recherche matche-t-elle une race (nom, origine ou tempérament) ?
export function breedMatches(b, needle) {
  const n = norm(needle)
  if (!n) return true
  return (
    norm(b.nom).includes(n) ||
    norm(b.origine).includes(n) ||
    (b.tags || []).some((t) => norm(t).includes(n))
  )
}
