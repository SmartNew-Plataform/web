'use client'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AskType } from '@/store/checklist-types'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { cva } from 'class-variance-authority'
import 'keen-slider/keen-slider.min.css'
import {
  KeenSliderInstance,
  KeenSliderPlugin,
  useKeenSlider,
} from 'keen-slider/react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { MutableRefObject, useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { EditSheet } from './edit-sheet'

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
const answerTagVariants = cva(
  'flex items-center gap-2 rounded-full px-2 py-1 text-semibold w-max',
  {
    variants: {
      variant: {
        danger: 'bg-red-200 text-red-600',
        success: 'bg-emerald-200 text-emerald-600',
        dark: 'bg-slate-200 text-slate-600',
        default: 'border-slate-300',
      },
    },

    defaultVariants: { variant: 'default' },
  },
)

export function AsksList({ productionId }: AsksListProps) {
  const [sheetEditIsOpen, setSheetEditIsOpen] = useState<boolean>(false)
  const { checklistAsksScreen, loadChecklistAsks, changeAskEditing } =
    useCoreScreensStore(
      ({ checklistAsksScreen, loadChecklistAsks, changeAskEditing }) => ({
        checklistAsksScreen,
        loadChecklistAsks,
        changeAskEditing,
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

  function handleOpenEditAskSheet(ask: AskType) {
    changeAskEditing(ask)
    setSheetEditIsOpen(true)
  }

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
            onClick={() =>
              handleOpenEditAskSheet({ id, description, img, answer })
            }
            className={cn('relative space-y-2 rounded-md p-4', {
              'border-2': !answer,
              'border-dashed': !answer,
              'border-slate-400': !answer,
            })}
          >
            <h4 className="text-xl font-semibold text-slate-700">
              {description}
            </h4>
            <div
              className={answerTagVariants({
                variant: answer?.color || 'default',
              })}
            >
              {answer?.icon && <Icon className="h-4 w-4" />}

              <span>{answer?.description || 'Não respondido'}</span>
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

      <EditSheet
        setSheetOpen={setSheetEditIsOpen}
        sheetOpen={sheetEditIsOpen}
      />
    </>
  )
}

// eslint-disable-next-line no-lone-blocks
{
  /* <div className="absolute right-1 top-1">
  <Button
    className="hidden"
    size="icon-sm"
    variant="ghost"
    onClick={() =>
      handleOpenEditAskSheet({ id, description, img, answer })
    }
  >
    <PenSquare className="h-4 w-4" />
  </Button>
  {img.length > 0 && (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <Image className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0">
        <div>
          <div ref={sliderRef} className="keen-slider">
            {img.map((image) => (
              <div key={image} className="keen-slider__slide">
                <ImageNext
                  alt="Checklist image"
                  width={510}
                  height={680}
                  src={image}
                  className="rounded"
                />
              </div>
            ))}
          </div>

          <div
            ref={thumbnailRef}
            className="keen-slider thumbnail mt-4 px-2 pb-2"
          >
            {img.map((image) => (
              <div key={image} className="keen-slider__slide">
                <ImageNext
                  alt="preview image"
                  width={120}
                  height={120}
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
// eslint-disable-next-line prettier/prettier, prettier/prettier
</div> */
}
