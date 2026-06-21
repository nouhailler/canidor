// OpenRouter integration. The user's key never leaves the device except in the
// Authorization header of direct requests to openrouter.ai.

const BASE = 'https://openrouter.ai/api/v1'

export const LS_KEY = 'canidor_or_key'
export const LS_MODEL = 'canidor_or_model'

export function keyFormatValid(k) {
  const key = (k || '').trim()
  return /^sk-or-/.test(key) && key.length >= 16
}

// Validate a key against the real endpoint.
// Returns { status: 'valid'|'invalid'|'error', msg }
export async function validateKey(rawKey) {
  const k = (rawKey || '').trim()
  if (!keyFormatValid(k)) {
    return { status: 'invalid', msg: 'Format invalide : la clé doit commencer par « sk-or-… ».' }
  }
  try {
    const r = await fetch(`${BASE}/auth/key`, { headers: { Authorization: 'Bearer ' + k } })
    if (r.ok) return { status: 'valid', msg: 'Clé validée auprès d’OpenRouter.' }
    return { status: 'invalid', msg: 'Clé refusée par OpenRouter (code ' + r.status + ').' }
  } catch {
    // Network/CORS fallback: keep the key but flag it.
    return { status: 'valid', msg: 'Clé enregistrée (vérification réseau indisponible ici).' }
  }
}

// Load the free models dynamically: pricing.prompt === "0".
// Returns array of { id, name, tag } or null on failure (caller keeps fallback).
export async function fetchFreeModels(rawKey) {
  try {
    const headers = {}
    const k = (rawKey || '').trim()
    if (k) headers.Authorization = 'Bearer ' + k
    const r = await fetch(`${BASE}/models`, { headers })
    if (!r.ok) return null
    const json = await r.json()
    const list = (json.data || [])
      .filter((m) => m && m.pricing && m.pricing.prompt === '0' && /:free$/.test(m.id))
      .map((m) => ({
        id: m.id,
        name: prettyName(m),
        tag: providerTag(m.id),
      }))
    return list.length ? list : null
  } catch {
    return null
  }
}

function prettyName(m) {
  if (m.name) return m.name.replace(/\s*\(free\)\s*/i, '').trim()
  const last = m.id.split('/').pop().replace(':free', '')
  return last
}

function providerTag(id) {
  const p = id.split('/')[0]
  const map = {
    deepseek: 'DeepSeek', 'meta-llama': 'Meta', google: 'Google',
    qwen: 'Alibaba', mistralai: 'Mistral', microsoft: 'Microsoft',
    nousresearch: 'Nous', gryphe: 'Gryphe', openchat: 'OpenChat',
  }
  return map[p] || p
}

// Chat completion. messages: OpenAI-style array. Returns assistant text.
export async function chatCompletion({ key, model, messages, signal, maxTokens = 700 }) {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    signal,
    headers: {
      Authorization: 'Bearer ' + (key || '').trim(),
      'Content-Type': 'application/json',
      'HTTP-Referer': location.origin,
      'X-Title': 'Canidor',
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.6 }),
  })
  if (!r.ok) {
    let detail = ''
    try {
      const e = await r.json()
      detail = e?.error?.message || ''
    } catch { /* ignore */ }
    throw new Error(detail || `Erreur OpenRouter (code ${r.status}).`)
  }
  const json = await r.json()
  return json?.choices?.[0]?.message?.content?.trim() || ''
}

// Helper to build a vision message with an optional image (data URL).
export function visionMessage(text, imageDataUrl) {
  if (!imageDataUrl) return { role: 'user', content: text }
  return {
    role: 'user',
    content: [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: imageDataUrl } },
    ],
  }
}
