'use client'
import { ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'

export function NavigationBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const listPaths = pathname.split('/')
  console.log(listPaths)

  function handleNavigationToPath(path: string) {
    console.log(path)
    router.push(path)
  }

  return (
    <div className="flex items-center gap-1">
      {listPaths.map((path, index) => {
        const namePath = index === 0 && path.length === 0 ? 'Home' : path
        const currentPath = `${listPaths
          .slice(0, index + 1)
          .join('/')}?${searchParams.toString()}`

        // console.log(currentPath)

        return (
          <>
            <Button
              variant="link"
              onClick={() => handleNavigationToPath(currentPath)}
            >
              {namePath}
            </Button>
            {index !== listPaths.length - 1 && (
              <ChevronRight className="h-3 w-3 text-slate-600" />
            )}
          </>
        )
      })}
    </div>
  )
}
