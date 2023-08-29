'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useCoreScreensStore } from '@/store/core-screens-store'
import 'keen-slider/keen-slider.min.css'
import {
  KeenSliderInstance,
  KeenSliderPlugin,
  useKeenSlider,
} from 'keen-slider/react'
import { Image } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { MutableRefObject, useEffect } from 'react'

interface AsksListProps {
  productionId: string
}

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>,
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active')
      })
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add('active')
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx)
        })
      })
    }

    slider.on('created', () => {
      if (!mainRef.current) return
      addActive(slider.track.details.rel)
      addClickEvents()
      mainRef.current.on('animationStarted', (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

export function AsksList({ productionId }: AsksListProps) {
  const { checklistAsksScreen, loadChecklistAsks } = useCoreScreensStore(
    ({ checklistAsksScreen, loadChecklistAsks }) => ({
      checklistAsksScreen,
      loadChecklistAsks,
    }),
  )

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  })
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)],
  )

  useEffect(() => {
    loadChecklistAsks(productionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(checklistAsksScreen)

  if (!checklistAsksScreen?.table)
    return (
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-[150px] w-[370px] rounded-md" />
        <Skeleton className="h-[150px] w-[370px] rounded-md" />
        <Skeleton className="h-[150px] w-[370px] rounded-md" />
      </div>
    )

  const iconsNames = {
    'close-circle': 'x-circle',
    'checkmark-circle': 'check-circle',
    'question-circle': 'help-circle',
  }

  return (
    <>
      {checklistAsksScreen?.table.map(({ description, answer, id, img }) => {
        const currentIcon = iconsNames[
          answer?.icon
        ] as keyof typeof dynamicIconImports
        const Icon = answer?.icon && dynamic(dynamicIconImports[currentIcon])

        return (
          <Card
            key={id}
            className={cn('relative space-y-2 rounded-md p-4', {
              'border-2': !answer,
              'border-dashed': !answer,
              'border-slate-400': !answer,
            })}
          >
            {img.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="absolute right-1 top-1"
                  >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="overflow-hidden p-0">
                  <div>
                    <div ref={sliderRef} className="keen-slider">
                      {img.map((image) => (
                        <div key={image} className="keen-slider__slide">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <img src={image} className="rounded" />
                        </div>
                      ))}
                    </div>

                    <div
                      ref={thumbnailRef}
                      className="keen-slider thumbnail mt-4 px-2 pb-2"
                    >
                      {img.map((image) => (
                        <div key={image} className="keen-slider__slide">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <img
                            src={image}
                            className="h-[120px] w-[120px] rounded object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <h4 className="text-xl font-semibold text-slate-700">
              {description}
            </h4>
            <div className="flex items-center gap-3">
              {answer?.icon && <Icon className="h-4 w-4" />}

              <span className="text-slate-600">
                {answer?.description || 'Não respondido'}
              </span>
            </div>
            {answer?.children && (
              <div className="flex flex-col gap-1">
                <div className="h-px w-full bg-slate-200" />
                <span className="text-zinc-400">
                  {answer.children.description}
                </span>
              </div>
            )}
          </Card>
        )
      })}
    </>
  )
}
