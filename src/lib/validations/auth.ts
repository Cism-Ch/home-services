/**
 * Schémas de Validation Zod pour l'Authentification
 * 
 * Définit les règles de validation pour:
 * - Login (email + password)
 * - Register (name + email + password + confirmPassword)
 * - Forgot Password (email)
 * - Reset Password (password + confirmPassword + token)
 * 
 * Tous les messages d'erreur sont en français.
 */

import { z } from "zod";

/**
 * Messages d'erreur personnalisés en français
 */
const errorMessages = {
  email: {
    required: "L'adresse email est requise",
    invalid: "L'adresse email n'est pas valide",
  },
  password: {
    required: "Le mot de passe est requis",
    minLength: "Le mot de passe doit contenir au moins 8 caractères",
    maxLength: "Le mot de passe ne peut pas dépasser 128 caractères",
  },
  name: {
    required: "Le nom est requis",
    minLength: "Le nom doit contenir au moins 2 caractères",
    maxLength: "Le nom ne peut pas dépasser 100 caractères",
  },
  confirmPassword: {
    required: "La confirmation du mot de passe est requise",
    mismatch: "Les mots de passe ne correspondent pas",
  },
  token: {
    required: "Le token de réinitialisation est requis",
  },
};

/**
 * Schéma de validation pour le login
 */
export const loginSchema = z.object({
  email: z
    .string({ message: errorMessages.email.required })
    .min(1, { message: errorMessages.email.required })
    .email({ message: errorMessages.email.invalid }),
  password: z
    .string({ message: errorMessages.password.required })
    .min(1, { message: errorMessages.password.required }),
});

/**
 * Type TypeScript inféré du schéma de login
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour l'inscription
 */
export const registerSchema = z
  .object({
    name: z
      .string({ message: errorMessages.name.required })
      .min(2, { message: errorMessages.name.minLength })
      .max(100, { message: errorMessages.name.maxLength })
      .trim(),
    email: z
      .string({ message: errorMessages.email.required })
      .min(1, { message: errorMessages.email.required })
      .email({ message: errorMessages.email.invalid })
      .toLowerCase(),
    password: z
      .string({ message: errorMessages.password.required })
      .min(8, { message: errorMessages.password.minLength })
      .max(128, { message: errorMessages.password.maxLength }),
    confirmPassword: z
      .string({ message: errorMessages.confirmPassword.required })
      .min(1, { message: errorMessages.confirmPassword.required }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

/**
 * Type TypeScript inféré du schéma d'inscription
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour mot de passe oublié
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: errorMessages.email.required })
    .min(1, { message: errorMessages.email.required })
    .email({ message: errorMessages.email.invalid })
    .toLowerCase(),
});

/**
 * Type TypeScript inféré du schéma mot de passe oublié
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schéma de validation pour réinitialisation du mot de passe
 */
export const resetPasswordSchema = z
  .object({
    token: z
      .string({ message: errorMessages.token.required })
      .min(1, { message: errorMessages.token.required }),
    password: z
      .string({ message: errorMessages.password.required })
      .min(8, { message: errorMessages.password.minLength })
      .max(128, { message: errorMessages.password.maxLength }),
    confirmPassword: z
      .string({ message: errorMessages.confirmPassword.required })
      .min(1, { message: errorMessages.confirmPassword.required }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

/**
 * Type TypeScript inféré du schéma de réinitialisation
 */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;