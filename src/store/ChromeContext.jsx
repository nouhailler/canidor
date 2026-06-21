import { createContext, useContext } from 'react'

// Lets list/detail screens (Catalogue, Carte du monde) override the app-bar
// title + back behaviour while a detail is open, and lets any screen navigate.
export const ChromeContext = createContext(null)
export const useChrome = () => useContext(ChromeContext)
