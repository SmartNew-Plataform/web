import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export default function LayoutChecklist({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-1 flex-col">
      <Header>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Cadastro</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/checklist/task">Task</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/checklist/family">Familia</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/checklist/bound">Vinculos</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <div className="h-full flex-1">{children}</div>
    </div>
  )
}
