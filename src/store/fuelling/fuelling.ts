import { create } from 'zustand'

interface Compartment {
  id: number
  capacity: number
  quantity: number
  odometer: number
  fuel: {
    value: number
    label: string
  }
}

interface FuellingData {
  currentCompartment: Compartment | undefined

  setCurrentCompartment: (compartment: Compartment) => void
}

export const useFuelling = create<FuellingData>((set) => {
  return {
    currentCompartment: undefined,

    setCurrentCompartment(compartment) {
      set({ currentCompartment: compartment })
    },
  }
})
