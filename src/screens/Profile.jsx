import { useState } from 'react'
import { C, serif } from '../theme'
import { useApp } from '../store/AppContext'
import { useChrome } from '../store/ChromeContext'
import { Screen, IconTile, PrimaryButton, OutlineButton } from '../components/ui'
import { PROFILE_LINKS } from '../data/tools'

export default function Profile() {
  const { dog, updateDog, replayOnboarding } = useApp()
  const { goScreen } = useChrome()
  const [editing, setEditing] = useState(false)

  const stats = [
    { k: 'Âge', v: `${dog.ageAnnees} ans` },
    { k: 'Poids', v: `${dog.poidsKg} kg` },
    { k: 'Sexe', v: dog.sexe },
  ]

  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 24, padding: 24, textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 24, margin: '0 auto 14px', background: 'repeating-linear-gradient(45deg,#3A2C20,#3A2C20 8px,#2F2316 8px,#2F2316 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 38, color: C.faint }}>{dog.nom[0]}</div>
        <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1 }}>{dog.nom}</div>
        <div style={{ fontSize: 13, color: C.label, marginTop: 6 }}>{dog.race}{dog.lof ? ' · LOF' : ''}</div>
      </div>

      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {stats.map((p) => (
          <div key={p.k} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '13px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: 21 }}>{p.v}</div>
            <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, marginTop: 3 }}>{p.k}</div>
          </div>
        ))}
      </div>

      {editing ? (
        <EditForm dog={dog} onSave={(patch) => { updateDog(patch); setEditing(false) }} onCancel={() => setEditing(false)} />
      ) : (
        <button className="reset" onClick={() => setEditing(true)} style={{ marginTop: 14, width: '100%', border: `1px solid ${C.grayB}`, borderRadius: 999, padding: 13, textAlign: 'center', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 46 }}>
          ✏️ Modifier le profil
        </button>
      )}

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PROFILE_LINKS.map((l) => (
          <div key={l.title} onClick={() => goScreen(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '15px 16px', cursor: 'pointer' }}>
            <IconTile size={38} radius={11} fontSize={17}>{l.icon}</IconTile>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{l.title}</div>
            <div style={{ color: C.grayA, fontSize: 20 }}>›</div>
          </div>
        ))}
      </div>

      <button className="reset" onClick={replayOnboarding} style={{ marginTop: 18, width: '100%', textAlign: 'center', color: C.label, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
        Revoir l'introduction
      </button>
    </Screen>
  )
}

const fieldStyle = { width: '100%', border: `1px solid ${C.cardBorder}`, background: '#FAF4EA', borderRadius: 10, padding: '11px 12px', fontSize: 14, color: C.espresso, outline: 'none' }
const labelStyle = { fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600, marginBottom: 4 }

function EditForm({ dog, onSave, onCancel }) {
  const [f, setF] = useState({ nom: dog.nom, race: dog.race, sexe: dog.sexe, ageAnnees: dog.ageAnnees, poidsKg: dog.poidsKg, forme: dog.forme })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  return (
    <div style={{ marginTop: 14, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="Nom"><input style={fieldStyle} value={f.nom} onChange={set('nom')} /></Field>
      <Field label="Race"><input style={fieldStyle} value={f.race} onChange={set('race')} /></Field>
      <div style={{ display: 'flex', gap: 10 }}>
        <Field label="Sexe" grow>
          <select style={fieldStyle} value={f.sexe} onChange={set('sexe')}>
            <option>Mâle</option><option>Femelle</option>
          </select>
        </Field>
        <Field label="Âge (ans)" grow><input type="number" min="0" style={fieldStyle} value={f.ageAnnees} onChange={set('ageAnnees')} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Field label="Poids (kg)" grow><input type="number" min="0" step="0.1" style={fieldStyle} value={f.poidsKg} onChange={set('poidsKg')} /></Field>
        <Field label="Indice forme" grow><input type="number" min="0" max="100" style={fieldStyle} value={f.forme} onChange={set('forme')} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <PrimaryButton onClick={() => onSave({ nom: f.nom.trim() || dog.nom, race: f.race.trim() || dog.race, sexe: f.sexe, ageAnnees: Number(f.ageAnnees) || dog.ageAnnees, poidsKg: Number(f.poidsKg) || dog.poidsKg, forme: Math.max(0, Math.min(100, Number(f.forme) || dog.forme)) })}>Enregistrer</PrimaryButton>
        <OutlineButton onClick={onCancel} style={{ width: 'auto', flex: 'none', padding: '14px 18px' }}>Annuler</OutlineButton>
      </div>
    </div>
  )
}

function Field({ label, children, grow }) {
  return (
    <label style={{ display: 'block', flex: grow ? 1 : undefined }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </label>
  )
}
