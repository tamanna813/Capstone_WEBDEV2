import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Heart, Star, Play } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getImageUrl, getRatingColor, truncate, getYear } from '../../utils/helpers'

export default function MediaCard({ item, type = 'movie', index = 0 }) {
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites } = useApp()
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const id = item.id
  const title = item.title || item.name
  const date = item.release_date || item.first_air_date
  const mediaType = item.media_type || type
  const rating = item.vote_average?.toFixed(1)
  const ratingColor = getRatingColor(item.vote_average)

  const inWatchlist = isInWatchlist(id)
  const inFavorites = isInFavorites(id)

  const detailPath = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`

  const cardItem = {
    id,
    title,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_date: date,
    media_type: mediaType,
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-dark-700 card-hover group cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <Link to={detailPath} className="block relative">
        <div className="aspect-[2/3] overflow-hidden bg-dark-600">
          {!imgError && item.poster_path ? (
            <img
              src={getImageUrl(item.poster_path, 'w342')}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark-600">
              <div className="text-center text-white/20">
                <Play size={40} className="mx-auto mb-2" />
                <span className="text-xs font-mono">No Image</span>
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                {truncate(item.overview, 120)}
              </p>
            </div>
          </div>
        </div>

        {/* Rating badge */}
        {rating && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold text-dark-900"
            style={{ backgroundColor: ratingColor }}
          >
            <Star size={10} fill="currentColor" />
            {rating}
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-dark-900/80 text-white/60 uppercase tracking-wider">
          {mediaType === 'tv' ? 'TV' : 'Film'}
        </div>
      </Link>

      {/* Info + Actions */}
      <div className="p-3">
        <Link to={detailPath}>
          <h3 className="font-semibold text-sm text-white leading-snug line-clamp-1 hover:text-brand-400 transition-colors mb-1">
            {title}
          </h3>
        </Link>
        <p className="text-white/40 text-xs font-mono mb-2">{getYear(date)}</p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleWatchlist(cardItem) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              inWatchlist
                ? 'bg-brand-500 text-white'
                : 'bg-dark-600 text-white/60 hover:bg-dark-500 hover:text-white'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark size={11} fill={inWatchlist ? 'currentColor' : 'none'} />
            {inWatchlist ? 'Saved' : 'Watch'}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(cardItem) }}
            className={`p-1.5 rounded-lg text-xs transition-all duration-200 ${
              inFavorites
                ? 'bg-red-500/20 text-red-400'
                : 'bg-dark-600 text-white/60 hover:text-red-400'
            }`}
            title={inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart size={12} fill={inFavorites ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}
