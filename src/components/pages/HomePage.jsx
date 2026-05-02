import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Film, Tv, RefreshCw, Clock } from 'lucide-react'
import { useFetch } from '../../hooks'
import { mediaService } from '../../services/tmdb'
import MediaCard from '../common/MediaCard'
import { SkeletonCard, SkeletonHero } from '../common/Skeleton'
import { ErrorBoundary } from '../common/ErrorBoundary'
import { formatDate } from '../../utils/helpers'

// Hero Banner
function HeroBanner({ item }) {
  if (!item) return null
  const bg = item.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
    : null

  return (
    <div className="relative rounded-3xl overflow-hidden h-[420px] sm:h-[500px] mb-12 animate-fade-in">
      {bg && (
        <img src={bg} alt={item.title || item.name} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-end p-8 sm:p-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
              Trending #{1}
            </span>
            <span className="text-white/50 text-xs font-mono">
              {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-3 leading-none">
            {item.title || item.name}
          </h1>
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-5">
            {item.overview}
          </p>
          <Link
            to={item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`}
            className="inline-flex items-center gap-2 brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/30"
          >
            <Film size={16} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

// Section header
function SectionHeader({ title, icon: Icon, to, lastUpdated, onRefresh, refreshing }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-brand-400" />
        <h2 className="font-display text-2xl text-white tracking-wider">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="hidden sm:flex items-center gap-1 text-white/30 text-xs font-mono">
            <Clock size={11} />
            {formatDate(lastUpdated)}
          </span>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 text-white/50 hover:text-white hover:bg-dark-600 transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
        )}
        {to && (
          <Link to={to} className="text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors">
            View all →
          </Link>
        )}
      </div>
    </div>
  )
}

// Media grid
function MediaGrid({ items, type, loading, cols = 6 }) {
  const colClass = {
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  }[cols] || 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-4`}>
        {Array.from({ length: cols }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-4`}>
      {items?.map((item, i) => (
        <MediaCard key={item.id} item={item} type={type} index={i} />
      ))}
    </div>
  )
}

export default function HomePage() {
  // Trending — auto-refresh every 5 minutes
  const { data: trendingData, loading: trendingLoading, refetch: refreshTrending, lastUpdated: trendingUpdated } =
    useFetch(() => mediaService.getTrending('all', 'day'), [], 5 * 60 * 1000)

  const { data: popularMovies, loading: moviesLoading } =
    useFetch(() => mediaService.getPopularMovies(), [])

  const { data: popularTV, loading: tvLoading, refetch: refreshTV, lastUpdated: tvUpdated } =
    useFetch(() => mediaService.getPopularTV(), [], 10 * 60 * 1000)

  const { data: nowPlaying, loading: nowLoading } =
    useFetch(() => mediaService.getNowPlaying(), [])

  const trending = trendingData?.results || []
  const hero = trending[0]

  return (
    <div className="space-y-14 animate-fade-in">
      {/* Hero */}
      <ErrorBoundary>
        {trendingLoading ? <SkeletonHero /> : <HeroBanner item={hero} />}
      </ErrorBoundary>

      {/* Trending */}
      <section>
        <SectionHeader
          title="TRENDING TODAY"
          icon={TrendingUp}
          lastUpdated={trendingUpdated}
          onRefresh={refreshTrending}
          refreshing={trendingLoading}
        />
        <ErrorBoundary>
          <MediaGrid items={trending.slice(1, 7)} type="movie" loading={trendingLoading} cols={6} />
        </ErrorBoundary>
      </section>

      {/* Popular Movies */}
      <section>
        <SectionHeader title="POPULAR MOVIES" icon={Film} to="/movies" />
        <ErrorBoundary>
          <MediaGrid items={popularMovies?.results?.slice(0, 6)} type="movie" loading={moviesLoading} cols={6} />
        </ErrorBoundary>
      </section>

      {/* Now Playing */}
      <section>
        <SectionHeader title="NOW IN CINEMAS" icon={Film} to="/movies" />
        <ErrorBoundary>
          <MediaGrid items={nowPlaying?.results?.slice(0, 6)} type="movie" loading={nowLoading} cols={6} />
        </ErrorBoundary>
      </section>

      {/* Popular TV */}
      <section>
        <SectionHeader
          title="HOT TV SHOWS"
          icon={Tv}
          to="/tv"
          lastUpdated={tvUpdated}
          onRefresh={refreshTV}
          refreshing={tvLoading}
        />
        <ErrorBoundary>
          <MediaGrid items={popularTV?.results?.slice(0, 6)} type="tv" loading={tvLoading} cols={6} />
        </ErrorBoundary>
      </section>
    </div>
  )
}
