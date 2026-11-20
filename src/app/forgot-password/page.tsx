"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { forgetPassword } from "@/lib/auth-client"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      await forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      })
      setSubmitted(true)
      toast.success("Si un compte existe avec cet email, un lien a été envoyé.")
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le lien pour le moment."
      toast.error(msg)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-[400px] space-y-6">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Retour à la connexion
          </Link>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Mot de passe oublié
              </CardTitle>
              <CardDescription className="text-center">
                Entrez votre email pour recevoir un lien de réinitialisation
              </CardDescription>
            </CardHeader>

            {submitted ? (
              <CardContent className="grid gap-4">
                <Alert variant="success">
                  <CheckCircle2 className="size-4" />
                  <AlertTitle>Demande enregistrée</AlertTitle>
                  <AlertDescription>
                    Si un compte est associé à cette adresse email, vous recevrez
                    d&apos;ici quelques instants un message contenant votre lien
                    de réinitialisation valable 15 minutes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
                  <CardContent className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nom@exemple.ci"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4">
                    <LoadingButton
                      type="submit"
                      loading={form.formState.isSubmitting}
                      loadingText="Envoi en cours..."
                      className="w-full"
                    >
                      Envoyer le lien de réinitialisation
                    </LoadingButton>
                    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                      <p>
                        Pas encore de compte ?{" "}
                        <Link
                          href="/register"
                          className="hover:text-primary underline underline-offset-4"
                        >
                          Créer un compte
                        </Link>
                      </p>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>
      </div>
    </div>
  )
}
