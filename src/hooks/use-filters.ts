import { SelectData } from '@/@types/select-data'
import { parseAsJson, useQueryState } from 'nuqs'

interface FiltersData {
  options: Array<{
    label: string
    value: string
    type: 'text' | 'number' | 'date' | 'boolean' | 'select'
    options?: SelectData[]
  }>
  defaultValues?: object
}

export function useFilters({ options, defaultValues }: FiltersData) {
  const [filterData, setFilterData] = useQueryState(
    'filter',
    parseAsJson().withDefault({ ...defaultValues }),
  )

  return {
    options,
    filterData,
    setFilterData,
  }
}
