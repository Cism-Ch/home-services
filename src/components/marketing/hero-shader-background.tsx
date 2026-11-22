"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false }
)

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradient),
  { ssr: false }
)

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    )
  } catch {
    return false
  }
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function subscribeNoop() {
  return () => {}
}

/**
 * Arriere-plan anime ShaderGradient 3D pour la couverture Hero plein ecran.
 * Charge de maniere paresseuse cote client avec secours WebGL, respect de prefers-reduced-motion
 * et palette synchronisee aux themes Clair / Sombre / Luxe.
 */
export function HeroShaderBackground() {
  const { resolvedTheme, theme } = useTheme()
  const enabled = React.useSyncExternalStore(
    subscribeNoop,
    canUseWebGL,
    () => false
  )
  const reducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  )

  if (!enabled) return null

  const isLuxury = theme === "luxury"
  const isDark = resolvedTheme === "dark" || isLuxury

  const colors = isLuxury
    ? { c1: "#d97706", c2: "#78350f", c3: "#1c1917" }
    : isDark
    ? { c1: "#ea580c", c2: "#7c2d12", c3: "#0f172a" }
    : { c1: "#ff8c5a", c2: "#fb923c", c3: "#fde68a" }

  return (
    <WebGLErrorBoundary>
      <div
        aria-hidden="true"
        data-hero-shader="true"
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
        <ShaderGradientCanvas
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          pixelDensity={1}
          fov={45}
        >
          <ShaderGradient
            animate={reducedMotion ? "off" : "on"}
            type="waterPlane"
            shader="defaults"
            uSpeed={0.22}
            uStrength={2.2}
            uDensity={1.4}
            uFrequency={4.2}
            uAmplitude={1.5}
            color1={colors.c1}
            color2={colors.c2}
            color3={colors.c3}
            reflection={0.18}
            cAzimuthAngle={180}
            cPolarAngle={95}
            cDistance={3.4}
            cameraZoom={1}
            lightType="3d"
            brightness={isDark ? 0.95 : 1.15}
            grain="off"
          />
        </ShaderGradientCanvas>

        {/* Voile de lisibilite adaptatif garantissant le contraste du texte Hero */}
        <div
          className={
            isDark
              ? "absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background"
              : "absolute inset-0 bg-gradient-to-b from-background/78 via-background/62 to-background"
          }
        />
      </div>
    </WebGLErrorBoundary>
  )
}
