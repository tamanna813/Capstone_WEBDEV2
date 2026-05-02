import { useState, useEffect, useCallback, useRef } from 'react'

// ── useDebounce ───────────────────────────────────────────────────────────────
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// ── useFetch — with auto-refresh ──────────────────────────────────────────────
export function useFetch(fetchFn, deps = [], refreshInterval = null) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const mountedRef = useRef(true)

  const fetch = useCallback(async () => {
    if (!fetchFn) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      if (mountedRef.current) {
        setData(result)
        setLastUpdated(new Date())
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Something went wrong')
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mountedRef.current = true
    fetch()
    return () => { mountedRef.current = false }
  }, [fetch])

  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval) return
    const interval = setInterval(fetch, refreshInterval)
    return () => clearInterval(interval)
  }, [fetch, refreshInterval])

  return { data, loading, error, refetch: fetch, lastUpdated }
}

// ── usePagination ─────────────────────────────────────────────────────────────
export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)

  const nextPage = useCallback(() => setPage((p) => Math.min(p + 1, totalPages)), [totalPages])
  const prevPage = useCallback(() => setPage((p) => Math.max(p - 1, 1)), [])
  const goToPage = useCallback((p) => setPage(Math.max(1, Math.min(p, totalPages))), [totalPages])
  const reset = useCallback(() => setPage(1), [])

  return { page, totalPages, setTotalPages, nextPage, prevPage, goToPage, reset }
}

// ── useLocalStorage ───────────────────────────────────────────────────────────
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = useCallback(
    (val) => {
      const toStore = typeof val === 'function' ? val(value) : val
      setValue(toStore)
      localStorage.setItem(key, JSON.stringify(toStore))
    },
    [key, value]
  )

  return [value, setStoredValue]
}

// ── useIntersectionObserver (infinite scroll) ─────────────────────────────────
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [options])

  return [ref, isIntersecting]
}
