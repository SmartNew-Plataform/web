import { useState } from 'react'

type PaginateType = {
  newDirection: number
}

export function useWizardForm() {
  const [steps, setSteps] = useState<string[]>([])
  const [[step, direction], setStep] = useState(['step-1', 0])

  const lastStep = step === steps[steps.length - 1]
  const firstStep = step === steps[0]

  function paginate({ newDirection }: PaginateType) {
    const indexStep =
      steps.findIndex((stepItem) => stepItem === step) + newDirection
    const newStep = steps[indexStep]
    setStep([newStep, newDirection])
  }

  console.log({ firstStep, lastStep, step })

  return {
    step,
    direction,
    paginate,
    setSteps,
    lastStep,
    firstStep,
  }
}
