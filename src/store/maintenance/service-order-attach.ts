import { create } from 'zustand'

interface ServiceOrderAttachProps {
  defaultData: File[] | undefined

  setDefaultData: (data: File[] | undefined) => void
}

export const useServiceOrderAttach = create<ServiceOrderAttachProps>((set) => {
  return {
    defaultData: undefined,

    setDefaultData(data: File[] | undefined) {
      set({ defaultData: data })
    },
  }
})
