'use client'
import { ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'

export function NavigationBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const listPaths = pathname.split('/')
  listPaths.shift()

  function handleNavigationToPath(path: string, isHome: boolean) {
    // if (isHome) {
    //   return
    // }

    router.push(`/${path}`)
    // router.push(path)
  }

  // console.log(listPaths)

  return (
    <div className="flex items-center gap-1">
      {listPaths.map((path, index) => {
        // const isHome = index === 0 && path.length === 0
        // const namePath = isHome ? 'Home' : path
        const currentPath = `${listPaths
          .slice(0, index + 1)
          .join('/')}?${searchParams.toString()}`

        return (
          <>
            <Button
              key={index}
              className="capitalize text-slate-700 hover:text-violet-600"
              variant="link"
              onClick={() => handleNavigationToPath(currentPath, false)}
            >
              {/* {isHome && <Home className="h-3 w-3" />} */}
              {path}
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
