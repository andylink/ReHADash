"use client"

import { useEntity } from "@/lib/ha-context"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface EntityChipProps {
  entityId: string
  name?: string
  icon?: string
}

export function EntityChip({ entityId, name, icon = "Circle" }: EntityChipProps) {
  const { entity, callService, loading } = useEntity(entityId)

  if (loading || !entity) {
    return (
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium transition-colors">
        <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>{name || "Loading..."}</span>
      </button>
    )
  }

  const isActive = entity.state === "on" || entity.state === "home"
  const displayName = name || entity.attributes.friendly_name
  const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Circle

  const handleClick = () => {
    if (entity.entity_id.startsWith("switch.") || entity.entity_id.startsWith("light.")) {
      callService("toggle")
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95",
        isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80",
      )}
    >
      <IconComponent className="h-3.5 w-3.5" />
      <span>{displayName}</span>
      {entity.state !== "on" && entity.state !== "off" && entity.state !== "home" && entity.state !== "away" && (
        <span className="text-xs opacity-75 capitalize">{entity.state}</span>
      )}
    </button>
  )
}
