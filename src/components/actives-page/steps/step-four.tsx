'use client'
import { Form } from '@/components/form'

export function StepFour() {
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="serialNumber">Nº Serie:</Form.Label>
        <Form.Input type="number" name="serialNumber" id="serialNumber" />
        <Form.ErrorMessage field="serialNumber" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="fiscalNumber">Nº Nota Fiscal:</Form.Label>
        <Form.Input type="number" name="fiscalNumber" id="fiscalNumber" />
        <Form.ErrorMessage field="fiscalNumber" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="acquisitionValue">Valor de aquisição:</Form.Label>
        <Form.Input
          type="number"
          step="any"
          name="acquisitionValue"
          id="acquisitionValue"
        />
        <Form.ErrorMessage field="acquisitionValue" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="manufacturingYear">Ano de Fabricação:</Form.Label>
        <Form.Input
          type="number"
          min="1900"
          max="2099"
          step="1"
          value={new Date().getFullYear()}
          name="manufacturingYear"
          id="manufacturingYear"
        />
        <Form.ErrorMessage field="manufacturingYear" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="modelYear">Ano do Modelo:</Form.Label>
        <Form.Input
          type="number"
          min="1900"
          max="2099"
          step="1"
          value={new Date().getFullYear()}
          name="modelYear"
          id="modelYear"
        />
        <Form.ErrorMessage field="modelYear" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="buyDate">Data da Compra:</Form.Label>
        <Form.Input type="date" name="buyDate" id="buyDate" />
        <Form.ErrorMessage field="buyDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="guaranteeTime">
          Tempo de garantia (meses):
        </Form.Label>
        <Form.Input
          type="number"
          step="1"
          name="guaranteeTime"
          id="guaranteeTime"
        />
        <Form.ErrorMessage field="guaranteeTime" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="costPerHour">Custo/Hora:</Form.Label>
        <Form.Input
          type="number"
          step="any"
          name="costPerHour"
          id="costPerHour"
        />
        <Form.ErrorMessage field="costPerHour" />
      </Form.Field>
    </>
  )
}
