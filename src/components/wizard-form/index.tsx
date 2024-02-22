import { ReactElement, useEffect } from 'react'
import { AnimatedContainerProps, AnimatedContainer } from './animated-container'
import { AnimatePresence } from 'framer-motion'

interface ContainerProps {
  children: ReactElement<AnimatedContainerProps>[]
  direction: number
  step: string
  setSteps: (param: string[]) => void
}

export function WizardForm({
  children: childrenItems,
  direction,
  step,
  setSteps,
}: ContainerProps) {
  const items = [...childrenItems]
  const steps = Array.from({ length: items.length }).map(
    (_, i) => `step-${i + 1}`,
  )

  useEffect(() => {
    setSteps(steps)
  }, [])

  return (
    <div className="flex h-full w-96">
      {items.map((item, index) => {
        const currentStep = steps[index]
        return (
          <AnimatePresence key={index}>
            {step === currentStep && (
              <AnimatedContainer {...item.props} direction={direction} />
            )}
          </AnimatePresence>
        )
      })}
    </div>
  )
}
