import { C } from '../theme'

const HomeIcon = (p) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3.2 11.3 12 4l8.8 7.3" /><path d="M5.4 9.6V20h13.2V9.6" /><path d="M9.6 20v-5.2h4.8V20" />
  </svg>
)
const ToolsIcon = (p) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M11 3.5c.8 4.3 2.2 5.7 6.5 6.5-4.3.8-5.7 2.2-6.5 6.5-.8-4.3-2.2-5.7-6.5-6.5 4.3-.8 5.7-2.2 6.5-6.5z" />
    <path d="M18 14.5c.4 1.9 1 2.6 2.9 3-1.9.4-2.5 1-2.9 3-.4-2-1-2.6-2.9-3 1.9-.4 2.5-1.1 2.9-3z" />
  </svg>
)
const HealthIcon = (p) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 20.3C7.5 17 4.5 14 4.5 10.4A3.7 3.7 0 0 1 12 8.2a3.7 3.7 0 0 1 7.5 2.2C19.5 14 16.5 17 12 20.3z" />
    <path d="M6.6 12h2.4l1.1-2.1 1.7 4 1.2-1.9h2.6" />
  </svg>
)
const ProfileIcon = (p) => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <ellipse cx="7" cy="9.2" rx="1.7" ry="2.3" /><ellipse cx="12" cy="7.4" rx="1.8" ry="2.5" /><ellipse cx="17" cy="9.2" rx="1.7" ry="2.3" />
    <path d="M12 11.4c-2.4 0-4.3 1.9-4.3 3.9 0 1.7 1.4 2.8 3 2.8.6 0 .9-.2 1.3-.2s.7.2 1.3.2c1.6 0 3-1.1 3-2.8 0-2-1.9-3.9-4.3-3.9z" />
  </svg>
)

const ITEMS = [
  { tab: 'home', label: 'Accueil', Icon: HomeIcon },
  { tab: 'tools', label: 'Fonctions', Icon: ToolsIcon },
  { tab: 'health', label: 'Santé', Icon: HealthIcon },
  { tab: 'profile', label: 'Profil', Icon: ProfileIcon },
]

export default function TabBar({ activeTab, onSelect }) {
  return (
    <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flex: 'none', display: 'flex', background: 'rgba(250,250,247,.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: `1px solid ${C.track}`, padding: '8px 12px 26px', zIndex: 20 }}>
      {ITEMS.map(({ tab, label, Icon }) => {
        const active = activeTab === tab
        const color = active ? C.accent : C.navInactive
        return (
          <button
            key={tab}
            className="reset"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            onClick={() => onSelect(tab)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', color }}
          >
            <div style={{ width: 48, height: 30, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? C.tabActiveBg : 'transparent', transition: 'background .2s' }}>
              <Icon />
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.02em' }}>{label}</div>
          </button>
        )
      })}
    </nav>
  )
}
