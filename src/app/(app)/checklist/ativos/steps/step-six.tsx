'use client'
import { Form } from '@/components/form'

export function StepSix() {
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="chassis">Chassi:</Form.Label>
        <Form.Input name="chassis" id="chassis" />
        <Form.ErrorMessage field="chassis" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="plate">Placa:</Form.Label>
        <Form.Input name="plate" id="plate" />
        <Form.ErrorMessage field="plate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="color">Cor:</Form.Label>
        <Form.Input name="color" id="color" />
        <Form.ErrorMessage field="color" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="reindeerCode">Código Renavam:</Form.Label>
        <Form.Input name="reindeerCode" id="reindeerCode" />
        <Form.ErrorMessage field="reindeerCode" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="CRVNumber">Numero CRV:</Form.Label>
        <Form.Input name="CRVNumber" id="CRVNumber" />
        <Form.ErrorMessage field="CRVNumber" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="insurancePolicyExpiration">
          Data de Emissão do CRV:
        </Form.Label>
        <Form.Input type="date" name="emissionDateCRV" id="emissionDateCRV" />
        <Form.ErrorMessage field="emissionDateCRV" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="licensing">Licenciamento:</Form.Label>
        <Form.Input name="licensing" id="licensing" />
        <Form.ErrorMessage field="licensing" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="insurancePolicy">Apólice Seguro:</Form.Label>
        <Form.Input name="insurancePolicy" id="insurancePolicy" />
        <Form.ErrorMessage field="insurancePolicy" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="insurancePolicyExpiration">
          Vencimento Apólice Seguro:
        </Form.Label>
        <Form.Input
          type="date"
          name="insurancePolicyExpiration"
          id="insurancePolicyExpiration"
        />
        <Form.ErrorMessage field="insurancePolicyExpiration" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="CTFFinameNumber">Nª CT Finame:</Form.Label>
        <Form.Input name="CTFFinameNumber" id="CTFFinameNumber" />
        <Form.ErrorMessage field="CTFFinameNumber" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="recipient">Beneficiario:</Form.Label>
        <Form.Input name="recipient" id="recipient" />
        <Form.ErrorMessage field="recipient" />
      </Form.Field>
    </>
  )
}
