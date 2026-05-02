import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import NotificationStack from '../common/Notifications'
import { useApp } from '../../context/AppContext'

export default function Layout() {
  const { darkMode } = useApp()

  return (
    <div className={`min-h-screen noise-bg ${darkMode ? 'dark' : 'light'}`} style={{
      background: darkMode
        ? 'radial-gradient(ellipse at 20% 0%, rgba(255,61,49,0.08) 0%, transparent 60%), #0a0a0f'
        : 'radial-gradient(ellipse at 20% 0%, rgba(255,61,49,0.05) 0%, transparent 60%), #f5f5fa',
    }}>
      <Navbar />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-white/[0.04] mt-16 py-8 text-center">
        <p className="text-white/20 text-xs font-mono">
          MEDIAVERSE © {new Date().getFullYear()} — Powered by TMDB API
        </p>
      </footer>
      <NotificationStack />
    </div>
  )
}
