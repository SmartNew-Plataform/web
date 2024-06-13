import { PageWrapper } from '@/components/page-wrapper'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Header } from './header'
import { Tank } from './tank'

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <Card>
        <CardContent>
          <CardTitle className="pb-6 pt-6">TANQUE 1</CardTitle>
          <div className="flex flex-wrap gap-4">
            <Tank
              type="externo"
              fuel="Gasolina"
              fuelLevel={25}
              fuelCapacity={50}
            />
            <Tank
              type="externo"
              fuel="Etanol"
              fuelLevel={13}
              fuelCapacity={100}
            />
            <Tank
              type="externo"
              fuel="Diesel"
              fuelLevel={80}
              fuelCapacity={80}
            />
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
