// Extraction d'images (frames) depuis une vidéo, côté navigateur. Les API de
// chat multimodales n'ingèrent pas de flux vidéo : on échantillonne quelques
// images réparties dans la durée et on les envoie comme photos au modèle vision.

// Ouvre le sélecteur de fichier vidéo et renvoie le File via onPick.
export function pickVideoFile(onPick, onError) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'video/*'
  input.onchange = () => {
    const file = input.files && input.files[0]
    if (!file) return
    if (!file.type.startsWith('video/')) { onError && onError('Le fichier doit être une vidéo.'); return }
    onPick(file)
  }
  input.click()
}

function seek(video, time) {
  return new Promise((resolve, reject) => {
    let settled = false
    const done = () => { if (settled) return; settled = true; video.removeEventListener('seeked', done); resolve() }
    const fail = () => { if (settled) return; settled = true; reject(new Error('Lecture de la vidéo impossible.')) }
    video.addEventListener('seeked', done)
    video.addEventListener('error', fail)
    setTimeout(done, 3000) // garde-fou si l'événement seeked ne se déclenche pas
    video.currentTime = time
  })
}

// Extrait `count` frames réparties dans la vidéo → tableau de data URLs JPEG.
export async function extractFrames(file, count = 3, maxSize = 640) {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = url
  try {
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve
      video.onerror = () => reject(new Error('Vidéo illisible (format non supporté ?).'))
    })
    const duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    const times = duration
      ? Array.from({ length: count }, (_, i) => duration * ((i + 0.5) / count))
      : [0]

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const frames = []
    for (const t of times) {
      await seek(video, Math.min(t, Math.max(0, (video.duration || 0.2) - 0.05)))
      const vw = video.videoWidth || 0
      const vh = video.videoHeight || 0
      if (!vw || !vh) continue
      const scale = Math.min(1, maxSize / Math.max(vw, vh))
      canvas.width = Math.round(vw * scale)
      canvas.height = Math.round(vh * scale)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      frames.push(canvas.toDataURL('image/jpeg', 0.7))
    }
    if (!frames.length) throw new Error('Aucune image exploitable dans la vidéo.')
    return frames
  } finally {
    URL.revokeObjectURL(url)
  }
}
