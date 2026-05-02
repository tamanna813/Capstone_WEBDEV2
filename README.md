# 🎬 MediaVerse — Entertainment & Media Dashboard

A full-featured React application for discovering movies and TV shows, built with:
- **React 18** + **Vite**
- **React Router v6** — multi-page routing
- **Context API** — global state management
- **Tailwind CSS** — utility-first styling
- **Recharts** — analytics dashboard
- **TMDB API** — real movie/TV data

---

## 🚀 Getting Started

### 1. Get a FREE TMDB API Key
1. Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. After signing up, go to **Settings → API**
3. Request a free API key (instant approval)

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env and replace 'your_api_key_here' with your real key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.jsx   # React Error Boundary
│   │   ├── MediaCard.jsx       # Reusable movie/TV card
│   │   ├── Notifications.jsx   # Toast notifications
│   │   ├── Pagination.jsx      # Page navigation
│   │   └── Skeleton.jsx        # Loading skeletons
│   ├── layout/
│   │   ├── Layout.jsx          # Root layout
│   │   └── Navbar.jsx          # Top navigation
│   └── pages/
│       ├── HomePage.jsx        # Home with trending
│       ├── MoviesPage.jsx      # Movies with filters + pagination
│       ├── TVPage.jsx          # TV Shows
│       ├── SearchPage.jsx      # Debounced search
│       ├── MovieDetailPage.jsx # Movie detail
│       ├── TVDetailPage.jsx    # TV detail
│       ├── AnalyticsPage.jsx   # Charts dashboard
│       ├── WatchlistPage.jsx   # Saved watchlist
│       ├── FavoritesPage.jsx   # Favorites
│       └── NotFoundPage.jsx    # 404
├── context/
│   └── AppContext.jsx          # Global Context API state
├── hooks/
│   └── index.js                # Custom hooks (useFetch, useDebounce, etc.)
├── services/
│   └── tmdb.js                 # TMDB API service layer
└── utils/
    └── helpers.js              # Utility functions
```

---

## ✅ Features Implemented

### Core Requirements
- ✅ React 18 + Vite
- ✅ React Router v6 with lazy loading
- ✅ Context API (global state, watchlist, favorites, dark mode)
- ✅ TMDB Public API + Axios
- ✅ Tailwind CSS custom theme
- ✅ CRUD — Add/Remove watchlist & favorites (localStorage)

### Advanced Features (3+ ✅)
- ✅ **Real-time Data Refresh** — Trending auto-refreshes every 5 min, Analytics every 10 min
- ✅ **Debounced API Calls** — Search input debounced at 400ms
- ✅ **Error Boundary** — Class-based ErrorBoundary wrapping every section
- ✅ **Pagination** — Full pagination on Movies & TV pages
- ✅ **Search + Filter + Sort** — Multi-type search, rating filter, sort options
- ✅ **Dark Mode Toggle** — Persisted dark/light theme
- ✅ **Lazy Loading** — All pages code-split with React.lazy + Suspense
- ✅ **Performance** — Skeleton loaders, memoized callbacks, lazy images
- ✅ **Dashboard with Charts** — Bar, Pie, Area, Line charts via Recharts

---

## 🌐 Deployment (Vercel)

```bash
npm run build
# Deploy /dist folder to Vercel or Netlify
# Set VITE_TMDB_API_KEY in your deployment environment variables
```

---

## 📚 Tech Stack Summary

| Tech | Usage |
|------|-------|
| React 18 | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Context API + useReducer | State management |
| Axios | HTTP client |
| TMDB API | Data source |
| Tailwind CSS | Styling |
| Recharts | Data visualization |
| localStorage | Persistent watchlist/favorites |

---

*Domain: Entertainment & Media | API: TMDB (The Movie Database)*
