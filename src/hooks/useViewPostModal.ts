import { create } from 'zustand'
import { Post } from '@prisma/client'

interface ViewPostModalStore {
  open: boolean
  post: Post | null
  handleOpen: (post: Post) => void
  handleClose: () => void
}

export const useViewPostModal = create<ViewPostModalStore>((set) => ({
  open: false,
  post: null,
  handleOpen: (post) => set({ open: true, post }),
  handleClose: () => set({ open: false, post: null }),
})) 