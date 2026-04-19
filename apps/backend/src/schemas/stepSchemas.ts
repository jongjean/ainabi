import { z } from 'zod';

export const StepSchemas: Record<number, z.ZodObject<any>> = {
  1: z.object({
    category: z.enum(['심리', '관계', '재무', '직장', '모름'])
  }),
  2: z.object({
    target: z.string().min(1)
  }),
  3: z.object({
    impact: z.array(z.string()).min(1) // 다른 영역 영향성 (관계, 재무, 심리, 사업)
  }),
  4: z.object({
    types: z.array(z.string()).min(1) // 불편함 유형
  }),
  5: z.object({
    period: z.string().min(1)
  }),
  6: z.object({
    severity: z.string().min(1)
  }),
  7: z.object({
    response: z.string().min(1)
  }),
  8: z.object({
    description: z.string().min(10, "최소 10자 이상 상황을 설명해 주세요.")
  })
};

export type StepData = z.infer<typeof StepSchemas[keyof typeof StepSchemas]>;
