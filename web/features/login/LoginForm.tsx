"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "./schema"
import { loginAction } from "./actions"

const errorMessages: Record<string, string> = {
    invalid_credentials: "Ongeldige inloggegevens.",
    validation: "Controleer je invoer en probeer het opnieuw.",
    network: "Kan geen verbinding maken. Probeer het later opnieuw.",
}

export function LoginForm() {
    const router = useRouter()
    const [formError, setFormError] = useState<string | null>(null)

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginInput) {
        setFormError(null)
        const result = await loginAction(data)
        if (result.ok) {
            router.replace("/")
            return
        }
        setFormError(errorMessages[result.reason])
    }

    return (
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-email">
                                E-mail
                            </FieldLabel>
                            <Input
                                {...field}
                                type="email"
                                id="form-email"
                                aria-invalid={fieldState.invalid}
                                placeholder="foo@bar.com"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-password">
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-password"
                                aria-invalid={fieldState.invalid}
                                type="password"
                                placeholder="********"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            {formError && (
                <p role="alert" className="text-sm text-destructive mt-2">
                    {formError}
                </p>
            )}
            <Button
                type="submit"
                className="w-full mt-4"
                form="form-login"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? "Bezig..." : "Login"}
            </Button>
        </form>
    );
}
