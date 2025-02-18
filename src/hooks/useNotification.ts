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
    set({ isOpen: true, title, message, type })
    // Fecha a notificação após 3 segundos
    setTimeout(() => {
      set({ isOpen: false })
    }, 3000)
  },
  hideNotification: () => set({ isOpen: false })
})) 