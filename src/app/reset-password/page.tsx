"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/auth/loading-button";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    setValue("token", token);
  }, [token, setValue]);

  const watchedPassword = useWatch({ control, name: "password" });

  const onSubmit = async (values: ResetPasswordFormData) => {
    setServerError(null);
    try {
      await resetPassword({
        token: values.token,
        password: values.password,
      });
      toast.success("Votre mot de passe a été réinitialisé !");
      router.push("/login");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Le lien est invalide ou a expiré.";
      setServerError(msg);
      toast.error(msg);
    }
  };

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
          <Link href="/forgot-password" className="w-full text-center text-sm underline">
            Demander un nouveau lien
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Nouveau mot de passe</CardTitle>
        <CardDescription className="text-center">
          Choisissez un nouveau mot de passe sécurisé
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="grid gap-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            <PasswordStrengthIndicator password={watchedPassword || ""} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            loadingText="Réinitialisation..."
            className="w-full"
          >
            Réinitialiser le mot de passe
          </LoadingButton>
        </CardFooter>
      </form>
    </Card>
  );
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
  );
}
