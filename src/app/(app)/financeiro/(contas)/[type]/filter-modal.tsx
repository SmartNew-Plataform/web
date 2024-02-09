'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Search, SlidersHorizontal } from 'lucide-react'

export function FilterModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <SlidersHorizontal width={16} />
          FIltros avançados
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form.Field>
          <Form.Label htmlFor="column-select">
            Selecione uma coluna para filtrar:
          </Form.Label>
          <Form.Select
            name="column"
            id="column-select"
            options={[{ label: 'Total', value: 'total' }]}
          />
          <Form.ErrorMessage field="column" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="column-text">Digite para filtrar:</Form.Label>
          <Form.Input name="columnText" />
          <Form.ErrorMessage field="columnText" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="status-select">Status:</Form.Label>
          <Form.MultiSelect
            name="status"
            id="status-select"
            options={[
              { label: 'Emitidos', value: 'issued' },
              { label: 'A vencer', value: 'to_wind' },
              { label: 'Pago', value: 'paid' },
              { label: 'Vencido', value: 'loser' },
            ]}
          />
          <Form.ErrorMessage field="status" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="payment-method-select">
            Método pagamento:
          </Form.Label>
          <Form.MultiSelect
            name="paymentMethod"
            id="payment-method-select"
            options={[
              { label: 'Dinheiro', value: '1' },
              { label: 'Boleto', value: '2' },
              { label: 'Cartão', value: '3' },
              { label: 'Pix', value: '4' },
            ]}
          />
          <Form.ErrorMessage field="paymentMethod" />
        </Form.Field>

        <Button type="submit" form="filter-form-emission">
          <Search width={16} />
          Buscar
        </Button>
      </DialogContent>
    </Dialog>
  )
}
