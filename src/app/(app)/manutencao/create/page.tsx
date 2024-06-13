import { PageWrapper } from '@/components/page-wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from './header'

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
        <Card>
          <CardContent className="text-center">
            <p>Equipamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p>Equipamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p>Equipamento</p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
