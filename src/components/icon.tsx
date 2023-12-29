import { Square } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamicNext from 'next/dynamic'
import { ComponentProps, memo } from 'react'

interface IconProps extends ComponentProps<typeof Square> {
  name: keyof typeof dynamicIconImports
}

export const Icon = memo(({ name, ...props }: IconProps) => {
  const DynamicIcon = dynamicNext(dynamicIconImports[name])

  return <DynamicIcon {...props} />
})

Icon.displayName = 'Icon'
