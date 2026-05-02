import { useCallback, useMemo } from 'react'
import { BarChart3, TrendingUp, Star, Film, Tv, RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from 'recharts'
import { useFetch } from '../../hooks'
import { mediaService } from '../../services/tmdb'
import { useApp } from '../../context/AppContext'
import { GENRE_COLORS, formatNumber } from '../../utils/helpers'
import { ErrorBoundary } from '../common/ErrorBoundary'

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 border border-white/10 shadow-2xl">
      <p className="text-white/60 text-xs font-mono mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  )
}

// Stat card
function StatCard({ label, value, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10',
    green: 'text-green-400 bg-green-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
  }
  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <Icon size={18} className={colorMap[color].split(' ')[0]} />
        </div>
        {trend && (
          <span className="text-green-400 text-xs font-mono bg-green-500/10 px-2 py-0.5 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-display text-3xl">{value}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const { watchlist, favorites } = useApp()

  // Fetch data for charts — refresh every 10 min
  const fetchTrending = useCallback(() => mediaService.getTrending('movie', 'week'), [])
  const { data: trendingData, loading: trendLoading, refetch, lastUpdated } =
    useFetch(fetchTrending, [], 10 * 60 * 1000)

  const fetchTopMovies = useCallback(() => mediaService.getTopRatedMovies(1), [])
  const { data: topMovies } = useFetch(fetchTopMovies, [])

  const fetchTopTV = useCallback(() => mediaService.getTopRatedTV(1), [])
  const { data: topTV } = useFetch(fetchTopTV, [])

  // Rating distribution for trending
  const ratingDistData = useMemo(() => {
    const movies = trendingData?.results || []
    const buckets = [
      { range: '9-10', min: 9, max: 10, count: 0 },
      { range: '8-9', min: 8, max: 9, count: 0 },
      { range: '7-8', min: 7, max: 8, count: 0 },
      { range: '6-7', min: 6, max: 7, count: 0 },
      { range: '5-6', min: 5, max: 6, count: 0 },
      { range: '<5', min: 0, max: 5, count: 0 },
    ]
    movies.forEach((m) => {
      const r = m.vote_average
      const bucket = buckets.find((b) => r >= b.min && r < b.max)
      if (bucket) bucket.count++
    })
    return buckets
  }, [trendingData])

  // Top 10 trending by popularity
  const popularityData = useMemo(() => {
    return (trendingData?.results || [])
      .slice(0, 10)
      .map((m) => ({
        name: (m.title || m.name || '').slice(0, 15) + (m.title?.length > 15 ? '…' : ''),
        popularity: Math.round(m.popularity),
        rating: m.vote_average,
      }))
  }, [trendingData])

  // Genre breakdown from top movies
  const genreData = useMemo(() => {
    const all = [
      ...(topMovies?.results || []),
      ...(topTV?.results || []),
    ]
    const genreMap = {}
    all.forEach((item) => {
      item.genre_ids?.forEach((gid) => {
        genreMap[gid] = (genreMap[gid] || 0) + 1
      })
    })
    return Object.entries(genreMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id, count]) => ({ name: `Genre ${id}`, value: count }))
  }, [topMovies, topTV])

  // Watchlist ratings line
  const watchlistData = useMemo(() => {
    return watchlist.map((item, i) => ({
      name: (item.title || '').slice(0, 10),
      rating: item.vote_average || 0,
      index: i + 1,
    }))
  }, [watchlist])

  const avgTrendingRating = useMemo(() => {
    const movies = trendingData?.results || []
    if (!movies.length) return 0
    return (movies.reduce((s, m) => s + m.vote_average, 0) / movies.length).toFixed(2)
  }, [trendingData])

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-brand-400" />
          <h1 className="font-display text-4xl text-white tracking-wider">ANALYTICS</h1>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-white/30 text-xs font-mono hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refetch}
            disabled={trendLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 text-white/60 hover:text-white hover:bg-dark-600 text-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={trendLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Trending Movies"
          value={trendingData?.total_results ? formatNumber(trendingData.total_results) : '—'}
          icon={TrendingUp}
          color="brand"
          trend="Live"
        />
        <StatCard
          label="Avg Trending Rating"
          value={avgTrendingRating || '—'}
          icon={Star}
          color="yellow"
        />
        <StatCard
          label="My Watchlist"
          value={watchlist.length}
          icon={Film}
          color="blue"
        />
        <StatCard
          label="My Favorites"
          value={favorites.length}
          icon={Tv}
          color="green"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popularity bar chart */}
        <ErrorBoundary>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-white mb-4 tracking-wider">TOP 10 BY POPULARITY</h3>
            {trendLoading ? (
              <div className="h-[280px] shimmer rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={popularityData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="popularity" fill="#ff3d31" radius={[4, 4, 0, 0]} name="Popularity" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ErrorBoundary>

        {/* Rating distribution */}
        <ErrorBoundary>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-white mb-4 tracking-wider">RATING DISTRIBUTION</h3>
            {trendLoading ? (
              <div className="h-[280px] shimmer rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratingDistData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Count">
                    {ratingDistData.map((entry, i) => (
                      <Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ErrorBoundary>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre pie */}
        <ErrorBoundary>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-white mb-4 tracking-wider">GENRE MIX (TOP RATED)</h3>
            {!topMovies ? (
              <div className="h-[280px] shimmer rounded-xl" />
            ) : genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {genreData.map((entry, i) => (
                      <Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-white/30 text-sm">No genre data</div>
            )}
          </div>
        </ErrorBoundary>

        {/* Watchlist ratings */}
        <ErrorBoundary>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl text-white mb-4 tracking-wider">MY WATCHLIST RATINGS</h3>
            {watchlistData.length === 0 ? (
              <div className="h-[280px] flex flex-col items-center justify-center text-white/30">
                <Film size={40} className="mb-3 opacity-30" />
                <p className="text-sm">Add movies to your watchlist to see ratings here</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={watchlistData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3d31" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff3d31" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke="#ff3d31"
                    strokeWidth={2}
                    fill="url(#ratingGradient)"
                    name="Rating"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ErrorBoundary>
      </div>

      {/* Rating vs Popularity scatter-style */}
      <ErrorBoundary>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-xl text-white mb-4 tracking-wider">RATING vs POPULARITY TREND</h3>
          {trendLoading ? (
            <div className="h-[220px] shimmer rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={popularityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line yAxisId="left" type="monotone" dataKey="popularity" stroke="#ff3d31" strokeWidth={2} dot={false} name="Popularity" />
                <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#38bdf8" strokeWidth={2} dot={false} name="Rating" />
                <Legend formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{value}</span>} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ErrorBoundary>
    </div>
  )
}
