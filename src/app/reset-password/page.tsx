"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { resetPassword } from "@/lib/auth-client"
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/auth/loading-button"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  })

  React.useEffect(() => {
    form.setValue("token", token)
  }, [token, form])

  const watchedPassword = useWatch({ control: form.control, name: "password" })

  const onSubmit = async (values: ResetPasswordFormData) => {
    setServerError(null)
    try {
      await resetPassword({
        token: values.token,
        password: values.password,
      })
      toast.success("Votre mot de passe a été réinitialisé !")
      router.push("/login")
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Le lien est invalide ou a expiré."
      setServerError(msg)
      toast.error(msg)
    }
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Lien invalide</CardTitle>
          <CardDescription className="text-center">
            Aucun jeton de réinitialisation détecté dans l&apos;URL.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href="/forgot-password"
            className="w-full text-center text-sm underline"
          >
            Demander un nouveau lien
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Nouveau mot de passe
        </CardTitle>
        <CardDescription className="text-center">
          Choisissez un nouveau mot de passe sécurisé
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="grid gap-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <PasswordStrengthIndicator password={watchedPassword || ""} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting}
              loadingText="Réinitialisation..."
              className="w-full"
            >
              Réinitialiser le mot de passe
            </LoadingButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 min-h-[calc(100vh-4rem)] py-10">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Retour à la connexion
          </Link>

          <React.Suspense
            fallback={
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  Chargement...
                </CardContent>
              </Card>
            }
          >
            <ResetPasswordForm />
          </React.Suspense>
        </div>
      </div>
    </div>
  )
}
