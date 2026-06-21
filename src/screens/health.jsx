import { useState } from 'react'
import { C, serif, mono } from '../theme'
import { useChrome } from '../store/ChromeContext'
import { Screen, Intro, SectionLabel, PrimaryButton, OutlineButton, RegenButton, UploadBox, TipNote, VetDisclaimer, Chip, BulletLine } from '../components/ui'
import CaptureScreen from '../components/CaptureScreen'
import { AIPanel } from '../components/ai'
import { NF } from '../data/datasets'
import { INSTRUCTIONS } from '../lib/prompts'

/* ---------------- Analyse santé photo (Capture IA) ---------------- */
export function HealthPhoto() {
  const [zone, setZone] = useState('Oreilles')
  const zones = ['Oreilles', 'Yeux', 'Peau', 'Pelage']
  return (
    <CaptureScreen
      analyzingLabel="Détection de signes…"
      scanDur="1.4s"
      scanHeight={240}
      buildInstruction={() => INSTRUCTIONS.healthphoto(zone)}
      idle={({ start }) => (
        <>
          <Intro>Sélectionnez la zone puis photographiez-la de près, bien éclairée.</Intro>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {zones.map((z) => <Chip key={z} active={zone === z} onClick={() => setZone(z)}>{z}</Chip>)}
          </div>
          <div style={{ marginTop: 16 }}><UploadBox icon="🔬" caption={`photo · zone ${zone.toLowerCase()}`} height={240} /></div>
          <div style={{ marginTop: 16 }}><PrimaryButton onClick={start}>Analyser la zone</PrimaryButton></div>
        </>
      )}
      result={({ reset }) => (
        <>
          <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.warn, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flex: 'none' }}>!</div>
              <div><div style={{ fontSize: 15, fontWeight: 700 }}>Signe détecté · à surveiller</div><div style={{ fontSize: 12, color: C.label }}>Zone : oreille gauche</div></div>
            </div>
            <SectionLabel style={{ marginTop: 16, marginBottom: 8, letterSpacing: '.1em' }}>Observations</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Obs color={C.warn}>Légère rougeur du conduit auditif</Obs>
              <Obs color={C.warn}>Excès de cérumen visible</Obs>
              <Obs color={C.successDk}>Aucun parasite détecté</Obs>
            </div>
            <SectionLabel style={{ marginTop: 16, marginBottom: 8, letterSpacing: '.1em' }}>Recommandation</SectionLabel>
            <div style={{ fontSize: 13.5, color: C.body, lineHeight: 1.5 }}>Nettoyez délicatement avec une solution auriculaire adaptée et surveillez 48 h. Fréquent chez le Cocker en raison des oreilles tombantes.</div>
          </div>
          <div style={{ marginTop: 14 }}><VetDisclaimer /></div>
          <div style={{ marginTop: 14 }}><OutlineButton onClick={reset}>Nouvelle analyse</OutlineButton></div>
        </>
      )}
    />
  )
}
const Obs = ({ color, children }) => (
  <div style={{ fontSize: 13.5, color: C.body, display: 'flex', gap: 9 }}><span style={{ color }}>•</span>{children}</div>
)

/* ---------------- Poids & forme (Calcul/Info) ---------------- */
export function Weight() {
  const w = NF.weight
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 20, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.faint }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: C.warn }} />{w.verdict}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 10 }}><span style={{ fontFamily: serif, fontSize: 44, lineHeight: 1 }}>{w.current}</span></div>
        <div style={{ fontSize: 12, color: C.label, marginTop: 6 }}>Poids idéal : {w.ideal} · fourchette {w.range}</div>
        <div style={{ marginTop: 16, position: 'relative', height: 8, background: '#3A2C20', borderRadius: 4 }}>
          <div style={{ position: 'absolute', left: '30%', right: '14%', top: 0, bottom: 0, background: '#3F6B4E', borderRadius: 4, opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: -4, width: 16, height: 16, borderRadius: '50%', background: C.cream, border: `3px solid ${C.espresso}`, left: `${w.pct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#7C6754', marginTop: 8 }}><span>Maigre</span><span>Idéal</span><span>Surpoids</span></div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Objectifs recommandés</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {w.objectifs.map((o) => (
          <div key={o} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
            <span style={{ color: C.successDk, flex: 'none' }}>✓</span>{o}
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 18 }}>{w.tip}</TipNote>
    </Screen>
  )
}

/* ---------------- Âge humain (Calcul/Info) ---------------- */
export function Agehuman() {
  const a = NF.agehuman
  return (
    <Screen>
      <div style={{ background: C.espresso, color: C.cream, borderRadius: 22, padding: 26, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.faint, fontWeight: 600 }}>Âge humain estimé</div>
        <div style={{ fontFamily: serif, fontSize: 60, lineHeight: 1, marginTop: 10 }}>{a.big}</div>
        <div style={{ fontSize: 13, color: C.label, marginTop: 8 }}>{a.sub}</div>
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Table de conversion</SectionLabel>
      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, overflow: 'hidden' }}>
        {a.table.map((r, i) => (
          <div key={r[0]} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.tile}`, background: i === 1 ? C.tile : '#fff', fontSize: 14 }}>
            <span style={{ color: C.body }}>{r[0]}</span>
            <span style={{ fontWeight: 600 }}>{r[1]}</span>
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 18 }}>{a.note}</TipNote>
    </Screen>
  )
}

/* ---------------- Détection de douleur (Capture IA) ---------------- */
export function Pain() {
  const p = NF.pain
  return (
    <CaptureScreen
      analyzingLabel="Analyse posturale…"
      scanDur="1.5s"
      scanHeight={260}
      buildInstruction={() => INSTRUCTIONS.pain}
      idle={({ start }) => (
        <>
          <Intro>Filmez ou photographiez votre chien en mouvement. L'IA repère les signes de douleur.</Intro>
          <div style={{ marginTop: 18 }}><UploadBox icon="🩺" caption="vidéo · démarche" height={260} /></div>
          <div style={{ marginTop: 16 }}><PrimaryButton onClick={start}>Analyser la démarche</PrimaryButton></div>
        </>
      )}
      result={({ reset }) => (
        <>
          <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.warn, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flex: 'none' }}>!</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{p.verdict}</div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {p.signs.map((s) => (
                <div key={s[0]} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: s[2] === 'ok' ? C.successDk : C.warn, flex: 'none', marginTop: 6 }} />
                  <div><span style={{ fontSize: 13.5, fontWeight: 600 }}>{s[0]} — </span><span style={{ fontSize: 13.5, color: C.sub }}>{s[1]}</span></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 13.5, color: C.body, lineHeight: 1.5 }}>{p.advice}</div>
          </div>
          <div style={{ marginTop: 14 }}><VetDisclaimer>Une consultation vétérinaire pourrait être utile. Cette analyse ne pose aucun diagnostic.</VetDisclaimer></div>
          <div style={{ marginTop: 14 }}><OutlineButton onClick={reset}>Nouvelle analyse</OutlineButton></div>
        </>
      )}
    />
  )
}

/* ---------------- Analyse prédictive (Calcul/Info) ---------------- */
export function Predictive() {
  const pr = NF.predictive
  return (
    <Screen>
      <Intro>Estimation des risques de santé à partir de la race, l'âge, l'activité et l'alimentation.</Intro>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {pr.risks.map((r) => {
          const col = r[1] >= 30 ? C.warn : C.successDk
          return (
            <div key={r[0]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r[0]}</span>
                <span style={{ fontFamily: serif, fontSize: 22, color: col }}>{r[1]}%</span>
              </div>
              <div style={{ height: 8, background: C.track, borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 4, background: col, width: `${r[1]}%`, animation: 'bar .8s ease' }} /></div>
              <div style={{ fontSize: 11, color: C.label, marginTop: 5 }}>{r[2]}</div>
            </div>
          )
        })}
      </div>
      <SectionLabel style={{ marginTop: 24, marginBottom: 12 }}>Facteurs analysés</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pr.factors.map((f) => <BulletLine key={f} variant="info" boxed>{f}</BulletLine>)}
      </div>
      <SectionLabel style={{ marginTop: 20, marginBottom: 12 }}>Pour réduire les risques</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pr.recos.map((r) => (
          <div key={r} style={{ display: 'flex', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.45 }}>
            <span style={{ color: C.successDk, flex: 'none' }}>✓</span>{r}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}><AIPanel buildInstruction={() => INSTRUCTIONS.predictive} label="Prévision IA détaillée" /></div>
    </Screen>
  )
}

/* ---------------- Pré-consultation véto (Rapport) ---------------- */
export function Vetprep() {
  const vet = NF.vet
  const [checked, setChecked] = useState(vet.checked)
  const [done, setDone] = useState(false)
  const toggle = (s) => setChecked((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]))

  if (!done) {
    return (
      <Screen>
        <Intro>Cochez les symptômes observés : l'app prépare un rapport clair pour le vétérinaire.</Intro>
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {vet.symptoms.map((s) => {
            const on = checked.includes(s)
            return (
              <button key={s} className="reset" onClick={() => toggle(s)} style={{ fontSize: 13, fontWeight: 600, borderRadius: 999, padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, background: on ? C.espresso : '#fff', color: on ? C.cream : C.body, border: `1px solid ${on ? C.espresso : C.cardBorder}` }}>
                <span>{on ? '✓' : '+'}</span>{s}
              </button>
            )
          })}
        </div>
        <div style={{ marginTop: 22 }}><PrimaryButton onClick={() => setDone(true)}>Générer le rapport</PrimaryButton></div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.tile, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📋</div>
          <div style={{ fontFamily: serif, fontSize: 22 }}>Rapport pré-consultation</div>
        </div>
        <div style={{ fontSize: 12, color: C.label, marginBottom: 8 }}>Stanley · Cocker Spaniel · 4 ans</div>
        <div style={{ borderTop: `1px solid ${C.tile}` }}>
          {vet.report.map((r) => (
            <div key={r[0]} style={{ padding: '13px 0', borderBottom: `1px solid ${C.tile}` }}>
              <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: C.label, fontWeight: 600 }}>{r[0]}</div>
              <div style={{ fontSize: 14, marginTop: 3, lineHeight: 1.4 }}>{r[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: C.accent, color: C.onAccent, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Partager au véto</div>
        <button className="reset" onClick={() => setDone(false)} style={{ flex: 'none', border: `1px solid ${C.grayB}`, borderRadius: 999, padding: '14px 18px', textAlign: 'center', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Modifier</button>
      </div>
      <div style={{ marginTop: 14 }}>
        <AIPanel buildInstruction={() => INSTRUCTIONS.vetprep(checked.join(', '))} label="Affiner avec l'IA" />
      </div>
    </Screen>
  )
}

/* ---------------- Assistant alimentation (Calcul/Info) ---------------- */
export function Nutrition() {
  const { goScreen } = useChrome()
  const n = NF.nutrition
  return (
    <Screen>
      <div style={{ display: 'flex', gap: 10 }}>
        <NutStat v={n.kcal} k="par jour" />
        <NutStat v={n.prot} k="protéines" />
        <NutStat v="2×" k="repas" />
      </div>
      <SectionLabel style={{ marginTop: 22, marginBottom: 12 }}>Détail des besoins</SectionLabel>
      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, overflow: 'hidden' }}>
        {n.rows.map((r) => (
          <div key={r[0]} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.tile}`, fontSize: 14 }}>
            <span style={{ color: C.body }}>{r[0]}</span><span style={{ fontWeight: 600 }}>{r[1]}</span>
          </div>
        ))}
      </div>
      <TipNote style={{ marginTop: 18 }}>{n.tip}</TipNote>
      <div onClick={() => goScreen('recipes')} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: '15px 16px', cursor: 'pointer' }}>
        <span style={{ fontSize: 18 }}>👨‍🍳</span>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>Voir les recettes maison adaptées</div>
        <div style={{ color: C.grayA, fontSize: 20 }}>›</div>
      </div>
    </Screen>
  )
}
const NutStat = ({ v, k }) => (
  <div style={{ flex: 1, background: C.espresso, color: C.cream, borderRadius: 16, padding: 14, textAlign: 'center' }}>
    <div style={{ fontFamily: serif, fontSize: 20, lineHeight: 1.1 }}>{v}</div>
    <div style={{ fontSize: 9, letterSpacing: '.05em', textTransform: 'uppercase', color: C.faint, marginTop: 3 }}>{k}</div>
  </div>
)

/* ---------------- Recettes maison (Générateur) ---------------- */
export function Recipes() {
  return (
    <Screen>
      <Intro>Recettes équilibrées, adaptées au poids, à l'âge et aux allergies de Stanley.</Intro>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NF.recipes.map((r) => (
          <div key={r.nom} style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ height: 96, background: 'repeating-linear-gradient(45deg,#ECDECA,#ECDECA 10px,#E1D1B7 10px,#E1D1B7 20px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
              <span style={{ fontFamily: mono, fontSize: 9, color: C.label }}>photo plat</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{r.nom}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.sub, whiteSpace: 'nowrap' }}>{r.kcal}</div>
              </div>
              <div style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: 1.45 }}>{r.desc}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                {r.tags.map((t) => <span key={t} style={{ fontSize: 11, fontWeight: 600, color: C.body, background: C.tile, borderRadius: 999, padding: '4px 10px' }}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}><RegenButton>Proposer d'autres recettes</RegenButton></div>
      <div style={{ marginTop: 14 }}><VetDisclaimer>Validez tout régime maison avec votre vétérinaire.</VetDisclaimer></div>
    </Screen>
  )
}
