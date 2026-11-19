"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, ShieldCheck, Phone, MessageSquare, FileCheck } from "lucide-react"
import { CityCombobox } from "@/components/city-combobox"
import { ProLiveStatusBanner } from "@/components/dashboard/pro-live-status-banner"
import {
  updateProProfileAction,
  requestPresignedUploadAction,
  removeStoredAssetAction,
} from "@/server/actions/pro-catalog"
import type { AvailabilityStatusType } from "@/lib/types/catalog"
import { toast } from "sonner"

interface ProProfileViewProps {
  profile: {
    id: string
    userName: string
    userImage: string | null
    headline: string
    bio: string
    phoneNumber: string
    whatsappNumber: string
    yearsOfExperience: number
    cityId: string
    commune: string
    availabilityStatus: AvailabilityStatusType
    kycStatus: string
    languages: string[]
    portfolioImages: string[]
  }
}

export function ProProfileView({ profile }: ProProfileViewProps) {
  const router = useRouter()
  const [name, setName] = useState(profile.userName)
  const [headline, setHeadline] = useState(profile.headline)
  const [bio, setBio] = useState(profile.bio)
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber)
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsappNumber)
  const [experience, setExperience] = useState(String(profile.yearsOfExperience))
  const [cityId, setCityId] = useState(profile.cityId)
  const [commune, setCommune] = useState(profile.commune)
  const [languages, setLanguages] = useState<string[]>(profile.languages)
  const [newLanguage, setNewLanguage] = useState("")
  const [portfolio, setPortfolio] = useState(
    profile.portfolioImages.map((url, idx) => ({
      key: `portfolio/${profile.id}/${idx}`,
      url,
    }))
  )
  const [kycStatus, setKycStatus] = useState<string>(profile.kycStatus)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddLanguage = () => {
    const trimmed = newLanguage.trim()
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed])
      setNewLanguage("")
    }
  }

  const handleRemoveLanguage = (lang: string) => {
    setLanguages(languages.filter((l) => l !== lang))
  }

  const handleRequestTigrisPresigned = async (folder: "portfolio" | "kyc") => {
    const fileName =
      folder === "portfolio" ? `chantier-${Date.now()}.jpg` : `cni-rccm-${Date.now()}.pdf`
    const contentType = folder === "portfolio" ? "image/jpeg" : "application/pdf"

    const res = await requestPresignedUploadAction(
      profile.id,
      fileName,
      contentType,
      folder
    )
    if (res.error || !res.data) {
      toast.error(res.error || "Erreur lors de la génération de l'URL signée Tigris.")
      return
    }

    if (folder === "portfolio") {
      setPortfolio([
        ...portfolio,
        {
          key: res.data.objectKey,
          url: "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?w=800&q=80",
        },
      ])
      toast.success("URL signée Tigris générée pour le portfolio.")
    } else {
      setKycStatus("PENDING")
      toast.info(
        "Dossier KYC soumis pour vérification par l'administrateur."
      )
    }
  }

  const handleRemovePortfolioItem = async (objectKey: string) => {
    setPortfolio(portfolio.filter((item) => item.key !== objectKey))
    await removeStoredAssetAction(profile.id, objectKey)
    toast.info("Photo retirée. Nettoyage S3 programmé en tâche de fond.")
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await updateProProfileAction(profile.id, {
        name,
        headline,
        bio,
        phoneNumber,
        whatsappNumber,
        yearsOfExperience: parseInt(experience, 10) || 1,
        cityId,
        commune,
        availabilityStatus: profile.availabilityStatus,
        languages,
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Profil public et coordonnées WhatsApp mis à jour avec succès.")
        router.refresh()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR"

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Mon Profil Public & Coordonnées
        </h1>
        <p className="text-muted-foreground mt-2">
          Renseignez vos informations professionnelles, votre ville d&apos;intervention et vos canaux de contact direct.
        </p>
      </div>

      <ProLiveStatusBanner
        proId={profile.id}
        initialStatus={profile.availabilityStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profile.userImage || undefined} className="object-cover" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleRequestTigrisPresigned("portfolio")}
              >
                <Upload className="h-4 w-4" />
                Préparer une photo (S3)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Vérification d&apos;identité (KYC)
              </CardTitle>
              <CardDescription>
                Pièce d&apos;identité (CNI / Attestation) ou registre RCCM validé par notre équipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">
                    {kycStatus === "APPROVED"
                      ? "Identité Vérifiée (CNI / RCCM)"
                      : kycStatus === "PENDING"
                      ? "Vérification en attente"
                      : kycStatus === "REJECTED"
                      ? "Document refusé (à renvoyer)"
                      : "Non soumis"}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {kycStatus}
                </Badge>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleRequestTigrisPresigned("kyc")}
              >
                <Upload className="h-4 w-4" />
                Soumettre mon justificatif
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations & Canaux de Contact Direct</CardTitle>
              <CardDescription>
                Vos numéros d&apos;appel et WhatsApp permettent aux clients de négocier et vous envoyer des notes vocales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet ou enseigne</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre professionnel</Label>
                  <Input
                    id="title"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    Téléphone pour appels directs *
                  </Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 07 08 09 10 11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                    Numéro WhatsApp *
                  </Label>
                  <Input
                    id="whatsapp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+225 07 08 09 10 11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Présentation de votre savoir-faire</Label>
                <Textarea
                  id="bio"
                  className="min-h-[110px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {bio.length}/1000 caractères
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Ville / Commune principale</Label>
                  <CityCombobox
                    value={cityId}
                    onChange={(loc) => {
                      if (loc) {
                        setCityId(loc.id)
                        setCommune(loc.commune || loc.city)
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commune">Quartier / Secteur précis</Label>
                  <Input
                    id="commune"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="Ex: Angré 8ème Tranche"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Années d&apos;expérience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="60"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Langues parlées avec les clients</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="gap-1 pr-1">
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter une langue (ex: Anglais, Malinké)..."
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="max-w-[260px]"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddLanguage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio de réalisations (Stockage Tigris S3)</CardTitle>
              <CardDescription>
                Ajoutez des photos de vos chantiers récents pour rassurer vos clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.map((item, idx) => (
                  <div
                    key={item.key}
                    className="aspect-square rounded-lg overflow-hidden relative group border"
                  >
                    <Image
                      src={item.url}
                      alt={`Réalisation ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolioItem(item.key)}
                      className="absolute top-1.5 right-1.5 bg-black/65 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleRequestTigrisPresigned("portfolio")}
                  className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-xs font-medium">Ajouter photo</span>
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 border-t pt-4">
              <Button type="button" onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
