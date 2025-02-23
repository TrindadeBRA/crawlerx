import { create } from 'zustand'

type NotificationType = 'success' | 'error'

type NotificationStore = {
  isOpen: boolean
  title: string
  message: string
  type: NotificationType
  showNotification: (title: string, message: string, type: NotificationType) => void
  hideNotification: () => void
}

export const useNotification = create<NotificationStore>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  type: 'success',
  showNotification: (title, message, type) => {
    // Limpa qualquer timeout existente
    if (window._notificationTimeout) {
      clearTimeout(window._notificationTimeout)
    }

    // Mostra a nova notificação
    set({ isOpen: true, title, message, type })

    // Define um novo timeout
    window._notificationTimeout = setTimeout(() => {
      set({ isOpen: false })
    }, 5000) // Aumentei para 5 segundos para dar mais tempo de leitura
  },
  hideNotification: () => set({ isOpen: false })
}))

// Adiciona a tipagem para a variável global
declare global {
  interface Window {
    _notificationTimeout: NodeJS.Timeout | undefined
  }
} 