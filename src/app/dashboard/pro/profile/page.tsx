"use client"

import { useState } from "react"
import Image from "next/image"
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
import { toast } from "sonner"

export default function ProProfilePage() {
  const proId = "pro-1"
  const [name, setName] = useState("Amadou Kouassi")
  const [headline, setHeadline] = useState("Artisan Plombier & Climatiseur Certifié")
  const [bio, setBio] = useState(
    "Plombier et frigoriste qualifié avec plus de 12 ans d'expérience sur le Grand Abidjan. Dépannage rapide, installation sanitaire et recharge clim. Travail soigné avec devis clair avant intervention."
  )
  const [phoneNumber, setPhoneNumber] = useState("+225 07 08 09 10 11")
  const [whatsappNumber, setWhatsappNumber] = useState("+225 07 08 09 10 11")
  const [experience, setExperience] = useState("12")
  const [cityId, setCityId] = useState("abidjan-cocody")
  const [commune, setCommune] = useState("Cocody Riviera 2")
  const [languages, setLanguages] = useState(["Français", "Baoulé", "Dioula"])
  const [newLanguage, setNewLanguage] = useState("")
  const [portfolio, setPortfolio] = useState([
    {
      key: "portfolio/pro-1/realisation-1.jpg",
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    },
    {
      key: "portfolio/pro-1/realisation-2.jpg",
      url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    },
  ])
  const [kycStatus, setKycStatus] = useState<"VERIFIED" | "PENDING">("VERIFIED")
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

  const handleSimulateTigrisUpload = async (folder: "portfolio" | "kyc") => {
    const fileName = folder === "portfolio" ? `chantier-${Date.now()}.jpg` : `cni-rccm-${Date.now()}.pdf`
    const contentType = folder === "portfolio" ? "image/jpeg" : "application/pdf"

    const res = await requestPresignedUploadAction(proId, fileName, contentType, folder)
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
      toast.success("Photo ajoutée au portfolio via URL signée Tigris S3.")
    } else {
      setKycStatus("VERIFIED")
      toast.success("Pièce justificative CNI / RCCM téléversée sur Tigris S3.")
    }
  }

  const handleRemovePortfolioItem = async (objectKey: string) => {
    setPortfolio(portfolio.filter((item) => item.key !== objectKey))
    await removeStoredAssetAction(proId, objectKey)
    toast.info("Photo retirée. Nettoyage S3 programmé en tâche de fond.")
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await updateProProfileAction(proId, {
        headline,
        bio,
        phoneNumber,
        whatsappNumber,
        yearsOfExperience: parseInt(experience, 10) || 1,
        cityId,
        commune,
        availabilityStatus: "AVAILABLE",
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Profil public et coordonnées WhatsApp mis à jour avec succès.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil Public & Coordonnées</h1>
        <p className="text-muted-foreground mt-2">
          Renseignez vos informations professionnelles, votre ville d&apos;intervention et vos canaux de contact direct.
        </p>
      </div>

      {/* Statut de disponibilite temps reel */}
      <ProLiveStatusBanner proId={proId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & KYC */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
                  className="object-cover"
                />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleSimulateTigrisUpload("portfolio")}
              >
                <Upload className="h-4 w-4" />
                Changer la photo
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
                Pièce d&apos;identité (CNI / Attestation) ou registre RCCM stocké de manière sécurisée sur Tigris S3.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {kycStatus === "VERIFIED" ? "Identité Vérifiée (CNI / RCCM)" : "Vérification en cours"}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px]">S3 Signé</Badge>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleSimulateTigrisUpload("kyc")}
              >
                <Upload className="h-4 w-4" />
                Mettre à jour mon justificatif
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details Form */}
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
                    Numéro WhatsApp (Discussions & Notes vocales) *
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
                  onClick={() => handleSimulateTigrisUpload("portfolio")}
                  className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-xs font-medium">Ajouter photo</span>
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 border-t pt-4">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
