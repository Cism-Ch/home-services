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
import {
  Upload,
  X,
  Plus,
  ShieldCheck,
  Phone,
  MessageSquare,
  FileCheck,
  Loader2,
} from "lucide-react"
import { CityCombobox } from "@/components/city-combobox"
import { FileUploadButton } from "@/components/file-upload-button"
import { ProLiveStatusBanner } from "@/components/dashboard/pro-live-status-banner"
import {
  updateProProfileAction,
  removeStoredAssetAction,
} from "@/server/actions/pro-catalog"
import type { AvailabilityStatusType } from "@/lib/types/catalog"
import { toast } from "sonner"

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
const KYC_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

function inferPortfolioKey(url: string, proId: string, idx: number): string {
  const marker = `portfolio/${proId}/`
  const markerIndex = url.indexOf(marker)
  if (markerIndex !== -1) {
    return decodeURIComponent(url.slice(markerIndex))
  }
  return `legacy:${idx}`
}

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.userImage)
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
      key: inferPortfolioKey(url, profile.id, idx),
      url,
    }))
  )
  const [kycStatus, setKycStatus] = useState<string>(profile.kycStatus)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingFolder, setUploadingFolder] = useState<
    "portfolio" | "avatars" | "kyc" | null
  >(null)

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

  const handleFileUpload = async (
    file: File | undefined,
    folder: "portfolio" | "avatars" | "kyc"
  ) => {
    if (!file) return

    const allowedMimes = folder === "kyc" ? KYC_MIME_TYPES : IMAGE_MIME_TYPES
    if (!allowedMimes.includes(file.type)) {
      toast.error(
        folder === "kyc"
          ? "Format invalide. Utilisez JPG, PNG, WebP ou PDF."
          : "Format invalide. Utilisez une image JPG, PNG ou WebP."
      )
      return
    }

    if (file.size <= 0 || file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast.error("Le fichier dépasse la limite maximale de 5 Mo.")
      return
    }

    setUploadingFolder(folder)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json().catch(() => null)) as {
        data?: { objectKey: string; publicUrl: string; folder: string } | null
        error?: string | null
      } | null

      if (!response.ok || !payload?.data) {
        toast.error(
          payload?.error ||
            `Échec de l'envoi du fichier (HTTP ${response.status}).`
        )
        return
      }

      if (folder === "portfolio") {
        setPortfolio((prev) => [
          ...prev,
          { key: payload.data!.objectKey, url: payload.data!.publicUrl },
        ])
        toast.success("Photo ajoutée au portfolio et enregistrée sur Tigris S3.")
      } else if (folder === "avatars") {
        setAvatarUrl(payload.data.publicUrl)
        toast.success("Photo de profil mise à jour avec succès.")
      } else {
        setKycStatus("PENDING")
        toast.info(
          "Justificatif KYC envoyé sur Tigris S3. Dossier en attente de validation administrateur."
        )
      }

      router.refresh()
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Erreur réseau lors du transfert du fichier."
      )
    } finally {
      setUploadingFolder(null)
    }
  }

  const handleRemovePortfolioItem = async (item: { key: string; url: string }) => {
    const previous = portfolio
    setPortfolio((prev) => prev.filter((p) => p.url !== item.url))

    const res = await removeStoredAssetAction(profile.id, item.key, item.url)
    if (res.error) {
      setPortfolio(previous)
      toast.error(res.error)
      return
    }

    toast.info("Photo retirée du portfolio. Nettoyage S3 planifié en arrière-plan.")
    router.refresh()
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
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
        <div className="space-y-6 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <FileUploadButton
                accept="image/jpeg,image/png,image/webp"
                variant="outline"
                className="w-full gap-2"
                disabled={uploadingFolder !== null}
                onFileSelect={(file) => void handleFileUpload(file, "avatars")}
              >
                {uploadingFolder === "avatars" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploadingFolder === "avatars"
                  ? "Envoi vers S3..."
                  : "Changer ma photo (max 5 Mo)"}
              </FileUploadButton>
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
                <Badge
                  variant={
                    kycStatus === "APPROVED"
                      ? "success"
                      : kycStatus === "PENDING"
                      ? "warning"
                      : kycStatus === "REJECTED"
                      ? "destructive"
                      : "outline"
                  }
                  className="text-[10px]"
                >
                  {kycStatus}
                </Badge>
              </div>
              <FileUploadButton
                accept="image/jpeg,image/png,image/webp,application/pdf"
                variant="secondary"
                size="sm"
                className="w-full gap-2"
                disabled={uploadingFolder !== null}
                onFileSelect={(file) => void handleFileUpload(file, "kyc")}
              >
                {uploadingFolder === "kyc" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploadingFolder === "kyc"
                  ? "Envoi du justificatif..."
                  : "Téléverser CNI / RCCM (max 5 Mo)"}
              </FileUploadButton>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6 min-w-0">
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveLanguage(lang)}
                        aria-label={`Retirer la langue ${lang}`}
                        className="size-4 p-0 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </Button>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Ajouter la langue"
                    onClick={handleAddLanguage}
                  >
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {portfolio.map((item, idx) => (
                  <div
                    key={`${item.key}-${idx}`}
                    className="aspect-square rounded-lg overflow-hidden relative group border"
                  >
                    <Image
                      src={item.url}
                      alt={`Réalisation ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => handleRemovePortfolioItem(item)}
                      className="absolute top-1.5 right-1.5 size-7 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                      aria-label={`Supprimer la photo ${idx + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <FileUploadButton
                  accept="image/jpeg,image/png,image/webp"
                  variant="outline"
                  disabled={uploadingFolder !== null}
                  onFileSelect={(file) => void handleFileUpload(file, "portfolio")}
                  className="aspect-square h-auto w-full rounded-lg border-2 border-dashed flex-col gap-2 text-muted-foreground hover:bg-accent/50 whitespace-normal"
                >
                  {uploadingFolder === "portfolio" ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Upload className="h-6 w-6" />
                  )}
                  <span className="text-xs font-medium text-center px-2">
                    {uploadingFolder === "portfolio"
                      ? "Transfert S3..."
                      : "Ajouter photo (max 5 Mo)"}
                  </span>
                </FileUploadButton>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-3 border-t">
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
