import { useEffect, useState } from 'react'
import { C, serif } from '../theme'
import { useChrome } from '../store/ChromeContext'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, UploadBox, PhotoPlaceholder, Tag, TraitRow, Bar, Chip, BulletLine, StatTile, TipNote, VetDisclaimer } from '../components/ui'
import CaptureScreen from '../components/CaptureScreen'
import { AIPanel } from '../components/ai'
import { COCKER, BREEDS, COMPARE, NF, MORPHO_FIELDS, MORPHO_RESULTS, COMPAT_FIELDS, IDENTIFY_RESULT } from '../data/datasets'
import { INSTRUCTIONS } from '../lib/prompts'

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
export function Morpho() {
  const [done, setDone] = useState(false)
  if (!done) {
    return (
      <Screen>
        <Intro>Renseignez les caractéristiques observées. Plus elles sont précises, meilleure est l'estimation.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MORPHO_FIELDS.map((f) => (
            <div key={f.k} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{f.k}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{f.v}</div>
              </div>
              <div style={{ color: C.grayA, fontSize: 18 }}>⌄</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => setDone(true)}>Estimer la race</PrimaryButton></div>
      </Screen>
    )
  }
  return (
    <Screen>
      <SectionLabel style={{ marginBottom: 14 }}>Races les plus probables</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MORPHO_RESULTS.map((r) => (
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
        <AIPanel buildInstruction={() => INSTRUCTIONS.morpho(MORPHO_FIELDS.map((f) => `${f.k}: ${f.v}`).join(', '))} />
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
export function Fiche() {
  const { goScreen } = useChrome()
  const stats = [
    { k: 'Origine', v: COCKER.origine }, { k: 'Groupe FCI', v: COCKER.groupe },
    { k: 'Espérance de vie', v: COCKER.vie }, { k: 'Poids adulte', v: COCKER.poids },
    { k: 'Taille au garrot', v: COCKER.taille }, { k: 'Entretien du poil', v: 'Élevé' },
  ]
  return (
    <Screen flush>
      <div style={{ margin: '0 20px' }}>
        <PhotoPlaceholder caption="photo · cocker spaniel" height={150} radius={20} />
      </div>
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1 }}>{COCKER.nom}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {COCKER.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map((s) => <StatTile key={s.k} k={s.k} v={s.v} />)}
        </div>
        <SectionLabel style={{ marginTop: 24, marginBottom: 8 }}>Origine & histoire</SectionLabel>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: C.body }}>{COCKER.histoire}</div>
        <SectionLabel style={{ marginTop: 24, marginBottom: 14 }}>Caractère & besoins</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {COCKER.traits.map((t) => <TraitRow key={t[0]} label={t[0]} value={t[1]} />)}
        </div>
        <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Problèmes de santé fréquents</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COCKER.sante.map((s) => (
            <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 12, padding: '12px 14px', fontSize: 13.5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.danger, flex: 'none' }} />{s}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><PrimaryButton onClick={() => goScreen('compare')}>Comparer à une autre race</PrimaryButton></div>
      </div>
    </Screen>
  )
}

/* ---------------- Catalogue des races (Liste/détail) ---------------- */
export function Catalogue() {
  const [sel, setSel] = useState(null)
  const { setDetail } = useChrome()

  useEffect(() => {
    if (sel == null) { setDetail(null); return }
    setDetail({ title: BREEDS[sel].nom, onBack: () => setSel(null) })
    return () => setDetail(null)
  }, [sel, setDetail])

  if (sel == null) {
    return (
      <Screen>
        <Intro>Toutes les races enregistrées dans l'application. Touchez une photo pour découvrir ses caractéristiques.</Intro>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {BREEDS.map((b, i) => (
            <div key={b.nom} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
              <PhotoPlaceholder caption="photo" height={118} radius={16} align="bottom" style={{ background: 'repeating-linear-gradient(45deg,#ECDECA,#ECDECA 10px,#E1D1B7 10px,#E1D1B7 20px)' }} />
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 9, lineHeight: 1.2 }}>{b.nom}</div>
              <div style={{ fontSize: 11.5, color: C.label, marginTop: 2 }}>{`${b.groupe} · ${b.origine}`}</div>
            </div>
          ))}
        </div>
      </Screen>
    )
  }

  const b = BREEDS[sel]
  const stats = [{ k: 'Origine', v: b.origine }, { k: 'Groupe FCI', v: b.groupe }, { k: 'Taille', v: b.taille }, { k: 'Poids', v: b.poids }, { k: 'Espérance de vie', v: b.vie }]
  return (
    <Screen flush style={{ animation: 'rise .3s ease' }}>
      <div style={{ margin: '0 20px' }}>
        <PhotoPlaceholder caption={`photo · ${b.nom}`} height={170} radius={20} align="bottom" />
      </div>
      <div style={{ padding: '16px 20px 0' }}>
        <button className="reset" onClick={() => setSel(null)} style={{ fontSize: 13, color: C.sub, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>‹ Toutes les races</button>
        <div style={{ fontFamily: serif, fontSize: 29, lineHeight: 1 }}>{b.nom}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>{b.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{stats.map((s) => <StatTile key={s.k} k={s.k} v={s.v} />)}</div>
        <SectionLabel style={{ marginTop: 24, marginBottom: 14 }}>Caractère & besoins</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{b.traits.map((t) => <TraitRow key={t[0]} label={t[0]} value={t[1]} />)}</div>
        <TipNote style={{ marginTop: 20 }}>{b.note}</TipNote>
      </div>
    </Screen>
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
