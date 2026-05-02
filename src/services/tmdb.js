import axios from 'axios'

// TMDB API — Get your FREE key at https://www.themoviedb.org/settings/api
// Replace with your own key below:
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'
const BASE_URL = 'https://api.themoviedb.org/3'
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
})

// Intercept errors globally
tmdb.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.status_message || err.message || 'API error'
    return Promise.reject(new Error(msg))
  }
)

export const mediaService = {
  // Trending
  getTrending: (mediaType = 'all', timeWindow = 'week') =>
    tmdb.get(`/trending/${mediaType}/${timeWindow}`).then((r) => r.data),

  // Movies
  getPopularMovies: (page = 1) =>
    tmdb.get('/movie/popular', { params: { page } }).then((r) => r.data),

  getTopRatedMovies: (page = 1) =>
    tmdb.get('/movie/top_rated', { params: { page } }).then((r) => r.data),

  getNowPlaying: (page = 1) =>
    tmdb.get('/movie/now_playing', { params: { page } }).then((r) => r.data),

  getUpcomingMovies: (page = 1) =>
    tmdb.get('/movie/upcoming', { params: { page } }).then((r) => r.data),

  getMovieDetails: (id) =>
    tmdb.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos,similar' } }).then((r) => r.data),

  // TV Shows
  getPopularTV: (page = 1) =>
    tmdb.get('/tv/popular', { params: { page } }).then((r) => r.data),

  getTopRatedTV: (page = 1) =>
    tmdb.get('/tv/top_rated', { params: { page } }).then((r) => r.data),

  getTVDetails: (id) =>
    tmdb.get(`/tv/${id}`, { params: { append_to_response: 'credits,videos,similar' } }).then((r) => r.data),

  // Search
  searchMulti: (query, page = 1) =>
    tmdb.get('/search/multi', { params: { query, page } }).then((r) => r.data),

  // Genres
  getMovieGenres: () =>
    tmdb.get('/genre/movie/list').then((r) => r.data),

  getTVGenres: () =>
    tmdb.get('/genre/tv/list').then((r) => r.data),

  // Discover with filters
  discoverMovies: (params = {}) =>
    tmdb.get('/movie/popular', { params: { ...params } }).then((r) => r.data),
}

export const getImageUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE}${size}${path}` : '/placeholder.png'

export default mediaService
