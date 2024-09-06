import { SelectData } from '@/@types/select-data'
import { MultiSelect } from '../multi-select'
import { Input } from '../ui/input'

interface FilterTypeProps {
  type: 'text' | 'number' | 'date' | 'boolean' | 'select'
  value: string | string[] | boolean
  onChange: (value: string | string[]) => void
  options?: SelectData[]
}

export function FilterType({
  type,
  value,
  onChange,
  options,
}: FilterTypeProps) {
  const allTypes = {
    text: (
      <Input
        type="text"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    number: (
      <Input
        type="number"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    date: (
      <Input
        type="date"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
    select: (
      <MultiSelect
        value={value as string[]}
        onChangeValue={onChange}
        options={options || []}
      />
    ),
    boolean: (
      <input
        type="checkbox"
        checked={value as boolean}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  }

  const Comp = allTypes[type]

  return Comp
}
