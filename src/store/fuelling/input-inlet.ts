import { create } from 'zustand';

interface IInputInlet {
  compartment: { label: string; value: string }[]
  tank: {
    label: string
    value: string
    comparment: { label: string; value: string }[]
  }[]
  train: {
    label: string
    value: string
    comparment: { label: string; value: string }[]
  }[]

  setCompartment: (Params: { label: string; value: string }[]) => void
  setTank: (
    Params: {
      label: string
      value: string
      comparment: { label: string; value: string }[]
    }[],
  ) => void
  setTrain: (
    Params: {
      label: string
      value: string
      comparment: { label: string; value: string }[]
    }[],
  ) => void
}

export const InputInlet = create<IInputInlet>((set) => {
  return {
    compartment: [],
    train: [],
    tank: [],

    setCompartment: (data) => {
      set({ compartment: data })
    },
    setTank: (data) => {
      set({ tank: data })
    },
    setTrain: (data) => {
      set({ train: data })
    },
  }
})
