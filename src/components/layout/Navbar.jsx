import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Sun, Moon, Bookmark, Heart, Menu, X, Tv, Film, BarChart3, Home } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useDebounce } from '../../hooks'

export default function Navbar() {
  const { darkMode, toggleDarkMode, searchQuery, setSearchQuery, watchlist, favorites } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const navigate = useNavigate()
  const location = useLocation()

  const debouncedSearch = useDebounce(localSearch, 500)

  // Trigger search navigation when debounced value changes
  useState(() => {
    if (debouncedSearch.trim()) {
      setSearchQuery(debouncedSearch)
      navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`)
    }
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (localSearch.trim()) {
      setSearchQuery(localSearch)
      navigate(`/search?q=${encodeURIComponent(localSearch)}`)
    }
  }

  const handleSearchChange = (val) => {
    setLocalSearch(val)
    if (val.trim().length > 2) {
      setSearchQuery(val)
      navigate(`/search?q=${encodeURIComponent(val)}`)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/tv', label: 'TV Shows', icon: Tv },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
              <span className="font-display text-white text-lg leading-none">M</span>
            </div>
            <span className="font-display text-xl text-white tracking-wider hidden sm:block">
              MEDIA<span className="text-gradient">VERSE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-brand-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm ml-auto md:ml-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search movies, TV…"
                className="w-full bg-dark-700 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-500/50 focus:bg-dark-600 transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Watchlist */}
            <Link
              to="/watchlist"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              title="Watchlist"
            >
              <Bookmark size={17} />
              {watchlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 brand-gradient rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {watchlist.length > 9 ? '9+' : watchlist.length}
                </span>
              )}
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
              title="Favorites"
            >
              <Heart size={17} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-white/[0.06] animate-slide-up">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(to) ? 'text-brand-400 bg-brand-500/10' : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
