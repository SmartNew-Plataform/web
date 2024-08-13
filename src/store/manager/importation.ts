import { ColumnDef } from '@tanstack/react-table'
import { create } from 'zustand'

export interface IChildren {
  [key: string]: string
}

export interface IImportationForData {
  [key: string]: string
}

interface IImportationData {
  columns: undefined | Array<ColumnDef<object>>
  rows: undefined | Array<object>
  data: Array<IImportationForData & { children: IImportationForData[] }>
  indexModal: number | undefined
  children: { [key: string]: string }[] | undefined
  childrenIndex: number | undefined
  columnItem: undefined | Array<ColumnDef<object>>
  setIndexModal: (Params: number | undefined) => void
  setData: (
    Params: Array<IImportationForData & { children: IImportationForData[] }>,
  ) => void
  setColumns: (Params: { [key: string]: string }) => void
  setRows: (Params: undefined | Array<object>) => void
  setChildren: (Params: { [key: string]: string }[] | undefined) => void
  setChildrenIndex: (index: number | undefined) => void
  setColumnItem: (Params: { [key: string]: string }) => void

  changeValue: (params: {
    value: { [key: string]: string }
    model: 'data' | 'children'
    id: number
  }) => void
}

export const useImportation = create<IImportationData>((set, get) => {
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
      const keys = Object.keys(columns)
        .filter((item) => item !== 'children')
        .filter((item) => item !== 'sync')
        .map((column) => ({
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
      const keys = Object.keys(columns)
        .filter((item) => item !== 'children')
        .filter((item) => item !== 'sync')
        .filter((item) => item !== 'id_pai')
        .map((column) => ({
          header: column,
          accessorKey: column,
          typeColumn: columns[column],
        }))

      console.log(keys)

      set({ columnItem: keys })
    },

    changeValue: ({ value, model, id }) => {
      const allData = get().data
      const childrenIndex: number | undefined =
        typeof get()?.childrenIndex === 'number'
          ? allData[get().childrenIndex as number].children.findIndex(
              (item) => item.id === id.toString(),
            )
          : undefined
      const currentRow =
        model === 'data'
          ? allData[id - 1]
          : allData[get().childrenIndex || 0].children[childrenIndex || 0]
      const [key, newValue] = Object.entries(value)[0]
      console.log(key, newValue)
      currentRow[key] = newValue
      console.log(allData)
      get().setData(allData)
    },
  }
})
