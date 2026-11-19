"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgetPassword } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
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

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      await forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      });
      setSubmitted(true);
      toast.success("Si un compte existe avec cet email, un lien a été envoyé.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le lien pour le moment.";
      toast.error(msg);
    }
  };

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
              <CardContent className="grid gap-4 text-center py-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Si un compte est associé à cette adresse email, vous recevrez
                  d&apos;ici quelques instants un message contenant votre lien de
                  réinitialisation valable 15 minutes.
                </p>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <CardContent className="grid gap-4">
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
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
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
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
