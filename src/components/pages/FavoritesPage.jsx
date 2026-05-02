import { useState } from 'react'
import { Heart, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import MediaCard from '../common/MediaCard'
import { useDebounce } from '../../hooks'

export default function FavoritesPage() {
  const { favorites } = useApp()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const debouncedQuery = useDebounce(query, 300)

  let filtered = [...favorites]

  if (debouncedQuery) {
    filtered = filtered.filter((item) =>
      (item.title || '').toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }

  if (sortBy === 'newest') filtered.sort((a, b) => b.addedAt - a.addedAt)
  else if (sortBy === 'oldest') filtered.sort((a, b) => a.addedAt - b.addedAt)
  else if (sortBy === 'rating') filtered.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
  else if (sortBy === 'az') filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={22} className="text-red-400" />
        <h1 className="font-display text-4xl text-white tracking-wider">FAVORITES</h1>
        <span className="ml-2 px-2.5 py-0.5 bg-red-500/20 text-red-400 text-sm font-mono rounded-lg">
          {favorites.length}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <Heart size={64} className="mx-auto text-white/10 mb-4" />
          <p className="font-display text-3xl text-white/30 tracking-wider">NO FAVORITES YET</p>
          <p className="text-white/20 text-sm mt-2">Click the heart icon on any movie or TV show to add it here</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search favorites…"
                className="w-full bg-dark-700 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-700 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-brand-500/50 transition-all"
            >
              <option value="newest">Newest Added</option>
              <option value="oldest">Oldest Added</option>
              <option value="rating">Highest Rated</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-white/30">No matches for "{debouncedQuery}"</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((item, i) => (
                <MediaCard key={item.id} item={item} type={item.media_type || 'movie'} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
