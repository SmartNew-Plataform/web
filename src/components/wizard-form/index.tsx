import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import { ComponentProps, ReactElement, useEffect } from 'react'
import { WizardFormStep, WizardFormStepProps } from './wizard-form-step'

interface ContainerProps extends ComponentProps<'div'> {
  children: ReactElement<WizardFormStepProps>[]
  direction: number
  step: string
  setSteps: (param: string[]) => void
}

export function WizardForm({
  children: childrenItems,
  direction,
  step,
  setSteps,
  className,
  ...props
}: ContainerProps) {
  const items = [...childrenItems]
  const steps = Array.from({ length: items.length }).map(
    (_, i) => `step-${i + 1}`,
  )

  useEffect(() => {
    setSteps(steps)
  }, [])

  return (
    <div className={cn('relative h-full w-96', className)} {...props}>
      {items.map((item, index) => {
        const currentStep = steps[index]
        return (
          <AnimatePresence key={index}>
            {step === currentStep && (
              <WizardFormStep {...item.props} direction={direction} />
            )}
          </AnimatePresence>
        )
      })}
    </div>
  )
}
