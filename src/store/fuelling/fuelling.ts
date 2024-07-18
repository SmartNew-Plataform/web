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

interface TankState {
  tankId: string | undefined
  compartments: { id: string; label: string }[]
  setTankId: (tankId: string) => void
  setCompartments: (compartments: { id: string; label: string }[]) => void
}

export const useTankStore = create<TankState>((set) => ({
  tankId: undefined,
  compartments: [],
  setTankId: (tankId) => set((state) => ({ ...state, tankId })),
  setCompartments: (compartments) =>
    set((state) => ({ ...state, compartments })),
}))
