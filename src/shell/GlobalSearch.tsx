import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { listTomes } from '@/tomes/registry'
import { buildAtlas, type Atlas } from './atlas/model'
import { SearchPalette } from './atlas/SearchPalette'

interface GlobalSearch {
  atlas: Atlas
  open: () => void
}

const Context = createContext<GlobalSearch | null>(null)

/** The atlas and a way to open the universal search, from anywhere in the app. */
export function useGlobalSearch(): GlobalSearch {
  const value = useContext(Context)
  if (!value) throw new Error('useGlobalSearch outside <GlobalSearchProvider>')
  return value
}

/**
 * Wraps every route: Ctrl+K (⌘K on a Mac) opens the search palette over the
 * Atlas or over any tome. Shell chrome only: it never touches a tome's interior.
 */
export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const atlas = useMemo(() => buildAtlas(listTomes()), [])
  const [searching, setSearching] = useState(false)
  const value = useMemo(() => ({ atlas, open: () => setSearching(true) }), [atlas])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearching((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Context.Provider value={value}>
      {children}
      {searching && <SearchPalette atlas={atlas} onClose={() => setSearching(false)} />}
    </Context.Provider>
  )
}
