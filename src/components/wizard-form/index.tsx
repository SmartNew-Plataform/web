import { ReactElement, useEffect } from 'react'
import { WizardFormStepProps, WizardFormStep } from './wizard-form-step'
import { AnimatePresence } from 'framer-motion'

interface ContainerProps {
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
}: ContainerProps) {
  const items = [...childrenItems]
  const steps = Array.from({ length: items.length }).map(
    (_, i) => `step-${i + 1}`,
  )

  useEffect(() => {
    setSteps(steps)
  }, [])

  return (
    <div className="relative h-full w-96">
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
