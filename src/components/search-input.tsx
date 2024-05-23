'use client'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ComponentProps, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface SearchInputProps extends ComponentProps<typeof Input> {}

export function SearchInput({
  placeholder = 'Digite para pesquisar...',
  ...props
}: SearchInputProps) {
  const searchParams = useSearchParams()
  const filter = searchParams.get('s') || undefined
  const [filterText, setFilterText] = useState<string | undefined>(filter)
  const router = useRouter()

  function handleSearch() {
    const url = new URLSearchParams(searchParams.toString())
    console.log(filterText)

    if (filterText) {
      url.set('s', filterText)
    } else {
      url.delete('s')
    }

    router.replace(`?${url.toString()}`)
  }

  return (
    <div className="flex">
      <Input
        className="rounded-r-none"
        {...props}
        onChange={(e) => setFilterText(e.target.value)}
        value={filterText}
        placeholder={placeholder}
      />
      <Button className="rounded-l-none" onClick={handleSearch}>
        <Search size={16} />
      </Button>
    </div>
  )
}
