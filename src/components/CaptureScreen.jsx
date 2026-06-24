import { useState } from 'react'
import { useAnalysis } from '../hooks/useAnalysis'
import { Screen, Intro, ScanBox } from './ui'
import { AIResultCard, ConnectKeyNote } from './ai'

// Capture-IA archetype: idle -> analyzing (scan + spinner) -> result.
// idle / result are render props so each screen keeps its bespoke layout.
// L'image choisie (data URL) est conservée ici et envoyée au modèle vision.
export default function CaptureScreen({
  intro,
  idle,
  analyzingLabel,
  scanDur = '1.6s',
  scanHeight = 280,
  result,
  buildInstruction,
  image: initialImage,
  showConnectHint = true,
}) {
  const { stage, start, reset, aiText, aiError, aiReady } = useAnalysis()
  const [image, setImage] = useState(initialImage || null)
  const run = () => start({ instruction: buildInstruction ? buildInstruction() : undefined, image })

  return (
    <Screen>
      {stage === 'idle' && (
        <>
          {intro && <Intro>{intro}</Intro>}
          {idle({ start: run, image, pickImage: setImage })}
        </>
      )}

      {stage === 'analyzing' && (
        <div style={{ marginTop: 18 }}>
          <ScanBox label={analyzingLabel} height={scanHeight} scanDur={scanDur} />
        </div>
      )}

      {stage === 'result' && (
        <div style={{ animation: 'rise .4s ease' }}>
          {result({ reset })}
          {aiReady ? (
            (aiText || aiError) && <div style={{ marginTop: 14 }}><AIResultCard text={aiText} error={aiError} /></div>
          ) : (
            showConnectHint && <div style={{ marginTop: 14 }}><ConnectKeyNote compact /></div>
          )}
        </div>
      )}
    </Screen>
  )
}
