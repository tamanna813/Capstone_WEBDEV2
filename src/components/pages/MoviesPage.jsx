import { useState, useCallback } from 'react'
import { Film, SlidersHorizontal, X } from 'lucide-react'
import { useFetch, usePagination } from '../../hooks'
import { mediaService } from '../../services/tmdb'
import MediaCard from '../common/MediaCard'
import Pagination from '../common/Pagination'
import { SkeletonCard } from '../common/Skeleton'
import { ErrorBoundary } from '../common/ErrorBoundary'

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
]

const CATEGORIES = [
  { id: 'popular', label: 'Popular', fn: (p) => mediaService.getPopularMovies(p) },
  { id: 'top_rated', label: 'Top Rated', fn: (p) => mediaService.getTopRatedMovies(p) },
  { id: 'now_playing', label: 'Now Playing', fn: (p) => mediaService.getNowPlaying(p) },
  { id: 'upcoming', label: 'Upcoming', fn: (p) => mediaService.getUpcomingMovies(p) },
]

export default function MoviesPage() {
  const [category, setCategory] = useState('popular')
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const { page, totalPages, setTotalPages, nextPage, prevPage, goToPage, reset } = usePagination()

  const currentCat = CATEGORIES.find((c) => c.id === category)

  const fetchMovies = useCallback(
    () => currentCat.fn(page).then((data) => {
      setTotalPages(Math.min(data.total_pages, 500))
      return data
    }),
    [category, page] // eslint-disable-line
  )

  const { data, loading, error, refetch } = useFetch(fetchMovies, [category, page])

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    reset()
  }

  let movies = data?.results || []
  if (minRating > 0) movies = movies.filter((m) => m.vote_average >= minRating)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Film size={22} className="text-brand-400" />
          <h1 className="font-display text-4xl text-white tracking-wider">MOVIES</h1>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            showFilters ? 'brand-gradient text-white' : 'bg-dark-700 text-white/60 hover:text-white'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
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

      {/* Filters panel */}
      {showFilters && (
        <div className="glass rounded-2xl p-5 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Filter Results</h3>
            <button
              onClick={() => { setMinRating(0) }}
              className="text-white/40 text-xs hover:text-white/70 flex items-center gap-1"
            >
              <X size={12} /> Reset
            </button>
          </div>
          <div>
            <label className="text-white/50 text-xs font-mono mb-2 block">
              Minimum Rating: <span className="text-brand-400">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
            </label>
            <input
              type="range"
              min={0}
              max={9}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>Any</span><span>9+</span>
            </div>
          </div>
        </div>
      )}

      {/* Results info */}
      <p className="text-white/30 text-sm font-mono mb-5">
        Page {page} of {totalPages} · {data?.total_results?.toLocaleString() || 0} titles
      </p>

      {/* Error */}
      {error && (
        <div className="glass rounded-2xl p-8 text-center mb-6">
          <p className="text-red-400 mb-3">{error}</p>
          <button onClick={refetch} className="brand-gradient text-white px-4 py-2 rounded-xl text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Grid */}
      <ErrorBoundary>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, i) => (
              <MediaCard key={movie.id} item={movie} type="movie" index={i} />
            ))}
          </div>
        )}
      </ErrorBoundary>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onNext={nextPage}
        onPrev={prevPage}
        onGoTo={goToPage}
      />
    </div>
  )
}
