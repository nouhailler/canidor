import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { C } from './theme'
import { SCREENS, TAB_ROOT, tabOf } from './data/screens'
import { useApp } from './store/AppContext'
import { ChromeContext } from './store/ChromeContext'
import StatusBar from './components/StatusBar'
import AppBar from './components/AppBar'
import TabBar from './components/TabBar'
import HelpSheet from './components/HelpSheet'
import Onboarding from './components/Onboarding'
import { getScreen } from './screens'

const pathFor = (id) => (id === 'home' ? '/' : `/${id}`)

export default function App() {
  const { onboarded, completeOnboarding } = useApp()
  const navigate = useNavigate()
  const params = useParams()
  const rawId = params.screenId || 'home'
  const screen = SCREENS[rawId] ? rawId : 'home'

  const [helpOpen, setHelpOpen] = useState(false)
  const [detail, setDetail] = useState(null) // { title, onBack } | null

  // Reset transient chrome whenever the screen changes.
  useEffect(() => {
    setHelpOpen(false)
    setDetail(null)
  }, [screen])

  const goScreen = useCallback((id, query) => {
    setHelpOpen(false)
    const qs = query ? '?' + new URLSearchParams(query).toString() : ''
    navigate(pathFor(id) + qs)
  }, [navigate])

  const goTab = useCallback((tab) => goScreen(TAB_ROOT[tab]), [goScreen])

  const meta = SCREENS[screen]
  const tab = tabOf(screen)

  const back = useCallback(() => {
    if (detail && detail.onBack) { detail.onBack(); return }
    goScreen(TAB_ROOT[tab])
  }, [detail, goScreen, tab])

  const chrome = useMemo(() => ({ goScreen, setDetail }), [goScreen])

  if (!onboarded) {
    return (
      <Frame>
        <StatusBar />
        <Onboarding onDone={completeOnboarding} />
      </Frame>
    )
  }

  const headerTitle = detail?.title || meta.title
  const showBack = !meta.root || !!detail
  const ScreenComponent = getScreen(screen)

  return (
    <ChromeContext.Provider value={chrome}>
      <Frame>
        <StatusBar />
        <AppBar title={headerTitle} showBack={showBack} onBack={back} onHelp={() => setHelpOpen(true)} />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ paddingBottom: 96 }}>
            <ScreenComponent key={screen} />
          </div>
        </div>
        {!helpOpen && <TabBar activeTab={tab} onSelect={goTab} />}
        {helpOpen && <HelpSheet screen={screen} title={meta.title} onClose={() => setHelpOpen(false)} />}
      </Frame>
    </ChromeContext.Provider>
  )
}

function Frame({ children }) {
  return (
    <div style={{ width: '100%', height: '100%', maxWidth: 430, margin: '0 auto', background: C.cream, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: C.espresso }}>
      {children}
    </div>
  )
}
