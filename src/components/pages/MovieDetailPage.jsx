import { useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Clock, Calendar, Bookmark, Heart, ArrowLeft, ExternalLink, Play } from 'lucide-react'
import { useFetch } from '../../hooks'
import { mediaService, getImageUrl } from '../../services/tmdb'
import { formatDate, formatRuntime, formatNumber, getRatingColor, truncate } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'
import { SkeletonText } from '../common/Skeleton'
import { ErrorBoundary } from '../common/ErrorBoundary'
import MediaCard from '../common/MediaCard'

function CastCard({ person }) {
  return (
    <div className="flex-shrink-0 w-28 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 bg-dark-600 ring-2 ring-white/10">
        {person.profile_path ? (
          <img
            src={getImageUrl(person.profile_path, 'w185')}
            alt={person.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">👤</div>
        )}
      </div>
      <p className="text-white text-xs font-semibold line-clamp-1">{person.name}</p>
      <p className="text-white/40 text-[10px] line-clamp-1 mt-0.5">{person.character}</p>
    </div>
  )
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites } = useApp()

  const fetchMovie = useCallback(() => mediaService.getMovieDetails(id), [id])
  const { data: movie, loading, error } = useFetch(fetchMovie, [id])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-[400px] shimmer rounded-3xl" />
        <SkeletonText lines={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/movies" className="brand-gradient text-white px-6 py-2 rounded-xl text-sm font-semibold">
          Back to Movies
        </Link>
      </div>
    )
  }

  if (!movie) return null

  const ratingColor = getRatingColor(movie.vote_average)
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const cast = movie.credits?.cast?.slice(0, 12) || []
  const similar = movie.similar?.results?.slice(0, 6) || []

  const cardItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    media_type: 'movie',
  }

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <Link to="/movies" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Movies
      </Link>

      {/* Backdrop + Info */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        {movie.backdrop_path && (
          <img
            src={getImageUrl(movie.backdrop_path, 'w1280')}
            alt={movie.title}
            className="w-full h-[400px] object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-dark-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-transparent to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="flex gap-6 items-end">
            {/* Poster */}
            {movie.poster_path && (
              <img
                src={getImageUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                className="hidden sm:block w-32 rounded-xl shadow-2xl flex-shrink-0 ring-2 ring-white/10"
              />
            )}
            <div className="flex-1">
              <h1 className="font-display text-5xl sm:text-6xl text-white leading-none mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-white/50 italic text-sm mb-3">"{movie.tagline}"</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: ratingColor, color: '#0a0a0f' }}
                >
                  <Star size={13} fill="currentColor" />
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Calendar size={13} />
                  {formatDate(movie.release_date)}
                </span>
                <span className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Clock size={13} />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="text-white/40 text-xs font-mono">
                  {formatNumber(movie.vote_count)} votes
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="px-3 py-1 bg-dark-700/80 text-white/70 text-xs rounded-lg border border-white/10">
                    {g.name}
                  </span>
                ))}
              </div>
              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => toggleWatchlist(cardItem)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isInWatchlist(movie.id)
                      ? 'brand-gradient text-white'
                      : 'bg-dark-700/80 text-white/70 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  <Bookmark size={14} fill={isInWatchlist(movie.id) ? 'currentColor' : 'none'} />
                  {isInWatchlist(movie.id) ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  onClick={() => toggleFavorite(cardItem)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isInFavorites(movie.id)
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-dark-700/80 text-white/70 hover:text-red-400'
                  }`}
                >
                  <Heart size={14} fill={isInFavorites(movie.id) ? 'currentColor' : 'none'} />
                  Favorite
                </button>
                {trailer && (
                  <a
                    href={`https://youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors"
                  >
                    <Play size={14} fill="currentColor" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-display text-xl text-white mb-3 tracking-wider">OVERVIEW</h2>
        <p className="text-white/70 leading-relaxed">{movie.overview || 'No overview available.'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Budget', value: movie.budget ? `$${formatNumber(movie.budget)}` : 'N/A' },
          { label: 'Revenue', value: movie.revenue ? `$${formatNumber(movie.revenue)}` : 'N/A' },
          { label: 'Language', value: movie.original_language?.toUpperCase() || 'N/A' },
          { label: 'Status', value: movie.status || 'N/A' },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-xl p-4 text-center">
            <p className="text-white/40 text-xs font-mono mb-1 uppercase">{label}</p>
            <p className="text-white font-semibold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-2xl text-white mb-4 tracking-wider">CAST</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
            {cast.map((person) => <CastCard key={person.id} person={person} />)}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <ErrorBoundary>
          <div>
            <h2 className="font-display text-2xl text-white mb-4 tracking-wider">SIMILAR MOVIES</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map((m, i) => <MediaCard key={m.id} item={m} type="movie" index={i} />)}
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  )
}
