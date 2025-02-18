import { create } from 'zustand'

type ModalStore = {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}

export const useManualImportModal = create<ModalStore>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}))
