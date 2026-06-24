import { useEffect, useState } from 'react'
import { C, serif, mono } from '../theme'
import { useChrome } from '../store/ChromeContext'
import { useApp } from '../store/AppContext'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, UploadBox, PhotoPlaceholder, BreedPhoto, Tag, TraitRow, Bar, Chip, BulletLine, StatTile, TipNote, VetDisclaimer } from '../components/ui'
import CaptureScreen from '../components/CaptureScreen'
import { AIPanel } from '../components/ai'
import { COMPARE, NF, COMPAT_FIELDS, IDENTIFY_RESULT } from '../data/datasets'
import { useBreeds } from '../store/BreedsContext'
import { IMPORT_TEMPLATE, normalizeBreed } from '../lib/breeds'
import { MORPHO_OPTIONS, MORPHO_DEFAULTS, estimateBreeds } from '../lib/morpho'
import { INSTRUCTIONS } from '../lib/prompts'
import { fetchWikimediaImage, openGoogleImages, pickImageFile } from '../lib/breedImage'

/* ---------------- Identification photo (Capture IA) ---------------- */
export function Identify() {
  const { goScreen } = useChrome()
  const r = IDENTIFY_RESULT
  return (
    <CaptureScreen
      intro="Photographiez le chien entier, de profil et en pleine lumière pour un meilleur résultat."
      analyzingLabel="Analyse morphologique en cours…"
      scanDur="1.6s"
      buildInstruction={() => INSTRUCTIONS.identify}
      idle={({ start }) => (
        <>
          <div style={{ marginTop: 18 }}><UploadBox icon="📷" caption="déposer une photo" height={280} /></div>
          <div style={{ marginTop: 18 }}><PrimaryButton onClick={start}>Analyser la photo</PrimaryButton></div>
        </>
      )}
      result={({ reset }) => (
        <>
          <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Race principale</div>
            <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.1, marginTop: 8 }}>{r.race}</div>
            <div style={{ fontFamily: serif, fontSize: 52, lineHeight: 1, marginTop: 12 }}>{r.pct}</div>
            <div style={{ fontSize: 12, color: C.label }}>de correspondance</div>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {r.stats.map((s) => <StatTile key={s[0]} k={s[0]} v={s[1]} color={s[2] === 'ok' ? C.successDk : undefined} />)}
          </div>
          <div style={{ marginTop: 16 }}><PrimaryButton onClick={() => goScreen('fiche')}>Ouvrir la fiche de race</PrimaryButton></div>
          <div style={{ marginTop: 10 }}><OutlineButton onClick={reset}>Nouvelle photo</OutlineButton></div>
        </>
      )}
    />
  )
}

/* ---------------- Analyse morphologique (Rapport) ---------------- */
const morphoSelectStyle = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 10, padding: '11px 12px', fontSize: 15, fontWeight: 600, color: C.espresso, outline: 'none', marginTop: 4 }

export function Morpho() {
  const [done, setDone] = useState(false)
  const [fields, setFields] = useState(MORPHO_DEFAULTS)
  const [results, setResults] = useState([])
  const set = (k) => (e) => setFields((s) => ({ ...s, [k]: e.target.value }))
  const fieldsLine = MORPHO_OPTIONS.map((f) => `${f.k}: ${fields[f.k]}`).join(', ')

  if (!done) {
    return (
      <Screen>
        <Intro>Renseignez les caractéristiques observées. Plus elles sont précises, meilleure est l'estimation.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MORPHO_OPTIONS.map((f) => (
            <label key={f.k} style={{ display: 'block', background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{f.k}</div>
              <select style={morphoSelectStyle} value={fields[f.k]} onChange={set(f.k)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => { setResults(estimateBreeds(fields)); setDone(true) }}>Estimer la race</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <SectionLabel style={{ marginBottom: 14 }}>Races les plus probables</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {results.map((r) => (
          <div key={r.name} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '15px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{r.name}</span>
              <span style={{ fontFamily: serif, fontSize: 20 }}>{r.pct}%</span>
            </div>
            <Bar value={r.pct} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <AIPanel buildInstruction={() => INSTRUCTIONS.morpho(fieldsLine)} />
      </div>
      <div style={{ marginTop: 16 }}><OutlineButton onClick={() => setDone(false)}>Modifier les critères</OutlineButton></div>
    </Screen>
  )
}

/* ---------------- Comparateur (Calcul/Info double bars) ---------------- */
export function Compare() {
  return (
    <Screen>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: C.espresso, color: C.cream, borderRadius: 16, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.faint }}>{COMPARE.a.tag}</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4, lineHeight: 1.15 }}>{COMPARE.a.nom}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label }}>{COMPARE.b.tag}</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4, lineHeight: 1.15 }}>{COMPARE.b.nom}</div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {COMPARE.rows.map((row) => (
          <div key={row[0]}>
            <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{row[0]}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: C.sub, width: 26, textAlign: 'right', flex: 'none' }}>{row[1]}</span>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', background: '#F1EEE8', borderRadius: 4, height: 9, overflow: 'hidden' }}><div style={{ height: '100%', background: C.espresso, borderRadius: 4, width: `${row[1]}%` }} /></div>
              <div style={{ flex: 1, background: '#F1EEE8', borderRadius: 4, height: 9, overflow: 'hidden' }}><div style={{ height: '100%', background: C.grayC, borderRadius: 4, width: `${row[2]}%` }} /></div>
              <span style={{ fontSize: 11, color: C.sub, width: 26, flex: 'none' }}>{row[2]}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, display: 'flex', gap: 16, justifyContent: 'center', fontSize: 12, color: C.sub }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: C.espresso }} />{COMPARE.a.nom}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: C.grayC }} />{COMPARE.b.nom}</div>
      </div>
    </Screen>
  )
}

/* ---------------- Fiche de race ---------------- */
const ficheSelectStyle = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 12, padding: '12px 14px', fontSize: 16, fontWeight: 600, fontFamily: serif, color: C.espresso, outline: 'none' }
const entretienLabel = (traits) => {
  const t = traits.find((x) => /entretien/i.test(x[0]))
  if (!t) return null
  return t[1] >= 75 ? 'Élevé' : t[1] >= 50 ? 'Modéré' : 'Faible'
}

export function Fiche() {
  const { goScreen } = useChrome()
  const { dog } = useApp()
  const { breeds } = useBreeds()
  // Default to the user's own breed when it's in the catalogue, else the first.
  const initial = Math.max(0, breeds.findIndex((b) => b.nom === dog.race))
  const [sel, setSel] = useState(initial)
  const b = breeds[Math.min(sel, breeds.length - 1)]
  const entretien = entretienLabel(b.traits)
  const stats = [
    { k: 'Origine', v: b.origine }, { k: 'Groupe FCI', v: b.groupe },
    { k: 'Espérance de vie', v: b.vie }, { k: 'Poids adulte', v: b.poids },
    { k: 'Taille au garrot', v: b.taille }, ...(entretien ? [{ k: 'Entretien du poil', v: entretien }] : []),
  ]
  return (
    <Screen flush>
      <div style={{ margin: '0 20px' }}>
        <BreedPhoto src={b.image} caption={`photo · ${b.nom.toLowerCase()}`} height={150} radius={20} />
      </div>
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 6 }}>Choisir une race ({breeds.length})</div>
        <select style={ficheSelectStyle} value={Math.min(sel, breeds.length - 1)} onChange={(e) => setSel(Number(e.target.value))}>
          {breeds.map((br, i) => <option key={br.id} value={i}>{br.nom}</option>)}
        </select>
        {!!b.tags.length && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {b.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map((s) => <StatTile key={s.k} k={s.k} v={s.v} />)}
        </div>
        {!!b.histoire && (<>
          <SectionLabel style={{ marginTop: 24, marginBottom: 8 }}>Origine & histoire</SectionLabel>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: C.body }}>{b.histoire}</div>
        </>)}
        {!!b.traits.length && (<>
          <SectionLabel style={{ marginTop: 24, marginBottom: 14 }}>Caractère & besoins</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {b.traits.map((t) => <TraitRow key={t[0]} label={t[0]} value={t[1]} />)}
          </div>
        </>)}
        {!!b.sante.length && (<>
          <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Problèmes de santé fréquents</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {b.sante.map((s) => (
              <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 12, padding: '12px 14px', fontSize: 13.5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.danger, flex: 'none' }} />{s}
              </div>
            ))}
          </div>
        </>)}
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => goScreen('compare')}>Comparer à une autre race</PrimaryButton></div>
      </div>
    </Screen>
  )
}

/* ---------------- Catalogue des races (Liste/détail) ---------------- */
const SOURCE_LABEL = { user: 'Ajout', ai: 'IA', import: 'Import', dogapi: 'The Dog API' }
const catInput = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: C.espresso, outline: 'none' }

function ToolBtn({ active, onClick, children }) {
  return (
    <button className="reset" onClick={onClick} style={{ fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: '9px 13px', cursor: 'pointer', whiteSpace: 'nowrap', background: active ? C.espresso : '#fff', color: active ? C.cream : C.body, border: `1px solid ${active ? C.espresso : C.cardBorder}`, boxShadow: active ? undefined : C.cardShadow }}>
      {children}
    </button>
  )
}

export function Catalogue() {
  const { setDetail } = useChrome()
  const { breeds, loading, error, setError, removeBreed, resetCatalogue, importJSON, generateAI, importDogApi, addedCount } = useBreeds()
  const { aiReady } = useApp()
  const [selId, setSelId] = useState(null)
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('')
  const [panel, setPanel] = useState('') // '' | 'add' | 'ai' | 'import'

  const selected = breeds.find((b) => b.id === selId) || null

  useEffect(() => {
    if (!selected) { setDetail(null); return }
    setDetail({ title: selected.nom, onBack: () => setSelId(null) })
    return () => setDetail(null)
  }, [selected, setDetail])

  const groups = [...new Set(breeds.map((b) => b.groupe).filter((g) => g && g !== '—'))].sort()
  const needle = q.trim().toLowerCase()
  const filtered = breeds.filter((b) => {
    if (group && b.groupe !== group) return false
    if (!needle) return true
    return (
      b.nom.toLowerCase().includes(needle) ||
      b.origine.toLowerCase().includes(needle) ||
      b.tags.some((t) => t.toLowerCase().includes(needle))
    )
  })

  const togglePanel = (p) => { setError(''); setPanel((cur) => (cur === p ? '' : p)) }
  const openBreed = (id) => { setPanel(''); setSelId(id) }

  /* -------- detail view -------- */
  if (selected) {
    const b = selected
    const stats = [{ k: 'Origine', v: b.origine }, { k: 'Groupe FCI', v: b.groupe }, { k: 'Taille', v: b.taille }, { k: 'Poids', v: b.poids }, { k: 'Espérance de vie', v: b.vie }]
    const removable = b.source !== 'base'
    return (
      <Screen flush style={{ animation: 'rise .3s ease' }}>
        <div style={{ margin: '0 20px', position: 'relative' }}>
          <BreedPhoto src={b.image} caption={`photo · ${b.nom}`} height={170} radius={20} align="bottom" />
        </div>
        <div style={{ padding: '16px 20px 0' }}>
          <PhotoEditor breed={b} />
          <button className="reset" onClick={() => setSelId(null)} style={{ fontSize: 13, color: C.sub, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>‹ Toutes les races</button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: serif, fontSize: 29, lineHeight: 1 }}>{b.nom}</div>
            {b.source !== 'base' && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.accent }}>{SOURCE_LABEL[b.source] || b.source}</span>}
          </div>
          {!!b.tags.length && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>{b.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{stats.map((s) => <StatTile key={s.k} k={s.k} v={s.v} />)}</div>
          {!!b.histoire && (<>
            <SectionLabel style={{ marginTop: 24, marginBottom: 8 }}>Origine & histoire</SectionLabel>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: C.body }}>{b.histoire}</div>
          </>)}
          {!!b.traits.length && (<>
            <SectionLabel style={{ marginTop: 24, marginBottom: 14 }}>Caractère & besoins</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{b.traits.map((t) => <TraitRow key={t[0]} label={t[0]} value={t[1]} />)}</div>
          </>)}
          {!!b.note && <TipNote style={{ marginTop: 20 }}>{b.note}</TipNote>}
          {removable && (
            <button className="reset" onClick={() => { removeBreed(b.id); setSelId(null) }} style={{ marginTop: 18, width: '100%', textAlign: 'center', color: C.danger, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', border: `1px solid ${C.danger}`, borderRadius: 999, padding: 13 }}>
              Supprimer cette race
            </button>
          )}
        </div>
      </Screen>
    )
  }

  /* -------- list view -------- */
  return (
    <Screen>
      <Intro>Recherchez, filtrez, ajoutez ou importez des races. Touchez une carte pour sa fiche détaillée.</Intro>

      <input style={{ ...catInput, marginTop: 16 }} placeholder="Rechercher (nom, origine, tempérament)…" value={q} onChange={(e) => setQ(e.target.value)} />

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <ToolBtn active={panel === 'add'} onClick={() => togglePanel('add')}>＋ Ajouter</ToolBtn>
        <ToolBtn active={panel === 'ai'} onClick={() => togglePanel('ai')}>✨ Générer (IA)</ToolBtn>
        <ToolBtn active={panel === 'import'} onClick={() => togglePanel('import')}>⇪ Importer JSON</ToolBtn>
        <ToolBtn active={loading === 'dogapi'} onClick={() => importDogApi()}>{loading === 'dogapi' ? '⏳ Import…' : '🌐 The Dog API'}</ToolBtn>
      </div>

      {panel === 'add' && <AddPanel onDone={(id) => { setPanel(''); openBreed(id) }} />}
      {panel === 'ai' && <AIGenPanel aiReady={aiReady} loading={loading === 'ai'} onGenerate={generateAI} onDone={openBreed} />}
      {panel === 'import' && <ImportPanel onImport={importJSON} />}

      {error && <div style={{ marginTop: 12, fontSize: 12.5, color: C.danger, lineHeight: 1.5 }}>⚠ {error}</div>}

      {groups.length > 1 && (
        <div style={{ marginTop: 14, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <Chip active={!group} onClick={() => setGroup('')}>Tous</Chip>
          {groups.map((g) => <Chip key={g} active={group === g} onClick={() => setGroup(g)}>{g}</Chip>)}
        </div>
      )}

      <div style={{ marginTop: 14, fontSize: 11.5, color: C.label }}>{filtered.length} race{filtered.length > 1 ? 's' : ''}{addedCount ? ` · ${addedCount} ajoutée${addedCount > 1 ? 's' : ''}` : ''}</div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {filtered.map((b) => (
          <div key={b.id} onClick={() => openBreed(b.id)} style={{ cursor: 'pointer', position: 'relative' }}>
            <BreedPhoto src={b.image} caption="photo" height={118} radius={16} align="bottom" style={b.image ? undefined : { background: 'repeating-linear-gradient(45deg,#ECDECA,#ECDECA 10px,#E1D1B7 10px,#E1D1B7 20px)' }} />
            {b.source !== 'base' && <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: C.cream, background: 'rgba(42,33,27,.78)', borderRadius: 999, padding: '3px 8px' }}>{SOURCE_LABEL[b.source] || b.source}</span>}
            {b.source !== 'base' && (
              <button className="reset" onClick={(e) => { e.stopPropagation(); removeBreed(b.id) }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(42,33,27,.78)', color: C.cream, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
            )}
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 9, lineHeight: 1.2 }}>{b.nom}</div>
            <div style={{ fontSize: 11.5, color: C.label, marginTop: 2 }}>{`${b.groupe} · ${b.origine}`}</div>
          </div>
        ))}
      </div>

      {!filtered.length && <div style={{ marginTop: 20, fontSize: 13.5, color: C.label, textAlign: 'center' }}>Aucune race ne correspond.</div>}

      {addedCount > 0 && (
        <button className="reset" onClick={resetCatalogue} style={{ marginTop: 22, width: '100%', textAlign: 'center', color: C.label, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
          Réinitialiser le catalogue (retirer les ajouts)
        </button>
      )}
    </Screen>
  )
}

/* -------- catalogue panels -------- */

const catLabelStyle = { fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 4 }
function CatField({ label, ph, value, onChange, grow }) {
  return (
    <label style={{ display: 'block', flex: grow ? 1 : undefined }}>
      <div style={catLabelStyle}>{label}</div>
      <input style={catInput} placeholder={ph} value={value} onChange={onChange} />
    </label>
  )
}

function AddPanel({ onDone }) {
  const { addBreeds } = useBreeds()
  const [f, setF] = useState({ nom: '', groupe: '', origine: '', taille: '', poids: '', vie: '', tags: '', histoire: '', sante: '', note: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const submit = () => {
    if (!f.nom.trim()) return
    const breed = normalizeBreed({
      nom: f.nom, groupe: f.groupe, origine: f.origine, taille: f.taille, poids: f.poids, vie: f.vie,
      tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sante: f.sante.split(',').map((t) => t.trim()).filter(Boolean),
      histoire: f.histoire, note: f.note,
    }, 'user')
    addBreeds([breed])
    onDone(breed.id)
  }
  return (
    <div style={{ marginTop: 12, background: '#fff', border: `1px solid ${C.accent}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
      <CatField label="Nom *" ph="Akita Inu" value={f.nom} onChange={set('nom')} />
      <div style={{ display: 'flex', gap: 10 }}><CatField grow label="Groupe FCI" ph="Groupe 5" value={f.groupe} onChange={set('groupe')} /><CatField grow label="Origine" ph="Japon" value={f.origine} onChange={set('origine')} /></div>
      <div style={{ display: 'flex', gap: 10 }}><CatField grow label="Taille" ph="61–67 cm" value={f.taille} onChange={set('taille')} /><CatField grow label="Poids" ph="32–45 kg" value={f.poids} onChange={set('poids')} /><CatField grow label="Vie" ph="10–13 ans" value={f.vie} onChange={set('vie')} /></div>
      <CatField label="Tags (séparés par ,)" ph="Loyal, Indépendant" value={f.tags} onChange={set('tags')} />
      <CatField label="Santé (séparés par ,)" ph="Dysplasie, Hypothyroïdie" value={f.sante} onChange={set('sante')} />
      <label style={{ display: 'block' }}>
        <div style={catLabelStyle}>Histoire</div>
        <textarea style={{ ...catInput, minHeight: 64, resize: 'vertical', fontFamily: 'inherit' }} value={f.histoire} onChange={set('histoire')} />
      </label>
      <PrimaryButton onClick={submit} style={{ padding: 13, fontSize: 14 }}>Ajouter la race</PrimaryButton>
    </div>
  )
}

function AIGenPanel({ aiReady, loading, onGenerate, onDone }) {
  const [name, setName] = useState('')
  const go = async () => {
    if (!name.trim()) return
    const res = await onGenerate(name.trim())
    if (res && res.ok) { setName(''); onDone(res.breed.id) }
  }
  return (
    <div style={{ marginTop: 12, background: '#fff', border: `1px solid ${C.accent}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16 }}>
      {!aiReady && <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5, marginBottom: 10 }}>Connectez une clé OpenRouter dans <strong style={{ color: C.accent }}>Paramètres</strong> pour générer une fiche par IA.</div>}
      <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 4 }}>Nom de la race à générer</div>
      <input style={catInput} placeholder="Ex. Shiba Inu, Beauceron…" value={name} onChange={(e) => setName(e.target.value)} disabled={!aiReady || loading} />
      <button className="reset" disabled={!aiReady || loading} onClick={go} style={{ marginTop: 12, width: '100%', background: C.accent, color: C.onAccent, borderRadius: 999, padding: 13, fontWeight: 600, fontSize: 14, cursor: aiReady && !loading ? 'pointer' : 'default', opacity: aiReady && !loading ? 1 : 0.6, minHeight: 46 }}>
        {loading ? 'Génération en cours…' : '✨ Générer la fiche'}
      </button>
    </div>
  )
}

function ImportPanel({ onImport }) {
  const [text, setText] = useState('')
  const [msg, setMsg] = useState('')
  const run = (raw) => {
    const res = onImport(raw)
    if (!res.error) setMsg(`✓ ${res.count} race${res.count > 1 ? 's' : ''} importée${res.count > 1 ? 's' : ''}.`)
    else setMsg('')
  }
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => run(String(reader.result || ''))
    reader.readAsText(file)
  }
  return (
    <div style={{ marginTop: 12, background: '#fff', border: `1px solid ${C.accent}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>Collez un JSON (objet ou tableau) au format de l’app, ou chargez un fichier <code>.json</code>.</div>
      <textarea style={{ ...catInput, minHeight: 120, resize: 'vertical', fontFamily: mono, fontSize: 11.5 }} placeholder={IMPORT_TEMPLATE} value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <PrimaryButton onClick={() => run(text)} style={{ width: 'auto', flex: 1, padding: 12, fontSize: 14 }}>Importer le texte</PrimaryButton>
        <label className="reset" style={{ fontSize: 13, fontWeight: 600, color: C.accent, cursor: 'pointer', border: `1px solid ${C.cardBorder}`, borderRadius: 999, padding: '12px 16px' }}>
          Fichier…
          <input type="file" accept="application/json,.json" onChange={onFile} style={{ display: 'none' }} />
        </label>
      </div>
      <button className="reset" onClick={() => setText(IMPORT_TEMPLATE)} style={{ fontSize: 12, color: C.label, cursor: 'pointer', textDecoration: 'underline', alignSelf: 'flex-start' }}>Insérer un exemple</button>
      {msg && <div style={{ fontSize: 12.5, color: C.successDk, fontWeight: 600 }}>{msg}</div>}
    </div>
  )
}

/* -------- éditeur de photo de race (Wikimédia · Google Images · fichier · URL) -------- */
function PhotoEditor({ breed }) {
  const { setBreedImage } = useBreeds()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const apply = (img) => { setBreedImage(breed, img); setUrl(''); setErr(''); setOpen(false) }

  const fromFile = () => { setErr(''); pickImageFile((data) => apply(data), (e) => setErr(e)) }

  const fromWikimedia = async () => {
    setBusy(true); setErr('')
    try { apply(await fetchWikimediaImage(breed.nom)) }
    catch (e) { setErr(e.message || 'Échec Wikimédia.') }
    finally { setBusy(false) }
  }

  const pillBtn = { fontSize: 13, fontWeight: 600, borderRadius: 999, padding: '10px 14px', cursor: 'pointer', background: '#fff', color: C.body, border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow }

  if (!open) {
    return (
      <button className="reset" onClick={() => { setErr(''); setOpen(true) }}
        style={{ ...pillBtn, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        ✎ {breed.image ? 'Changer la photo' : 'Ajouter une photo'}
      </button>
    )
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.accent}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, marginBottom: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>Photo de « {breed.nom} »</div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="reset" disabled={busy} onClick={fromWikimedia} style={{ ...pillBtn, opacity: busy ? 0.6 : 1 }}>{busy ? '⏳ Recherche…' : '🔎 Wikimédia'}</button>
        <button className="reset" onClick={() => openGoogleImages(breed.nom)} style={pillBtn}>🌐 Google Images</button>
        <button className="reset" onClick={fromFile} style={pillBtn}>📁 Importer un fichier</button>
      </div>

      <div>
        <div style={catLabelStyle}>Coller une URL d’image</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...catInput, flex: 1 }} placeholder="https://…/photo.jpg" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="reset" disabled={!url.trim()} onClick={() => apply(url.trim())} style={{ ...pillBtn, background: C.accent, color: C.onAccent, border: 'none', opacity: url.trim() ? 1 : 0.5 }}>Appliquer</button>
        </div>
        <div style={{ fontSize: 11.5, color: C.label, marginTop: 6, lineHeight: 1.45 }}>
          Google Images s’ouvre dans un onglet : faites un clic droit sur une image → « Copier l’adresse de l’image », puis collez-la ici.
        </div>
      </div>

      {err && <div style={{ fontSize: 12.5, color: C.danger, lineHeight: 1.5 }}>⚠ {err}</div>}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {breed.image && <button className="reset" onClick={() => apply('')} style={{ fontSize: 13, fontWeight: 600, color: C.danger, cursor: 'pointer' }}>Retirer la photo</button>}
        <button className="reset" onClick={() => { setOpen(false); setErr('') }} style={{ fontSize: 13, color: C.label, cursor: 'pointer', marginLeft: 'auto' }}>Fermer</button>
      </div>
    </div>
  )
}

/* ---------------- Carte du monde (Liste/détail) ---------------- */
export function Worldmap() {
  const [sel, setSel] = useState(null)
  const { setDetail } = useChrome()
  const countries = NF.world.countries

  useEffect(() => {
    if (sel == null) { setDetail(null); return }
    setDetail({ title: countries[sel][0], onBack: () => setSel(null) })
    return () => setDetail(null)
  }, [sel, setDetail, countries])

  if (sel == null) {
    return (
      <Screen>
        <Intro>Touchez un pays pour découvrir ses races, leur histoire et leur popularité.</Intro>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {countries.map((c, i) => (
            <div key={c[0]} onClick={() => setSel(i)} className="hoverable" style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '18px 14px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{c[1]}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8, lineHeight: 1.2 }}>{c[0]}</div>
            </div>
          ))}
        </div>
      </Screen>
    )
  }

  const c = countries[sel]
  return (
    <Screen style={{ animation: 'rise .3s ease' }}>
      <button className="reset" onClick={() => setSel(null)} style={{ fontSize: 13, color: C.sub, cursor: 'pointer', marginBottom: 12 }}>‹ Tous les pays</button>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 20, padding: 22, textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>{c[1]}</div>
        <div style={{ fontFamily: serif, fontSize: 28, marginTop: 6 }}>{c[0]}</div>
        <div style={{ fontSize: 12, color: C.label, marginTop: 8 }}>Popularité canine : {c[4]}</div>
      </div>
      <div style={{ marginTop: 18, fontSize: 14, color: C.body, lineHeight: 1.55 }}>{c[3]}</div>
      <SectionLabel style={{ marginTop: 20, marginBottom: 12 }}>Races originaires</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {c[2].map((r) => (
          <div key={r} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 12, padding: '13px 14px', fontSize: 14, fontWeight: 500 }}>
            <span style={{ color: C.espresso }}>🐾</span>{r}
          </div>
        ))}
      </div>
    </Screen>
  )
}

/* ---------------- Maladies génétiques (Calcul/Info) ---------------- */
export function Genetics() {
  const [bi, setBi] = useState(0)
  const g = NF.genetics
  const sel = g.breeds[bi]
  const data = g.data[sel]
  const riskCol = (lvl) => (lvl === 'Fréquent' ? C.danger : lvl === 'Modéré' ? C.warn : C.successDk)

  return (
    <Screen>
      <Intro>Prédispositions héréditaires et dépistages conseillés par race.</Intro>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {g.breeds.map((b, i) => <Chip key={b} active={i === bi} onClick={() => setBi(i)} style={{ padding: '8px 13px', fontSize: 12.5 }}>{b}</Chip>)}
      </div>
      <div style={{ marginTop: 18, background: C.espresso, color: C.cream, borderRadius: 18, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Profil de vigilance</div>
          <div style={{ fontFamily: serif, fontSize: 24, marginTop: 4 }}>{sel}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, border: '1px solid #5A4636', borderRadius: 999, padding: '7px 14px' }}>{data.vig}</div>
      </div>
      <SectionLabel style={{ marginTop: 20, marginBottom: 12 }}>Affections prédisposées</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.risks.map((r) => (
          <div key={r[0]} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: riskCol(r[1]), flex: 'none' }} />
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{r[0]}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: riskCol(r[1]) }}>{r[1]}</div>
          </div>
        ))}
      </div>
      <SectionLabel style={{ marginTop: 20, marginBottom: 12 }}>Dépistages conseillés</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.tests.map((t) => <BulletLine key={t} variant="do" boxed>{t}</BulletLine>)}
      </div>
      <div style={{ marginTop: 16 }}>
        <VetDisclaimer>Une prédisposition n'est pas une fatalité. Seul un vétérinaire peut établir un diagnostic.</VetDisclaimer>
      </div>
    </Screen>
  )
}
