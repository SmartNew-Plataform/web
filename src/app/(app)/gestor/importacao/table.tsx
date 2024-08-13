'use client'
import { DataTable } from '@/components/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select } from './select'
/* eslint-disable camelcase */
import {
  IImportationForData,
  useImportation,
} from '@/store/manager/importation'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ChangeEvent } from 'react'

type IColumn = {
  typeColumn: string | []
} & ColumnDef<object>

interface ITabel {
  model: 'data' | 'children'
  columns: ColumnDef<object>[]
  data: IImportationForData[] & {
    children?: IImportationForData[]
  }
}

// type IChildrenData = { [key: string]: string }

export function Table({ model, columns, data }: ITabel) {
  const { setData, setChildren, changeValue } = useImportation()

  const columnsTable = columns.map((item) => {
    const column = item as ColumnDef<object> & {
      typeColumn: string
      accessorKey: string
    }

    if (
      column.accessorKey === 'sync' ||
      column.accessorKey === 'id' ||
      column.accessorKey === 'children'
    ) {
      return item
    }

    return {
      ...item,
      cell: (row) => {
        const valueTypes = {
          string: {
            element: Input,
            props: {
              value: row.getValue(),
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                changeValue({
                  value: { [column.header as string]: e.target.value },
                  id: row.row.getValue('id'),
                  model,
                }),
            },
          },
          date: {
            element: Input,
            props: {
              type: 'date',
              value: dayjs(row.getValue() as string).format('YYYY-MM-DD'),
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                changeValue({
                  value: { [column.header as string]: e.target.value },
                  id: row.row.getValue('id'),
                  model,
                }),
            },
          },
          object: {
            element: Select,
            props: { value: row.getValue(), options: column.typeColumn },
          },
          number: {
            element: Input,
            props: {
              type: 'number',
              value: row.getValue(),
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                changeValue({
                  value: { [column.header as string]: e.target.value },
                  id: row.row.getValue('id'),
                  model,
                }),
            },
          },
          boolean: {
            element: Checkbox,
            props: { value: row.getValue() },
          },
        }
        const type =
          typeof column.typeColumn === 'object'
            ? 'object'
            : (column.typeColumn.toLowerCase() as
                | 'string'
                | 'object'
                | 'number'
                | 'boolean')

        const Element = valueTypes[type].element
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return <Element {...valueTypes[type].props} />
      },
    }
  }) as ColumnDef<object>[]

  if (!columns) return <div></div>

  return <DataTable columns={columnsTable} data={data} />
}
