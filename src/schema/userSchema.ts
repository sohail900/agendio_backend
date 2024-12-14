import { z } from 'zod'
export const signUpSchema = z
    .object({
        name: z
            .string()
            .min(5, { message: 'Name should be atleast 5 characters' })
            .max(80, { message: 'Name should be less than 80 characters' }),
        email: z.string().email({ message: 'Please enter a valid email' }),
        password: z
            .string()
            .min(8, { message: 'Password should be atleast 8 characters' })
            .regex(/[A-Z]/, {
                message: 'Password must contain at least one uppercase letter',
            })
            .regex(/[a-z]/, {
                message: 'Password must contain at least one lowercase letter',
            })
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number',
            })
            .regex(/[@$!%*?&#]/, {
                message: 'Password must contain at least one special character',
            }),
        confirmPassword: z.string(),
    })
    .required({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'], // target confirm password field
        message: 'Passwords do not match',
    })
