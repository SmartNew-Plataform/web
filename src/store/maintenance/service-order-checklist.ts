import { create } from 'zustand'

interface ServiceOrderChecklistProps {
  sheetChecklistOpen: boolean

  setSheetChecklistOpen: (open: boolean) => void
}

export const useServiceOrderChecklist = create<ServiceOrderChecklistProps>(
  (set) => {
    return {
      sheetChecklistOpen: false,

      setSheetChecklistOpen(open) {
        set({ sheetChecklistOpen: open })
      },
    }
  },
)
