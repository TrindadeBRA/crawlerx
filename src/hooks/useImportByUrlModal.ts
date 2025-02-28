import { create } from 'zustand'

interface ByUrlImportModalStore {
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

export const useByUrlImportModal = create<ByUrlImportModalStore>((set) => ({
  isOpen: false,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
})) 