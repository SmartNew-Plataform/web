import { PageWrapper } from '@/components/page-wrapper'
import { ReactNode } from 'react'
import { Header } from './header'

export default function ServiceOrderLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <PageWrapper>
      <Header>{children}</Header>
    </PageWrapper>
  )
}
