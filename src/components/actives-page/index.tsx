import { PageWrapper } from '@/components/page-wrapper'
import { Metadata } from 'next'
import { Header } from './header'
import { Table } from './table'

export const metadata: Metadata = {
  title: 'Cadastro Equipamento',
  description: 'Plataforma da SmartNew Sistemas.',
}

export function ActivePage() {
  return (
    <PageWrapper>
      <Header />
      <Table />
    </PageWrapper>
  )
}
