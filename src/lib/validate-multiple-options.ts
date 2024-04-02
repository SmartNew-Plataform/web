import { z } from 'zod'

export function validateMultipleOptions<DataType>(
  data: DataType,
  ctx: z.RefinementCtx,
  type: string,
) {
  // @ts-expect-error no type
  if (!data[type]) {
    return ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [type],
      message: 'Este campo e obrigatório!',
    })
  }
}
