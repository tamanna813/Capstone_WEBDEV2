import React, { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

// ── State shape ──────────────────────────────────────────────────────────────
const initialState = {
  darkMode: true,
  searchQuery: '',
  activeTab: 'movies', // 'movies' | 'tv' | 'search'
  watchlist: JSON.parse(localStorage.getItem('mv_watchlist') || '[]'),
  favorites: JSON.parse(localStorage.getItem('mv_favorites') || '[]'),
  filters: {
    genre: '',
    sortBy: 'popularity.desc',
    minRating: 0,
  },
  notifications: [],
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }

    case 'TOGGLE_WATCHLIST': {
      const item = action.payload
      const exists = state.watchlist.find((w) => w.id === item.id)
      const updated = exists
        ? state.watchlist.filter((w) => w.id !== item.id)
        : [...state.watchlist, { ...item, addedAt: Date.now() }]
      localStorage.setItem('mv_watchlist', JSON.stringify(updated))
      return { ...state, watchlist: updated }
    }

    case 'TOGGLE_FAVORITE': {
      const item = action.payload
      const exists = state.favorites.find((f) => f.id === item.id)
      const updated = exists
        ? state.favorites.filter((f) => f.id !== item.id)
        : [...state.favorites, { ...item, addedAt: Date.now() }]
      localStorage.setItem('mv_favorites', JSON.stringify(updated))
      return { ...state, favorites: updated }
    }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { id: Date.now(), ...action.payload },
        ],
      }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }

    default:
      return state
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const toggleDarkMode = useCallback(() => dispatch({ type: 'TOGGLE_DARK_MODE' }), [])
  const setSearchQuery = useCallback((q) => dispatch({ type: 'SET_SEARCH_QUERY', payload: q }), [])
  const setActiveTab = useCallback((tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }), [])
  const setFilters = useCallback((f) => dispatch({ type: 'SET_FILTERS', payload: f }), [])
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), [])

  const toggleWatchlist = useCallback((item) => {
    dispatch({ type: 'TOGGLE_WATCHLIST', payload: item })
    const exists = state.watchlist.find((w) => w.id === item.id)
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: exists ? 'Removed from Watchlist' : 'Added to Watchlist! 🎬',
        type: exists ? 'info' : 'success',
      },
    })
  }, [state.watchlist])

  const toggleFavorite = useCallback((item) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: item })
    const exists = state.favorites.find((f) => f.id === item.id)
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        message: exists ? 'Removed from Favorites' : 'Added to Favorites! ❤️',
        type: exists ? 'info' : 'success',
      },
    })
  }, [state.favorites])

  const removeNotification = useCallback(
    (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    []
  )

  const isInWatchlist = useCallback(
    (id) => state.watchlist.some((w) => w.id === id),
    [state.watchlist]
  )

  const isInFavorites = useCallback(
    (id) => state.favorites.some((f) => f.id === id),
    [state.favorites]
  )

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleDarkMode,
        setSearchQuery,
        setActiveTab,
        setFilters,
        resetFilters,
        toggleWatchlist,
        toggleFavorite,
        removeNotification,
        isInWatchlist,
        isInFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
