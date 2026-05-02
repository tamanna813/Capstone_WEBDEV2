import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onNext, onPrev, onGoTo }) {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onGoTo(1)} className="w-9 h-9 rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white text-sm transition-all">
            1
          </button>
          {start > 2 && <span className="text-white/30 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onGoTo(p)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
            p === page
              ? 'brand-gradient text-white shadow-lg shadow-brand-500/30'
              : 'bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-white/30 px-1">…</span>}
          <button onClick={() => onGoTo(totalPages)} className="w-9 h-9 rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white text-sm transition-all">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
