"use client"

import { useEntity } from "@/lib/ha-context"
import { WeatherIcon } from "./weather-icons"

interface WeatherChipProps {
  entityId: string
  name?: string
}

export function WeatherChip({ entityId, name }: WeatherChipProps) {
  const { entity, loading } = useEntity(entityId)

  if (loading || !entity) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
        <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-muted-foreground/20" />
        <span>{name || "Loading..."}</span>
      </div>
    )
  }

  const temperature = entity.attributes.temperature || entity.state
  const condition = entity.attributes.condition || "sunny"
  const displayName = name || entity.attributes.friendly_name

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
      <WeatherIcon condition={condition} className="h-4 w-4" />
      <span>{displayName}</span>
      <span className="font-semibold">{temperature}°</span>
    </div>
  )
}
