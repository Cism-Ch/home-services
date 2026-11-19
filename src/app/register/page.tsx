"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Briefcase, User as UserIcon } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
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
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: "client",
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedRole = useWatch({ control, name: "userType" });
  const watchedPassword = useWatch({ control, name: "password" });

  const onSubmit = async (values: RegisterFormData) => {
    setServerError(null);

    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType,
      phoneNumber: values.phoneNumber || undefined,
    });

    if (error) {
      const msg =
        error.message || "Impossible de créer votre compte. Vérifiez vos informations.";
      setServerError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Compte créé avec succès !");
    router.push(
      values.userType === "pro" ? "/dashboard/pro/profile" : "/dashboard/client"
    );
    router.refresh();
  };

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 min-h-[calc(100vh-4rem)] py-10">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
              <CardDescription className="text-center">
                Rejoignez HomeServices en tant que Client ou Artisan Prestataire
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Vous êtes :</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setValue("userType", "client", { shouldValidate: true })
                      }
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-all",
                        selectedRole === "client"
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setValue("userType", "pro", { shouldValidate: true })
                      }
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-all",
                        selectedRole === "pro"
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      <Briefcase className="h-5 w-5" />
                      <span>Prestataire</span>
                    </button>
                  </div>
                </div>

                <SocialAuthButtons
                  callbackURL={
                    selectedRole === "pro"
                      ? "/dashboard/pro/profile"
                      : "/dashboard/client"
                  }
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou par email
                    </span>
                  </div>
                </div>

                {serverError && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {serverError}
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Kouassi Amadou"
                    autoComplete="name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.ci"
                    autoComplete="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">
                    Téléphone / WhatsApp{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (optionnel)
                    </span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+225 07 08 09 10 11"
                    autoComplete="tel"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-destructive">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Mot de passe</Label>
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

              <CardFooter className="flex flex-col gap-4 pt-2">
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
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
          </Card>
        </div>
      </div>
    </div>
  );
}
