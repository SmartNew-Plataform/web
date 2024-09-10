import { StatusFilterData } from './table-service-order'

interface StatusFilterProps {
  data: Array<StatusFilterData>
  value?: string
  onChange: (value: string | undefined) => void
}

export function StatusFilter({ value, onChange, data }: StatusFilterProps) {
  function toggleStatus(statusId: string) {
    onChange(statusId === value ? undefined : statusId)
  }

  return (
    <div className="flex w-full flex-wrap gap-2">
      {data.map(({ id, name, color, count }) => {
        return (
          <button
            key={id}
            data-active={value === id}
            className="box-border flex h-8 items-center gap-2 whitespace-nowrap rounded border bg-white px-2 text-zinc-700 shadow-sm data-[active=true]:border-2"
            style={{ borderColor: value === id ? color : '#cbd5e1' }}
            onClick={() => toggleStatus(id)}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: color }}
            />
            {name}
            <span className="flex h-full items-center justify-center border-l pl-2">
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
