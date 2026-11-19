/**
 * Utilitaires de formatage monetaire et d'affichage local (XOF / FCFA)
 */

export function formatFCFA(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`
}
