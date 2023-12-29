import { create } from 'zustand'

interface LoadingStoreProps {
  loading: boolean

  show: () => void
  hide: () => void
}

export const useLoading = create<LoadingStoreProps>((set) => {
  return {
    loading: false,

    show: () => {
      set({ loading: true })
    },

    hide: () => {
      set({ loading: false })
    },
  }
})
