import { useState } from 'react'
import { C, serif } from '../theme'
import { useChrome } from '../store/ChromeContext'
import { useCarnet } from '../store/CarnetContext'
import { Screen, SectionLabel, PrimaryButton, OutlineButton } from '../components/ui'

const Label = ({ children, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 }}>
    <SectionLabel>{children}</SectionLabel>
    {action}
  </div>
)

const fieldStyle = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 10, padding: '11px 12px', fontSize: 14, color: C.espresso, outline: 'none' }
const labelStyle = { fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 4 }

// Per-section form schema + blank template.
const FIELDS = {
  vaccins: [
    { k: 'name', label: 'Vaccin' },
    { k: 'status', label: 'Statut', type: 'select', options: ['À jour', 'Bientôt', 'En retard'] },
    { k: 'detail', label: 'Détail / rappel' },
  ],
  soins: [
    { k: 'name', label: 'Produit' },
    { k: 'detail', label: 'Détail' },
  ],
  poids: [
    { k: 'm', label: 'Mois' },
    { k: 'kg', label: 'Poids (kg)', type: 'number' },
  ],
  rdv: [
    { k: 'date', label: 'Date' },
    { k: 'label', label: 'Motif' },
    { k: 'who', label: 'Praticien / lieu' },
  ],
}
const BLANK = {
  vaccins: { name: '', status: 'À jour', detail: '' },
  soins: { name: '', detail: '' },
  poids: { m: '', kg: '' },
  rdv: { date: '', label: '', who: '' },
}

const statusColor = (s) => (s === 'À jour' ? C.successDk : C.warn)

export default function Carnet() {
  const { goScreen } = useChrome()
  const { vaccins, soins, poids, rdv, addItem, updateItem, removeItem, resetCarnet } = useCarnet()
  const [editing, setEditing] = useState(false)
  const [active, setActive] = useState(null) // { section, id } | { section, id: 'new' } | null

  const isActive = (section, id) => active && active.section === section && active.id === id
  const openNew = (section) => setActive({ section, id: 'new' })
  const close = () => setActive(null)

  const save = (section, id, values) => {
    if (id === 'new') addItem(section, values)
    else updateItem(section, id, values)
    close()
  }
  const del = (section, id) => { if (isActive(section, id)) close(); removeItem(section, id) }

  // Header reminders derived from vaccins that are no longer up to date.
  const upcoming = vaccins.filter((v) => v.status !== 'À jour')
  const next = upcoming[0]

  // Auto-scaling weight chart.
  const kgs = poids.map((p) => Number(p.kg)).filter((n) => !Number.isNaN(n))
  const min = kgs.length ? Math.min(...kgs) : 0
  const max = kgs.length ? Math.max(...kgs) : 1
  const range = max - min || 1
  const barH = (kg) => Math.round(22 + ((Number(kg) - min) / range) * 78)

  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 18, padding: '15px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: upcoming.length ? C.warn : C.successDk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flex: 'none' }}>{upcoming.length ? '🔔' : '✓'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{upcoming.length ? `${upcoming.length} rappel${upcoming.length > 1 ? 's' : ''} à venir` : 'Tout est à jour'}</div>
          <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>{next ? `Prochain : ${next.name} · ${next.detail}` : 'Aucun rappel en attente'}</div>
        </div>
        <button className="reset" onClick={() => { setEditing((e) => !e); close() }} style={{ fontSize: 12.5, fontWeight: 600, color: C.cream, border: `1px solid ${C.faint}`, borderRadius: 999, padding: '7px 12px', cursor: 'pointer', flex: 'none' }}>
          {editing ? 'Terminé' : '✏️ Modifier'}
        </button>
      </div>

      {/* ---------------- Vaccins ---------------- */}
      <Label action={editing && <AddBtn onClick={() => openNew('vaccins')} />}>Vaccins</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {vaccins.map((v) =>
          isActive('vaccins', v.id) ? (
            <ItemEditor key={v.id} section="vaccins" item={v} onSave={(vals) => save('vaccins', v.id, vals)} onCancel={close} />
          ) : (
            <Row key={v.id} editing={editing} onEdit={() => setActive({ section: 'vaccins', id: v.id })} onDelete={() => del('vaccins', v.id)}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(v.status), flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>{v.detail}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: statusColor(v.status), border: `1px solid ${statusColor(v.status)}`, borderRadius: 999, padding: '4px 10px', flex: 'none' }}>{v.status}</div>
            </Row>
          ),
        )}
        {isActive('vaccins', 'new') && <ItemEditor section="vaccins" item={BLANK.vaccins} onSave={(vals) => save('vaccins', 'new', vals)} onCancel={close} />}
        {!vaccins.length && !isActive('vaccins', 'new') && <Empty>Aucun vaccin enregistré.</Empty>}
      </div>

      {/* ---------------- Vermifuges & traitements ---------------- */}
      <Label action={editing && <AddBtn onClick={() => openNew('soins')} />}>Vermifuges & traitements</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {soins.map((v) =>
          isActive('soins', v.id) ? (
            <ItemEditor key={v.id} section="soins" item={v} onSave={(vals) => save('soins', v.id, vals)} onCancel={close} />
          ) : (
            <Row key={v.id} editing={editing} onEdit={() => setActive({ section: 'soins', id: v.id })} onDelete={() => del('soins', v.id)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: C.label, marginTop: 3 }}>{v.detail}</div>
              </div>
            </Row>
          ),
        )}
        {isActive('soins', 'new') && <ItemEditor section="soins" item={BLANK.soins} onSave={(vals) => save('soins', 'new', vals)} onCancel={close} />}
        {!soins.length && !isActive('soins', 'new') && <Empty>Aucun traitement enregistré.</Empty>}
      </div>

      {/* ---------------- Courbe de poids ---------------- */}
      <Label action={editing && <AddBtn onClick={() => openNew('poids')} />}>Courbe de poids</Label>
      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '18px 16px 12px' }}>
        {poids.length ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 110 }}>
            {poids.map((p) => (
              <div key={p.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 10, color: C.sub, fontWeight: 600 }}>{String(p.kg).replace('.', ',')}</div>
                <div style={{ width: '70%', background: C.espresso, borderRadius: '5px 5px 0 0', height: `${barH(p.kg)}%`, animation: 'bar .8s ease' }} />
                <div style={{ fontSize: 10, color: C.label }}>{p.m}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: C.label, textAlign: 'center', padding: '8px 0' }}>Aucune pesée enregistrée.</div>
        )}
      </div>
      {editing && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {poids.map((p) =>
            isActive('poids', p.id) ? (
              <ItemEditor key={p.id} section="poids" item={p} onSave={(vals) => save('poids', p.id, vals)} onCancel={close} />
            ) : (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ flex: 1, fontSize: 13.5 }}><strong>{p.m}</strong> · {String(p.kg).replace('.', ',')} kg</div>
                <MiniBtn onClick={() => setActive({ section: 'poids', id: p.id })}>✏️</MiniBtn>
                <MiniBtn onClick={() => del('poids', p.id)}>🗑</MiniBtn>
              </div>
            ),
          )}
          {isActive('poids', 'new') && <ItemEditor section="poids" item={BLANK.poids} onSave={(vals) => save('poids', 'new', vals)} onCancel={close} />}
        </div>
      )}

      {/* ---------------- Rendez-vous ---------------- */}
      <Label action={editing && <AddBtn onClick={() => openNew('rdv')} />}>Rendez-vous</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rdv.map((r) =>
          isActive('rdv', r.id) ? (
            <ItemEditor key={r.id} section="rdv" item={r} onSave={(vals) => save('rdv', r.id, vals)} onCancel={close} />
          ) : (
            <Row key={r.id} editing={editing} onEdit={() => setActive({ section: 'rdv', id: r.id })} onDelete={() => del('rdv', r.id)}>
              <div style={{ textAlign: 'center', flex: 'none', width: 46 }}>
                <div style={{ fontFamily: serif, fontSize: 18, lineHeight: 1.1 }}>{r.date}</div>
              </div>
              <div style={{ borderLeft: `1px solid ${C.track}`, paddingLeft: 14, flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: C.label, marginTop: 2 }}>{r.who}</div>
              </div>
            </Row>
          ),
        )}
        {isActive('rdv', 'new') && <ItemEditor section="rdv" item={BLANK.rdv} onSave={(vals) => save('rdv', 'new', vals)} onCancel={close} />}
        {!rdv.length && !isActive('rdv', 'new') && <Empty>Aucun rendez-vous prévu.</Empty>}
      </div>

      {editing ? (
        <button className="reset" onClick={resetCarnet} style={{ marginTop: 22, width: '100%', textAlign: 'center', color: C.label, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
          Réinitialiser le carnet
        </button>
      ) : (
        <div onClick={() => goScreen('healthphoto')} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, background: C.tile, borderRadius: 16, padding: '15px 16px', cursor: 'pointer' }}>
          <div style={{ fontSize: 18 }}>🔬</div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Analyser un symptôme par photo</div>
          <div style={{ color: C.label, fontSize: 20 }}>›</div>
        </div>
      )}
    </Screen>
  )
}

/* ---------------- shared bits ---------------- */

function Row({ children, editing, onEdit, onDelete }) {
  return (
    <div
      onClick={editing ? onEdit : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, cursor: editing ? 'pointer' : 'default' }}
    >
      {children}
      {editing && <MiniBtn onClick={(e) => { e.stopPropagation(); onDelete() }} style={{ flex: 'none' }}>🗑</MiniBtn>}
    </div>
  )
}

function MiniBtn({ children, onClick, style }) {
  return (
    <button className="reset" onClick={onClick} style={{ width: 32, height: 32, borderRadius: 9, background: C.tile, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', ...style }}>
      {children}
    </button>
  )
}

function AddBtn({ onClick }) {
  return (
    <button className="reset" onClick={onClick} style={{ fontSize: 12.5, fontWeight: 600, color: C.accent, cursor: 'pointer' }}>+ Ajouter</button>
  )
}

function Empty({ children }) {
  return <div style={{ fontSize: 13, color: C.label, padding: '6px 2px' }}>{children}</div>
}

function ItemEditor({ section, item, onSave, onCancel }) {
  const [f, setF] = useState(item)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = () => {
    const out = {}
    for (const fl of FIELDS[section]) {
      out[fl.k] = fl.type === 'number' ? Number(f[fl.k]) || 0 : String(f[fl.k] ?? '').trim()
    }
    onSave(out)
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.accent}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FIELDS[section].map((fl) => (
        <label key={fl.k} style={{ display: 'block' }}>
          <div style={labelStyle}>{fl.label}</div>
          {fl.type === 'select' ? (
            <select style={fieldStyle} value={f[fl.k]} onChange={set(fl.k)}>
              {fl.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input
              style={fieldStyle}
              type={fl.type === 'number' ? 'number' : 'text'}
              inputMode={fl.type === 'number' ? 'decimal' : undefined}
              step={fl.type === 'number' ? '0.1' : undefined}
              value={f[fl.k]}
              onChange={set(fl.k)}
            />
          )}
        </label>
      ))}
      <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
        <PrimaryButton onClick={submit} style={{ padding: 13, fontSize: 14 }}>Enregistrer</PrimaryButton>
        <OutlineButton onClick={onCancel} style={{ width: 'auto', flex: 'none', padding: '13px 18px', fontSize: 14 }}>Annuler</OutlineButton>
      </div>
    </div>
  )
}
