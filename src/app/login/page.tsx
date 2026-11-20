"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { LoadingButton } from "@/components/auth/loading-button"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"

function sanitizeCallbackUrl(rawUrl: string | null): string | null {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  if (!trimmed || /[\u0000-\u001f\u007f]/.test(trimmed)) {
    return null
  }
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.includes("\\")
  ) {
    return trimmed
  }
  return null
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"))

  const [rememberMe, setRememberMe] = React.useState(true)
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormData) => {
    setServerError(null)
    const { data, error } = await signIn.email({
      email: values.email,
      password: values.password,
      rememberMe,
    })

    if (error) {
      const msg = error.message || "Email ou mot de passe incorrect."
      setServerError(msg)
      toast.error(msg)
      return
    }

    toast.success("Connexion réussie !")
    const userType = (data?.user as { userType?: string } | undefined)?.userType
    const defaultTarget =
      userType === "admin"
        ? "/dashboard/admin"
        : userType === "pro"
        ? "/dashboard/pro"
        : "/dashboard/client"

    router.push(callbackUrl || defaultTarget)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Connexion</CardTitle>
        <CardDescription className="text-center">
          Entrez votre email et mot de passe pour accéder à votre espace
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="grid gap-4">
            <SocialAuthButtons callbackURL={callbackUrl || "/dashboard"} />

            <div className="relative flex items-center justify-center">
              <Separator />
              <span className="bg-card px-2 text-xs uppercase text-muted-foreground shrink-0">
                Ou continuer avec
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting}
              loadingText="Connexion en cours..."
              className="w-full"
            >
              Se connecter
            </LoadingButton>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/forgot-password"
                className="hover:text-primary underline underline-offset-4"
              >
                Mot de passe oublié ?
              </Link>
              <p>
                Pas encore de compte ?{" "}
                <Link
                  href="/register"
                  className="hover:text-primary underline underline-offset-4"
                >
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 min-h-[calc(100vh-4rem)] py-10">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <React.Suspense
            fallback={
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  Chargement...
                </CardContent>
              </Card>
            }
          >
            <LoginForm />
          </React.Suspense>
        </div>
      </div>
    </div>
  )
}
