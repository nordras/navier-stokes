import { createContext, useContext } from 'react'

export const LangContext = createContext('pt')
export const ExcerptContext = createContext(() => {})

/** t('texto em português', 'English text') → picks the active language */
export function useT() {
  const lang = useContext(LangContext)
  return (pt, en) => (lang === 'en' ? en : pt)
}
export const useLang = () => useContext(LangContext)
export const useOpenExcerpt = () => useContext(ExcerptContext)
