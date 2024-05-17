import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ComponentProps } from 'react'

export interface WizardFormStepProps extends ComponentProps<typeof motion.div> {
  direction?: number
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }
  },
}

export function WizardFormStep({
  direction = 1,
  className,
  ...props
}: WizardFormStepProps) {
  return (
    <motion.div
      key="sliders"
      variants={variants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className={cn(
        'absolute top-0 flex w-96 flex-col gap-4 bg-white',
        className,
      )}
      {...props}
    />
  )
}
