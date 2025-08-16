import {z} from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2,'Name must be atleast 2 characters')
    .max(20,'Name must not exceed more than 20 characters'),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(5, 'Password must be atleast 5 characters')
    .max(50,'Password must not exceed 50 characters')
})

export const loginSchema = z.object({
  email : z.string()
    .email('Invalid Email format')
    .toLowerCase(),
  password: z.string()
    .min(1,'Password is required')

})

export type RegisterInput =  z.infer<typeof registerSchema>
export type LoginInput =  z.infer<typeof loginSchema>