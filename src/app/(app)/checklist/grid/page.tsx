import { HeaderInfo } from '@/components/header-info'
import { PageWrapper } from '@/components/page-wrapper'
import { TableInfo } from '@/components/table-info'

export default function Info() {
  return (
    <>
      <PageWrapper>
        <HeaderInfo />
        <TableInfo />
      </PageWrapper>
    </>
  )
}
