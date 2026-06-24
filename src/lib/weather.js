// Météo réelle selon la localisation de l'appareil.
// - Géolocalisation : navigator.geolocation (permission utilisateur).
// - Données : Open-Meteo (gratuit, sans clé, CORS) → température + code WMO.
// - Lieu : BigDataCloud reverse-geocode (gratuit, sans clé, best-effort).
// Aucune de ces sources n'est bloquante : en cas d'échec/refus, l'appelant
// retombe sur une météo de repli (voir ActivityContext).

// Libellé + emoji par code météo WMO (https://open-meteo.com/en/docs).
const WMO = {
  0: ['Ensoleillé', '☀'], 1: ['Plutôt clair', '🌤'], 2: ['Nuageux', '⛅'], 3: ['Couvert', '☁'],
  45: ['Brouillard', '🌫'], 48: ['Brouillard givrant', '🌫'],
  51: ['Bruine légère', '🌦'], 53: ['Bruine', '🌦'], 55: ['Bruine dense', '🌦'],
  56: ['Bruine verglaçante', '🌧'], 57: ['Bruine verglaçante', '🌧'],
  61: ['Pluie faible', '🌧'], 63: ['Pluie', '🌧'], 65: ['Pluie forte', '🌧'],
  66: ['Pluie verglaçante', '🌧'], 67: ['Pluie verglaçante', '🌧'],
  71: ['Neige faible', '🌨'], 73: ['Neige', '🌨'], 75: ['Neige forte', '🌨'], 77: ['Grésil', '🌨'],
  80: ['Averses', '🌦'], 81: ['Averses', '🌧'], 82: ['Fortes averses', '🌧'],
  85: ['Averses de neige', '🌨'], 86: ['Averses de neige', '🌨'],
  95: ['Orage', '⛈'], 96: ['Orage de grêle', '⛈'], 99: ['Orage de grêle', '⛈'],
}

function condOf(code) {
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  if ([95, 96, 99].includes(code)) return 'storm'
  if ([45, 48].includes(code)) return 'fog'
  if ([2, 3].includes(code)) return 'clouds'
  return 'clear'
}

// Construit l'objet météo normalisé partagé dans l'app.
// outdoorOK : conditions correctes pour une vraie sortie extérieure.
export function buildWeather(code, temp, place = '') {
  const [label, icon] = WMO[code] || ['Temps variable', '🌡']
  const cond = condOf(code)
  const wet = cond === 'rain' || cond === 'snow' || cond === 'storm'
  const extreme = temp <= 1 || temp >= 32
  return { label, icon, temp, cond, place, outdoorOK: !wet && !extreme }
}

function getPosition(timeout = 8000) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) { reject(new Error('Géolocalisation indisponible.')); return }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout, maximumAge: 30 * 60 * 1000 })
  })
}

async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`)
    if (!r.ok) return ''
    const j = await r.json()
    return j.city || j.locality || j.principalSubdivision || ''
  } catch { return '' }
}

// Récupère la météo courante là où se trouve l'utilisateur.
// Lève une erreur si la position est refusée/indisponible ou l'API en échec.
export async function getLocationWeather() {
  const pos = await getPosition()
  const { latitude, longitude } = pos.coords
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`)
  if (!r.ok) throw new Error('Service météo indisponible.')
  const j = await r.json()
  const cur = j.current || {}
  if (cur.temperature_2m == null) throw new Error('Données météo manquantes.')
  const place = await reverseGeocode(latitude, longitude)
  return buildWeather(Number(cur.weather_code) || 0, Math.round(cur.temperature_2m), place)
}
