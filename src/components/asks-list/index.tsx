'use client'
import { useCoreScreensStore } from '@/store/core-screens-store'
import 'keen-slider/keen-slider.min.css'

import { AskType } from '@/store/smartlist/checklist-types'
import { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { CardAsk } from './card-ask'
import { EditSheet } from './edit-sheet'

interface AsksListProps {
  productionId: string
}

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

  useEffect(() => {
    loadChecklistAsks(productionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useQuery([productionId], () => loadChecklistAsks(productionId), {
  //   refetchInterval: 1000 * 30, // 30 seconds
  //   retry: 8,
  //   retryDelay: 8000,
  // })

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

  return (
    <>
      {checklistAsksScreen?.table.map((ask) => {
        return (
          <div key={ask.id} onClick={() => handleOpenEditAskSheet(ask)}>
            <CardAsk
              // eslint-disable-next-line react/no-children-prop
              children={ask.answer?.children?.description}
              answer={ask.answer?.description}
              color={ask.answer?.color}
              description={ask.description}
              icon={ask.answer?.icon}
            />
          </div>
        )
      })}

      <EditSheet
        setSheetOpen={setSheetEditIsOpen}
        sheetOpen={sheetEditIsOpen}
      />
    </>
  )
}
