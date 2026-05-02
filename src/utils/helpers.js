// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format runtime
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// Format large numbers
export const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

// Rating color
export const getRatingColor = (rating) => {
  if (rating >= 8) return '#22c55e'
  if (rating >= 6) return '#eab308'
  if (rating >= 4) return '#f97316'
  return '#ef4444'
}

// Truncate text
export const truncate = (str, maxLen = 150) => {
  if (!str) return ''
  return str.length <= maxLen ? str : str.slice(0, maxLen).trimEnd() + '…'
}

// Get year from date string
export const getYear = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear()
}

// Media type label
export const getMediaLabel = (mediaType) => {
  const labels = { movie: 'Movie', tv: 'TV Show', person: 'Person' }
  return labels[mediaType] || 'Media'
}

// Sleep helper for demo/loading states
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Clamp a number between min and max
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

// Genre map for chart labels
export const GENRE_COLORS = [
  '#ff3d31', '#ff6b61', '#ff9e97', '#ffcec9',
  '#38bdf8', '#7dd3fc', '#0ea5e9', '#0284c7',
  '#a3e635', '#86efac', '#4ade80', '#22c55e',
  '#fbbf24', '#f59e0b', '#d97706', '#92400e',
]
// Build TMDB Image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};