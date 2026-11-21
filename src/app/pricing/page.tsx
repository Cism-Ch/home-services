import type { Metadata } from "next"
import { PricingExperience } from "./pricing-experience"

export const metadata: Metadata = {
  title: "Tarifs & Abonnements",
  description:
    "Découvrez les tarifs transparents de HomeServices en Côte d'Ivoire (FCFA / XOF) pour les clients particuliers et les professionnels ou entreprises, avec 0 % de commission sur les prestations.",
}

export default function PricingPage() {
  return <PricingExperience />
}
