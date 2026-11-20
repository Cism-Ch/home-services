"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { AlertCircle, Briefcase, User as UserIcon } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth"
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { LoadingButton } from "@/components/auth/loading-button"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: "client",
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  const selectedRole = useWatch({ control: form.control, name: "userType" })
  const watchedPassword = useWatch({ control: form.control, name: "password" })

  const onSubmit = async (values: RegisterFormData) => {
    setServerError(null)

    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType,
      phoneNumber: values.phoneNumber || undefined,
    })

    if (error) {
      const msg =
        error.message ||
        "Impossible de créer votre compte. Vérifiez vos informations."
      setServerError(msg)
      toast.error(msg)
      return
    }

    toast.success("Compte créé avec succès !")
    router.push(
      values.userType === "pro" ? "/dashboard/pro/profile" : "/dashboard/client"
    )
    router.refresh()
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 min-h-[calc(100vh-4rem)] py-10">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Créer un compte
              </CardTitle>
              <CardDescription className="text-center">
                Rejoignez HomeServices en tant que Client ou Artisan Prestataire
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vous êtes :</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-2 gap-3"
                          >
                            <Label
                              htmlFor="role-client"
                              className={cn(
                                "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-all has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                                field.value === "client"
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                  : "border-border hover:bg-muted/50 text-muted-foreground"
                              )}
                            >
                              <RadioGroupItem
                                id="role-client"
                                value="client"
                                className="sr-only"
                              />
                              <UserIcon className="h-5 w-5" />
                              <span>Client</span>
                            </Label>

                            <Label
                              htmlFor="role-pro"
                              className={cn(
                                "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-all has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                                field.value === "pro"
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                  : "border-border hover:bg-muted/50 text-muted-foreground"
                              )}
                            >
                              <RadioGroupItem
                                id="role-pro"
                                value="pro"
                                className="sr-only"
                              />
                              <Briefcase className="h-5 w-5" />
                              <span>Prestataire</span>
                            </Label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <SocialAuthButtons
                    callbackURL={
                      selectedRole === "pro"
                        ? "/dashboard/pro/profile"
                        : "/dashboard/client"
                    }
                  />

                  <div className="relative flex items-center justify-center">
                    <Separator />
                    <span className="bg-card px-2 text-xs uppercase text-muted-foreground shrink-0">
                      Ou par email
                    </span>
                    <Separator />
                  </div>

                  {serverError && (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kouassi Amadou"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Téléphone / WhatsApp{" "}
                          <span className="text-xs text-muted-foreground font-normal">
                            (optionnel)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+225 07 08 09 10 11"
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <PasswordStrengthIndicator
                          password={watchedPassword || ""}
                        />
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

                <CardFooter className="flex flex-col gap-4 pt-2">
                  <LoadingButton
                    type="submit"
                    loading={form.formState.isSubmitting}
                    loadingText="Création du compte..."
                    className="w-full"
                  >
                    S&apos;inscrire
                  </LoadingButton>
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    <p>
                      Déjà un compte ?{" "}
                      <Link
                        href="/login"
                        className="hover:text-primary underline underline-offset-4"
                      >
                        Se connecter
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}
