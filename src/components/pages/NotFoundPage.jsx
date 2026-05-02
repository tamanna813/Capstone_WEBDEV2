import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="relative mb-8">
        <p className="font-display text-[12rem] text-white/5 leading-none select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <p className="font-display text-6xl text-gradient mb-2">LOST?</p>
            <p className="text-white/40 text-sm">This page doesn't exist in the multiverse</p>
          </div>
        </div>
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/30"
      >
        <Home size={16} />
        Back to Home
      </Link>
    </div>
  )
}
