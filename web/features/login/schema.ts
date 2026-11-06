import * as z from "zod"

export const loginSchema = z.object({
    email: z.email().nonempty(),
    password: z.string().nonempty("Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
