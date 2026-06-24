import { C, mono } from '../theme'
import { useApp } from '../store/AppContext'
import { Screen, SectionLabel } from '../components/ui'
import { Logo } from '../components/Logo'
import { VISION_PROVIDERS } from '../lib/visionProviders'

export default function Settings() {
  const { orKey, orStatus, orMsg, orModel, orShow, models, modelName, onKeyChange, toggleShow, selectModel, validateKey } = useApp()

  const btnLabel = orStatus === 'checking' ? 'Vérification…' : orStatus === 'valid' ? 'Re-vérifier la clé' : 'Valider la clé'
  const msgColor = orStatus === 'valid' ? C.successDk : orStatus === 'invalid' ? C.danger : C.sub
  const msgIcon = orStatus === 'valid' ? '✓' : orStatus === 'invalid' ? '✕' : '…'

  return (
    <Screen>
      <SectionLabel style={{ marginBottom: 12 }}>Connexion IA · OpenRouter</SectionLabel>

      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Clé API OpenRouter</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4, lineHeight: 1.5 }}>Collez votre clé personnelle pour activer les analyses IA de Canidor.</div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, background: '#FAF4EA', border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: '3px 4px 3px 14px' }}>
          <input
            type={orShow ? 'text' : 'password'}
            value={orKey}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder="sk-or-v1-..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Clé API OpenRouter"
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontFamily: mono, fontSize: 13, color: C.espresso, padding: '10px 0' }}
          />
          <button className="reset" onClick={toggleShow} style={{ fontSize: 12, fontWeight: 600, color: C.sub, cursor: 'pointer', padding: '8px 10px', flex: 'none' }}>{orShow ? 'Masquer' : 'Afficher'}</button>
        </div>

        <button className="reset" onClick={validateKey} disabled={orStatus === 'checking'} style={{ width: '100%', marginTop: 14, background: C.accent, color: C.onAccent, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: orStatus === 'checking' ? 0.7 : 1, minHeight: 48 }}>{btnLabel}</button>

        {!!orMsg && (
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: msgColor, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.45 }}>
            <span style={{ flex: 'none' }}>{msgIcon}</span>{orMsg}
          </div>
        )}

        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 14, fontSize: 12.5, color: C.accent, textDecoration: 'none', borderBottom: `1px solid ${C.accent}`, paddingBottom: 1 }}>Obtenir une clé sur openrouter.ai ›</a>
      </div>

      {orStatus === 'valid' && (
        <>
          <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionLabel>Modèle gratuit</SectionLabel>
            <div style={{ fontSize: 11, color: C.sub }}>{models.length} disponibles</div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {models.map((m) => {
              const sel = orModel === m.id
              return (
                <div key={m.id} onClick={() => selectModel(m.id)} style={{ background: '#fff', border: `1.5px solid ${sel ? C.accent : C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? C.accent : C.grayA}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: sel ? C.accent : 'transparent' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600 }}>{m.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: C.successDk, background: C.successBg, borderRadius: 999, padding: '3px 7px', flex: 'none' }}>Gratuit</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.label, fontFamily: mono, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.id}</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.sub, flex: 'none' }}>{m.tag}</span>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 14, background: C.tile, borderRadius: 12, padding: 14, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
            Modèle actif : <span style={{ fontWeight: 700, color: C.espresso }}>{modelName}</span>
          </div>
        </>
      )}

      <VisionSection />

      <SectionLabel style={{ marginTop: 26, marginBottom: 12 }}>À propos</SectionLabel>
      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={30} radius={9} />
          <div style={{ fontSize: 15, fontWeight: 600 }}>Canidor</div>
        </div>
        <div style={{ fontSize: 12, color: C.label }}>v0.1 · prototype</div>
      </div>
      <div style={{ marginTop: 14, background: C.tile, borderRadius: 12, padding: 13, fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
        🔒 Votre clé est stockée uniquement sur votre appareil et n'est jamais partagée.
      </div>
    </Screen>
  )
}

// Section « Analyse photo/vidéo » : choix d'un fournisseur multimodal
// (OpenAI / Anthropic / Google), saisie de la clé et choix du modèle. Utilisée
// automatiquement pour les analyses d'images, là où les modèles gratuits
// d'OpenRouter ne savent pas voir.
function VisionSection() {
  const { vProvider, vKey, vStatus, vMsg, vModel, vModels, vShow, visionModelName,
    onVKeyChange, toggleVShow, selectVProvider, validateVKey, selectVModel } = useApp()

  const conf = VISION_PROVIDERS.find((p) => p.id === vProvider) || VISION_PROVIDERS[0]
  const btnLabel = vStatus === 'checking' ? 'Vérification…' : vStatus === 'valid' ? 'Re-vérifier la clé' : 'Valider la clé'
  const msgColor = vStatus === 'valid' ? C.successDk : vStatus === 'invalid' ? C.danger : C.sub
  const msgIcon = vStatus === 'valid' ? '✓' : vStatus === 'invalid' ? '✕' : '…'

  return (
    <>
      <SectionLabel style={{ marginTop: 28, marginBottom: 6 }}>Analyse photo & vidéo · IA multimodale</SectionLabel>
      <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 12, lineHeight: 1.5 }}>
        Les modèles gratuits d'OpenRouter ne savent pas analyser d'images. Ajoutez une clé OpenAI, Anthropic ou Google pour activer les analyses de photos et vidéos.
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 18, padding: 18 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {VISION_PROVIDERS.map((p) => {
            const on = p.id === vProvider
            return (
              <button key={p.id} className="reset" onClick={() => selectVProvider(p.id)} style={{ flex: 1, fontSize: 13, fontWeight: 600, borderRadius: 12, padding: '10px 6px', cursor: 'pointer', background: on ? C.espresso : '#fff', color: on ? C.cream : C.body, border: `1px solid ${on ? C.espresso : C.cardBorder}` }}>
                {p.name}
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: 15, fontWeight: 600 }}>Clé API {conf.name}</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4, lineHeight: 1.5 }}>Collez votre clé personnelle {conf.name} pour activer l'analyse d'images.</div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, background: '#FAF4EA', border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: '3px 4px 3px 14px' }}>
          <input
            type={vShow ? 'text' : 'password'}
            value={vKey}
            onChange={(e) => onVKeyChange(e.target.value)}
            placeholder={conf.placeholder}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={`Clé API ${conf.name}`}
            style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontFamily: mono, fontSize: 13, color: C.espresso, padding: '10px 0' }}
          />
          <button className="reset" onClick={toggleVShow} style={{ fontSize: 12, fontWeight: 600, color: C.sub, cursor: 'pointer', padding: '8px 10px', flex: 'none' }}>{vShow ? 'Masquer' : 'Afficher'}</button>
        </div>

        <button className="reset" onClick={validateVKey} disabled={vStatus === 'checking' || !vKey.trim()} style={{ width: '100%', marginTop: 14, background: C.accent, color: C.onAccent, borderRadius: 999, padding: 14, textAlign: 'center', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: vStatus === 'checking' || !vKey.trim() ? 0.6 : 1, minHeight: 48 }}>{btnLabel}</button>

        {!!vMsg && (
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: msgColor, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.45 }}>
            <span style={{ flex: 'none' }}>{msgIcon}</span>{vMsg}
          </div>
        )}

        <a href={conf.keysUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 14, fontSize: 12.5, color: C.accent, textDecoration: 'none', borderBottom: `1px solid ${C.accent}`, paddingBottom: 1 }}>Obtenir une clé {conf.name} ›</a>
      </div>

      {vStatus === 'valid' && !!vModels.length && (
        <>
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionLabel>Modèle d'analyse</SectionLabel>
            <div style={{ fontSize: 11, color: C.sub }}>{vModels.length} disponibles</div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vModels.map((m) => {
              const sel = vModel === m.id
              return (
                <div key={m.id} onClick={() => selectVModel(m.id)} style={{ background: '#fff', border: `1.5px solid ${sel ? C.accent : C.cardBorder}`, boxShadow: C.cardShadow, borderRadius: 14, padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? C.accent : C.grayA}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: sel ? C.accent : 'transparent' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: C.label, fontFamily: mono, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.id}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 14, background: C.tile, borderRadius: 12, padding: 14, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
            Modèle vision actif : <span style={{ fontWeight: 700, color: C.espresso }}>{visionModelName}</span>
          </div>
        </>
      )}
    </>
  )
}
