import { SelectData } from '@/@types/select-data'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { FilterItem } from './filter-item'

interface AdvancedFilterData {
  options: Array<{
    label: string
    value: string
    type: 'text' | 'number' | 'date' | 'boolean' | 'select'
    options?: SelectData[]
  }>
  filterData: object
  setFilterData: (value: object) => Promise<URLSearchParams>
}

export function AdvancedFilter({
  options,
  filterData,
  setFilterData,
}: AdvancedFilterData) {
  function handleAddFilter(value: string) {
    const filters = filterData || {}
    setFilterData({
      ...filters,
      [value]: '',
    })
  }

  function onChange(key: string, value: unknown) {
    const filters = filterData || {}
    setFilterData({
      ...filters,
      [key]: value,
    })
  }

  function deleteFilter(key: string) {
    const filters = filterData as { [key: string]: unknown }
    delete filters[key]
    setFilterData({ ...filters })
  }

  function getCurrentFilter(value: string) {
    const filter = options.find((item) => item.value === value)
    return filter
  }

  return (
    <div className="flex items-center gap-2">
      {Object.entries(filterData ?? {}).map(([key, value]) => {
        const filter = getCurrentFilter(key)

        return (
          <FilterItem
            onChange={onChange}
            onDelete={deleteFilter}
            key={key}
            keyName={key}
            label={filter?.label}
            type={filter!.type}
            value={value}
            options={filter?.options}
          />
        )
      })}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="sm">
            <Plus size={12} />
            Filtro
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map(({ label, value }) => {
            return (
              <DropdownMenuItem
                key={value}
                onClick={() => handleAddFilter(value)}
              >
                {label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
