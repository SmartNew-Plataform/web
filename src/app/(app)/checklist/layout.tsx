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
        <div className="flex gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">+ Cadastro</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/checklist/register/task">Task</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/checklist/register/family">Familia</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/checklist/register/bound">Vinculos</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary">
            <Link href="/checklist/web">Checklist Web</Link>
          </Button>
        </div>
      </Header>
      <div className="h-full flex-1">{children}</div>
    </div>
  )
}
