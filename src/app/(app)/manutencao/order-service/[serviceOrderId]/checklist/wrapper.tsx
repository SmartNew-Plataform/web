'use client'
import { HeaderInfo } from '@/components/header-info'
import { TableInfo } from '@/components/table-info'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect } from 'react'

export function Wrapper() {
  const [, setIsServiceOrder] = useQueryState('isServiceOrder', parseAsBoolean)

  useEffect(() => {
    setIsServiceOrder(true)
  }, [])

  return (
    <>
      <HeaderInfo />
      <TableInfo />
    </>
  )
}
