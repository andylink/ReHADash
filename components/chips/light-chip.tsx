"use client"

import { useEntity } from "@/lib/ha-context"
import { cn } from "@/lib/utils"
import { Lightbulb } from "lucide-react"

interface LightChipProps {
  entityId: string
  name?: string
}

export function LightChip({ entityId, name }: LightChipProps) {
  const { entity, callService, loading } = useEntity(entityId)

  if (loading || !entity) {
    return (
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
        <Lightbulb className="h-3.5 w-3.5" />
        <span>{name || "Loading..."}</span>
      </button>
    )
  }

  const isOn = entity.state === "on"
  const displayName = name || entity.attributes.friendly_name
  const brightness = entity.attributes.brightness ? Math.round((entity.attributes.brightness / 255) * 100) : null

  const handleClick = () => {
    callService("toggle")
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95",
        isOn
          ? "bg-amber-500 text-white shadow-md shadow-amber-500/50"
          : "bg-muted text-muted-foreground hover:bg-muted/80",
      )}
    >
      <Lightbulb className={cn("h-3.5 w-3.5", isOn && "fill-current")} />
      <span>{displayName}</span>
      {isOn && brightness !== null && <span className="text-xs opacity-90">{brightness}%</span>}
    </button>
  )
}
