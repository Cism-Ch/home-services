/**
 * Context d'Authentification
 * 
 * Provider global pour gérer:
 * - État de session utilisateur
 * - État de chargement
 * - Actions d'authentification (logout, refresh)
 * - Hook personnalisé useAuth()
 */

"use client";

import * as React from "react";
import { useSession, signOut } from "@/lib/auth-client";

/**
 * Type pour les données utilisateur
 */
interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type pour les données de session
 */
interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Type pour le contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => void;
}

/**
 * Création du contexte avec valeur par défaut
 */
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

/**
 * Props du Provider
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification
 * À placer au niveau racine de l'application
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Utilise le hook useSession de Better-auth
  const { data: sessionData, isPending, error } = useSession();

  // État de chargement
  const isLoading = isPending;

  // Extraction des données utilisateur et session
  const user = sessionData?.user || null;
  const session = sessionData?.session || null;
  const isAuthenticated = !!user && !!session;

  /**
   * Fonction de déconnexion
   */
  const logout = React.useCallback(async () => {
    try {
      await signOut();
      // Redirection gérée automatiquement par Better-auth
      window.location.href = "/login";
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      throw err;
    }
  }, []);

  /**
   * Fonction pour rafraîchir la session
   * Utile pour forcer une mise à jour après une modification de profil
   */
  const refreshSession = React.useCallback(() => {
    // Better-auth rafraîchit automatiquement via le hook useSession
    // Cette fonction peut être appelée pour forcer un re-render si nécessaire
    window.location.reload();
  }, []);

  // Log des erreurs de session
  React.useEffect(() => {
    if (error) {
      console.error("Erreur de session:", error);
    }
  }, [error]);

  // Valeur du contexte
  const value = React.useMemo<AuthContextType>(
    () => ({
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } : null,
      session: session ? {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        token: session.token,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      } : null,
      isLoading,
      isAuthenticated,
      logout,
      refreshSession,
    }),
    [user, session, isLoading, isAuthenticated, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Non connecté</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Bonjour {user?.name}</p>
 *       <button onClick={logout}>Se déconnecter</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  
  return context;
}

/**
 * Hook pour vérifier si l'utilisateur est authentifié
 * Version simplifiée de useAuth pour les cas simples
 * 
 * @example
 * ```tsx
 * function ProtectedButton() {
 *   const isAuthenticated = useIsAuthenticated();
 *   
 *   if (!isAuthenticated) return null;
 *   
 *   return <button>Action protégée</button>;
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook pour accéder aux données utilisateur
 * Version simplifiée de useAuth
 * 
 * @example
 * ```tsx
 * function UserProfile() {
 *   const user = useUser();
 *   
 *   if (!user) return <div>Non connecté</div>;
 *   
 *   return <div>Email: {user.email}</div>;
 * }
 * ```
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}