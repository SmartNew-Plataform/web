'use client'
import { DataTable } from '@/components/data-table'
/* eslint-disable camelcase */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useImportation } from '@/store/manager/importation'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { CircleAlert, CircleCheck, CircleX, Expand } from 'lucide-react'

type IColumn = {
  typeColumn: string | []
} & ColumnDef<object>

interface ITabelExcel {
  model: 'data' | 'children'
}

// type IChildrenData = { [key: string]: string }

export function TableExcel({ model }: ITabelExcel) {
  const { data, setData, setChildren, children } = useImportation()

  const { columns } = useImportation(({ columns, rows, columnItem }) => {
    const tableColumn =
      model === 'data' ? (columns as IColumn[]) : (columnItem as IColumn[])

    // console.log('minha coluna')
    // console.log(tableColumn)

    return {
      rows: rows || [],
      columns: tableColumn.map((column) => {
        const columnCostumer = {
          ...column,
        }

        if (column.typeColumn === 'id') {
          column.header = 'Items'
          columnCostumer.cell = (line) => {
            const { children: childrenSelect } = line.row.original as {
              children: { [key: string]: string }[]
            }
            return (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon-xs"
                  onClick={() => {
                    // setIndexModal(line.row.index)
                    // setChildrenData(children)
                    setChildren(childrenSelect)
                  }}
                >
                  <Expand size={12} />
                </Button>
              </div>
            )
          }
        } else if (column.header === 'sync') {
          // console.log(column)
          columnCostumer.cell = (line) => {
            return line.getValue() === null ? (
              <CircleAlert size={16} className="text-yellow-500" />
            ) : line.getValue() ? (
              <CircleCheck size={16} className="text-green-500" />
            ) : (
              <CircleX size={16} className="text-red-500" />
            )
          }
        } else if (column.header === 'contrato') {
          columnCostumer.cell = (line) => line.getValue()
        } else if (column.header === 'children') {
          columnCostumer.cell = (line) => {
            line.column.toggleVisibility(false)
          }
        } else if (column.header === 'id_pai') {
          columnCostumer.cell = (line) => line.column.toggleVisibility(false)
        } else if (Array.isArray(column.typeColumn)) {
          columnCostumer.cell = (line) => {
            // console.log(line.getValue())
            return (
              <Select
                value={line.getValue() as string}
                onValueChange={(e) => {
                  const { id, id_pai } = line.row.original as {
                    id: number
                    id_pai?: number | undefined
                  }

                  handleChange({ id, id_pai }, line.column.id, e)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    column.typeColumn as { label: string; value: string }[]
                  ).map((item) => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )
          }
        } else if (column.typeColumn === 'Date') {
          columnCostumer.cell = (line) => {
            // console.log(line.getValue())
            const date = dayjs(line.getValue() as string)
            // console.log(date.format('YYYY-MM-DD'))
            return (
              <Input
                type="date"
                onChange={(e) => {
                  const { id, id_pai } = line.row.original as {
                    id: number
                    id_pai?: number | undefined
                  }

                  handleChange({ id, id_pai }, line.column.id, e.target.value)
                }}
                defaultValue={date.format('YYYY-MM-DD')}
              />
            )
          }
        } else {
          column.cell = (line) => {
            return (
              <Input
                onChange={(e) => {
                  const { id, id_pai } = line.row.original as {
                    id: number
                    id_pai?: number
                  }

                  handleChange(
                    {
                      id,
                      id_pai,
                    },
                    line.column.id,
                    e.target.value,
                  )
                }}
                defaultValue={line.getValue() as string}
              />
            )
          }
        }

        return columnCostumer
      }),
    }
  })

  if (!columns) return <div></div>

  async function handleChange(
    line: { id: number; id_pai?: number | undefined },
    type: string,
    value: string,
  ) {
    if (model === 'data') {
      const newData = [...data]
      const index = newData.findIndex((data) => Number(data.id) === line.id)

      if (index < 0) {
        console.log('not found id')
        console.log(line, type, value)
        return
      }

      newData[index][type] = value as string
      setData(newData)
    } else if (model === 'children' && line.id_pai) {
      const newData = [...data]
      const index = newData.findIndex((data) => Number(data.id) === line.id_pai)

      if (index < 0) {
        console.log('not found id')
        console.log(line, type, value)
        return
      }

      if (
        Array.isArray(newData[index].children) &&
        (newData[index].children as unknown as Array<object>).every(
          (obj) => typeof obj === 'object' && obj !== null,
        )
      ) {
        // Acessa o elemento correto pelo índice
        const childrenArray = newData[index].children as unknown as Array<{
          [key: string]: string
        }>

        const childToUpdate = childrenArray.find(
          (data) => Number(data.id) === line.id,
        )

        if (childToUpdate) {
          childToUpdate[type] = value
          // newData[index].children = childrenArray
        }
      }

      setData(newData)
    }
  }

  return (
    <DataTable
      columns={columns}
      data={model === 'data' ? data : children || []}
    />
  )
}
