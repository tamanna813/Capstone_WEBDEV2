import { useEffect } from 'react'
import { CheckCircle, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function Toast({ notification }) {
  const { removeNotification } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => removeNotification(notification.id), 3000)
    return () => clearTimeout(timer)
  }, [notification.id, removeNotification])

  const icons = {
    success: <CheckCircle size={16} className="text-green-400 flex-shrink-0" />,
    info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
    error: <X size={16} className="text-red-400 flex-shrink-0" />,
  }

  return (
    <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 shadow-2xl min-w-[240px] animate-slide-up border border-white/10">
      {icons[notification.type] || icons.info}
      <span className="text-sm text-white/90 font-medium">{notification.message}</span>
      <button
        onClick={() => removeNotification(notification.id)}
        className="ml-auto text-white/40 hover:text-white/80 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function NotificationStack() {
  const { notifications } = useApp()
  if (!notifications.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <div key={n.id} className="pointer-events-auto">
          <Toast notification={n} />
        </div>
      ))}
    </div>
  )
}
