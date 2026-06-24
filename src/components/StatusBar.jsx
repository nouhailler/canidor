import { C } from '../theme'

// Espace réservé en haut de l'écran (sous l'encoche / la vraie barre système en
// PWA). Les faux indicateurs de prototype (heure, signal, 5G, batterie) ont été
// retirés : sur l'appareil, c'est la barre d'état réelle qui s'affiche.
export default function StatusBar() {
  return <div style={{ flex: 'none', height: 44, background: C.cream, zIndex: 5 }} />
}
