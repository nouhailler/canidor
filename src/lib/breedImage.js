// Sources d'image pour une fiche de race : Wikimédia (API publique CORS),
// import d'un fichier local (→ data URL) et recherche Google Images (lien).

// Récupère l'image principale d'une race depuis Wikipédia (FR puis EN en repli).
// Renvoie une URL d'image ou lève une erreur explicite.
export async function fetchWikimediaImage(name) {
  for (const lang of ['fr', 'en']) {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages` +
      `&piprop=thumbnail|original&pithumbsize=800&redirects=1&format=json&origin=*` +
      `&titles=${encodeURIComponent(name)}`
    try {
      const r = await fetch(url)
      if (!r.ok) continue
      const j = await r.json()
      const pages = j?.query?.pages || {}
      for (const k of Object.keys(pages)) {
        const src = pages[k]?.thumbnail?.source || pages[k]?.original?.source
        if (src) return src
      }
    } catch { /* on tente la langue suivante */ }
  }
  throw new Error(`Aucune image Wikimédia trouvée pour « ${name} ».`)
}

// Ouvre une recherche Google Images dans un nouvel onglet (l'utilisateur copie
// ensuite l'adresse de l'image puis la colle dans le champ URL).
export function openGoogleImages(name) {
  const q = encodeURIComponent(`${name} chien`)
  window.open(`https://www.google.com/search?tbm=isch&q=${q}`, '_blank', 'noopener,noreferrer')
}

// Ouvre le sélecteur de fichier et renvoie le contenu en data URL via onData.
export function pickImageFile(onData, onError) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files && input.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { onError && onError('Le fichier doit être une image.'); return }
    const reader = new FileReader()
    reader.onload = () => onData(String(reader.result))
    reader.onerror = () => onError && onError('Lecture du fichier impossible.')
    reader.readAsDataURL(file)
  }
  input.click()
}
