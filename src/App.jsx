import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import Layout from './components/layout/Layout'

// Lazy-loaded pages for performance optimization
const HomePage = lazy(() => import('./components/pages/HomePage'))
const MoviesPage = lazy(() => import('./components/pages/MoviesPage'))
const TVPage = lazy(() => import('./components/pages/TVPage'))
const SearchPage = lazy(() => import('./components/pages/SearchPage'))
const MovieDetailPage = lazy(() => import('./components/pages/MovieDetailPage'))
const TVDetailPage = lazy(() => import('./components/pages/TVDetailPage'))
const AnalyticsPage = lazy(() => import('./components/pages/AnalyticsPage'))
const WatchlistPage = lazy(() => import('./components/pages/WatchlistPage'))
const FavoritesPage = lazy(() => import('./components/pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'))

// Loading spinner
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/30 text-sm font-mono">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ErrorBoundary showDetails>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="movie/:id" element={<MovieDetailPage />} />
                <Route path="tv" element={<TVPage />} />
                <Route path="tv/:id" element={<TVDetailPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="watchlist" element={<WatchlistPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  )
}
