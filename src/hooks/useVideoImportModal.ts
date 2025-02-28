import { create } from 'zustand'

interface VideoImportModalStore {
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

export const useVideoImportModal = create<VideoImportModalStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
})) 