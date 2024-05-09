interface Props {
  data: object
}

export function getDynamicColumns({ data }: Props) {
  if (!data) return []
  const columns = Object.keys(data).map((column) => ({
    accessorKey: column,
    header: column,
  }))
  return columns
}
