import { PageWrapper } from '@/components/page-wrapper'
import { Grid } from './grid'
import { HeaderEmissionPage } from './header'

export default function EmissionPage() {
  return (
    <PageWrapper>
      <HeaderEmissionPage />
      <Grid />
    </PageWrapper>
  )
}
