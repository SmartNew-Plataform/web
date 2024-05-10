import { create } from 'zustand'

export interface IChildren {
  [key: string]: string
}

export interface IImportationForData {
  [key: string]: string
}

interface IImportationData {
  columns: undefined | Array<object>
  rows: undefined | Array<object>
  data: IImportationForData[] & {
    children?: IImportationForData[]
  }
  indexModal: number | undefined
  children: { [key: string]: string }[] | undefined
  childrenIndex: number | undefined
  columnItem: undefined | Array<object>
  setIndexModal: (Params: number | undefined) => void
  setData: (Params: { [key: string]: string }[]) => void
  setColumns: (Params: { [key: string]: string }) => void
  setRows: (Params: undefined | Array<object>) => void
  setChildren: (Params: { [key: string]: string }[] | undefined) => void
  setChildrenIndex: (index: number | undefined) => void
  setColumnItem: (Params: { [key: string]: string }) => void
}

export const useImportation = create<IImportationData>((set) => {
  return {
    data: [],
    columns: [],
    children: [],
    columnItem: [],
    indexModal: undefined,
    rows: undefined,
    childrenIndex: undefined,

    setChildrenIndex(index) {
      set({ childrenIndex: index })
    },

    setIndexModal: (value: number | undefined) => {
      set({ indexModal: value })
    },
    setColumns: (columns) => {
      // console.log('eu recebi essa coluna')
      // console.log(columns)
      const keys = Object.keys(columns).map((column) => ({
        header: column,
        accessorKey: column,
        typeColumn: columns[column],
      }))

      set({ columns: keys })
    },
    setRows: (rows) => {
      set({ rows })
    },
    setData: (data) => {
      // console.log('nova data')
      // console.log(data)
      set({ data })
    },
    setChildren: (children) => {
      // console.log('novo filho')
      // console.log(children)
      set({ children })
    },
    setColumnItem: (columns) => {
      // console.log('setando coluna')
      // console.log(columns)
      const keys = Object.keys(columns).map((column) => ({
        header: column,
        accessorKey: column,
        typeColumn: columns[column],
      }))

      set({ columnItem: keys })
    },
  }
})
