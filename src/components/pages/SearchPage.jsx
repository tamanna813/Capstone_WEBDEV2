import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Film, Tv, User } from 'lucide-react'
import { useFetch, useDebounce, usePagination } from '../../hooks'
import { mediaService } from '../../services/tmdb'
import MediaCard from '../common/MediaCard'
import Pagination from '../common/Pagination'
import { SkeletonCard } from '../common/Skeleton'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { getImageUrl } from '../../services/tmdb'

const TYPE_FILTERS = [
  { value: 'all', label: 'All', icon: Search },
  { value: 'movie', label: 'Movies', icon: Film },
  { value: 'tv', label: 'TV Shows', icon: Tv },
  { value: 'person', label: 'People', icon: User },
]

function PersonCard({ person }) {
  return (
    <div className="glass rounded-2xl overflow-hidden card-hover animate-fade-in">
      <div className="aspect-[2/3] overflow-hidden bg-dark-600">
        {person.profile_path ? (
          <img
            src={getImageUrl(person.profile_path, 'w342')}
            alt={person.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={48} className="text-white/20" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-white line-clamp-1">{person.name}</h3>
        <p className="text-white/40 text-xs mt-1">{person.known_for_department}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {person.known_for?.slice(0, 2).map((m) => (
            <span key={m.id} className="text-[10px] text-white/30 bg-dark-600 px-2 py-0.5 rounded-md line-clamp-1">
              {m.title || m.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [localQuery, setLocalQuery] = useState(initialQuery)
  const [typeFilter, setTypeFilter] = useState('all')
  const { page, totalPages, setTotalPages, nextPage, prevPage, goToPage, reset } = usePagination()

  const debouncedQuery = useDebounce(localQuery, 400)

  const fetchResults = useCallback(() => {
    if (!debouncedQuery.trim()) return Promise.resolve({ results: [], total_results: 0, total_pages: 0 })
    return mediaService.searchMulti(debouncedQuery, page).then((data) => {
      setTotalPages(Math.min(data.total_pages, 500))
      return data
    })
  }, [debouncedQuery, page]) // eslint-disable-line

  const { data, loading, error } = useFetch(fetchResults, [debouncedQuery, page])

  const handleQueryChange = (val) => {
    setLocalQuery(val)
    reset()
  }

  let results = data?.results || []

  // Type filter
  if (typeFilter !== 'all') {
    results = results.filter((r) => r.media_type === typeFilter)
  }

  // Remove adult/empty results
  results = results.filter((r) => r.poster_path || r.profile_path)

  const counts = {
    all: data?.results?.length || 0,
    movie: data?.results?.filter((r) => r.media_type === 'movie').length || 0,
    tv: data?.results?.filter((r) => r.media_type === 'tv').length || 0,
    person: data?.results?.filter((r) => r.media_type === 'person').length || 0,
  }

  return (
    <div className="animate-fade-in">
      {/* Header + Search */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Search size={22} className="text-brand-400" />
          <h1 className="font-display text-4xl text-white tracking-wider">SEARCH</h1>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search for movies, TV shows, people…"
            className="w-full bg-dark-700 border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-base text-white placeholder-white/30 focus:outline-none focus:border-brand-500/60 focus:bg-dark-600 transition-all"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {debouncedQuery && (
          <p className="text-white/30 text-sm font-mono mt-3">
            {data?.total_results?.toLocaleString() || 0} results for "{debouncedQuery}"
          </p>
        )}
      </div>

      {/* Type filter tabs */}
      {debouncedQuery && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {TYPE_FILTERS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                typeFilter === value
                  ? 'brand-gradient text-white'
                  : 'bg-dark-700 text-white/60 hover:text-white hover:bg-dark-600'
              }`}
            >
              <Icon size={13} />
              {label}
              <span className="ml-1 text-xs opacity-60">({counts[value]})</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!debouncedQuery && (
        <div className="text-center py-20">
          <Search size={64} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 text-lg font-display tracking-wider">START TYPING TO DISCOVER</p>
          <p className="text-white/20 text-sm mt-1">Movies, TV shows, actors, and more</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* No results */}
      {debouncedQuery && !loading && results.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg font-display tracking-wider">NO RESULTS FOUND</p>
          <p className="text-white/20 text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* Results grid */}
      <ErrorBoundary>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item, i) =>
              item.media_type === 'person' ? (
                <PersonCard key={item.id} person={item} />
              ) : (
                <MediaCard key={item.id} item={item} type={item.media_type} index={i} />
              )
            )}
          </div>
        )}
      </ErrorBoundary>

      {debouncedQuery && (
        <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} onGoTo={goToPage} />
      )}
    </div>
  )
}
