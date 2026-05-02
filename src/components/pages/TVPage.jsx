import { useState, useCallback } from 'react'
import { Tv } from 'lucide-react'
import { useFetch, usePagination } from '../../hooks'
import { mediaService } from '../../services/tmdb'
import MediaCard from '../common/MediaCard'
import Pagination from '../common/Pagination'
import { SkeletonCard } from '../common/Skeleton'
import { ErrorBoundary } from '../common/ErrorBoundary'

const CATEGORIES = [
  { id: 'popular', label: 'Popular', fn: (p) => mediaService.getPopularTV(p) },
  { id: 'top_rated', label: 'Top Rated', fn: (p) => mediaService.getTopRatedTV(p) },
]

export default function TVPage() {
  const [category, setCategory] = useState('popular')
  const { page, totalPages, setTotalPages, nextPage, prevPage, goToPage, reset } = usePagination()

  const currentCat = CATEGORIES.find((c) => c.id === category)

  const fetchTV = useCallback(
    () => currentCat.fn(page).then((data) => {
      setTotalPages(Math.min(data.total_pages, 500))
      return data
    }),
    [category, page] // eslint-disable-line
  )

  const { data, loading, error, refetch } = useFetch(fetchTV, [category, page])

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    reset()
  }

  const shows = data?.results || []

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Tv size={22} className="text-brand-400" />
        <h1 className="font-display text-4xl text-white tracking-wider">TV SHOWS</h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              category === cat.id
                ? 'brand-gradient text-white shadow-lg shadow-brand-500/20'
                : 'bg-dark-700 text-white/60 hover:text-white hover:bg-dark-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results info */}
      <p className="text-white/30 text-sm font-mono mb-5">
        Page {page} of {totalPages} · {data?.total_results?.toLocaleString() || 0} shows
      </p>

      {error && (
        <div className="glass rounded-2xl p-8 text-center mb-6">
          <p className="text-red-400 mb-3">{error}</p>
          <button onClick={refetch} className="brand-gradient text-white px-4 py-2 rounded-xl text-sm">Try Again</button>
        </div>
      )}

      <ErrorBoundary>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shows.map((show, i) => (
              <MediaCard key={show.id} item={show} type="tv" index={i} />
            ))}
          </div>
        )}
      </ErrorBoundary>

      <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} onGoTo={goToPage} />
    </div>
  )
}
