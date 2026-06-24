// Fournisseurs IA « vision » (analyse photo/vidéo) en complément d'OpenRouter,
// dont les modèles gratuits ne savent pas analyser d'images.
//
// L'utilisateur fournit sa propre clé OpenAI / Anthropic / Google ; les appels
// partent directement du navigateur vers le fournisseur (la clé ne transite que
// dans l'en-tête d'autorisation, comme pour OpenRouter). Anthropic exige
// l'en-tête « anthropic-dangerous-direct-browser-access » pour autoriser CORS.

import { systemPrompt } from './prompts'

export const VISION_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...', keysUrl: 'https://platform.openai.com/api-keys' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...', keysUrl: 'https://console.anthropic.com/settings/keys' },
  { id: 'google', name: 'Google', placeholder: 'AIza...', keysUrl: 'https://aistudio.google.com/app/apikey' },
]

export const providerName = (id) => (VISION_PROVIDERS.find((p) => p.id === id) || {}).name || id

/* ---------------- listing des modèles (vision) ---------------- */

// OpenAI : on ne garde que les familles multimodales et on écarte les variantes
// non pertinentes (audio, embeddings, image-gen, modération…).
const OPENAI_VISION = /(gpt-4o|gpt-4\.1|gpt-4-turbo|gpt-5|chatgpt-4o|o1|o3|o4)/
const OPENAI_EXCLUDE = /(audio|realtime|transcribe|tts|embedding|moderation|image|dall|search|codex|instruct)/

async function listOpenAI(key) {
  const r = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: 'Bearer ' + key } })
  if (!r.ok) throw new Error(`OpenAI a refusé la clé (code ${r.status}).`)
  const j = await r.json()
  return (j.data || [])
    .map((m) => m.id)
    .filter((id) => OPENAI_VISION.test(id) && !OPENAI_EXCLUDE.test(id))
    .sort()
    .reverse()
    .map((id) => ({ id, name: id }))
}

async function listAnthropic(key) {
  const r = await fetch('https://api.anthropic.com/v1/models?limit=100', {
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
  })
  if (!r.ok) throw new Error(`Anthropic a refusé la clé (code ${r.status}).`)
  const j = await r.json()
  // Tous les modèles Claude 3+ sont multimodaux (vision).
  return (j.data || []).map((m) => ({ id: m.id, name: m.display_name || m.id }))
}

async function listGoogle(key) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`)
  if (!r.ok) throw new Error(`Google a refusé la clé (code ${r.status}).`)
  const j = await r.json()
  return (j.models || [])
    .filter((m) => /gemini/.test(m.name || '') && (m.supportedGenerationMethods || []).includes('generateContent'))
    .map((m) => ({ id: (m.name || '').replace(/^models\//, ''), name: m.displayName || (m.name || '').replace(/^models\//, '') }))
}

export async function fetchVisionModels(provider, key) {
  const k = (key || '').trim()
  if (!k) return []
  if (provider === 'openai') return listOpenAI(k)
  if (provider === 'anthropic') return listAnthropic(k)
  if (provider === 'google') return listGoogle(k)
  return []
}

// Valide une clé en listant les modèles. { status:'valid'|'invalid', msg, models }
export async function validateVisionKey(provider, key) {
  try {
    const models = await fetchVisionModels(provider, key)
    if (!models.length) return { status: 'invalid', msg: 'Aucun modèle vision disponible avec cette clé.', models: [] }
    return { status: 'valid', msg: `Clé validée · ${models.length} modèle(s) disponible(s).`, models }
  } catch (e) {
    return { status: 'invalid', msg: e.message || 'Clé refusée par le fournisseur.', models: [] }
  }
}

/* ---------------- appel d'analyse (texte + image) ---------------- */

// Sépare une data URL "data:<mime>;base64,<data>" → { media, data }.
function splitDataUrl(url) {
  const m = /^data:(.*?);base64,(.*)$/.exec(url || '')
  return m ? { media: m[1], data: m[2] } : null
}

async function completeOpenAI({ key, model, system, instruction, image, signal, maxTokens }) {
  const content = image
    ? [{ type: 'text', text: instruction }, { type: 'image_url', image_url: { url: image } }]
    : instruction
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', signal,
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'system', content: system }, { role: 'user', content }] }),
  })
  if (!r.ok) throw new Error(await errMsg(r, 'OpenAI'))
  const j = await r.json()
  return j?.choices?.[0]?.message?.content?.trim() || ''
}

async function completeAnthropic({ key, model, system, instruction, image, signal, maxTokens }) {
  const parts = [{ type: 'text', text: instruction }]
  const img = splitDataUrl(image)
  if (img) parts.unshift({ type: 'image', source: { type: 'base64', media_type: img.media, data: img.data } })
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal,
    headers: {
      'x-api-key': key, 'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true', 'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: parts }] }),
  })
  if (!r.ok) throw new Error(await errMsg(r, 'Anthropic'))
  const j = await r.json()
  return (j?.content || []).map((c) => c.text || '').join('').trim()
}

async function completeGoogle({ key, model, system, instruction, image, signal, maxTokens }) {
  const parts = [{ text: instruction }]
  const img = splitDataUrl(image)
  if (img) parts.push({ inline_data: { mime_type: img.media, data: img.data } })
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  })
  if (!r.ok) throw new Error(await errMsg(r, 'Google'))
  const j = await r.json()
  return (j?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim()
}

async function errMsg(r, label) {
  try {
    const e = await r.json()
    return e?.error?.message || `Erreur ${label} (code ${r.status}).`
  } catch {
    return `Erreur ${label} (code ${r.status}).`
  }
}

// Appel unifié : analyse texte + image via le fournisseur choisi.
export async function visionComplete({ provider, key, model, dog, instruction, image, signal, maxTokens = 800 }) {
  const args = { key: (key || '').trim(), model, system: systemPrompt(dog), instruction, image, signal, maxTokens }
  if (provider === 'openai') return completeOpenAI(args)
  if (provider === 'anthropic') return completeAnthropic(args)
  if (provider === 'google') return completeGoogle(args)
  throw new Error('Fournisseur vision inconnu.')
}
