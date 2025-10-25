"use client"

import { useMemo } from "react"
import { EntityChip } from "./chips/entity-chip"
import { LightChip } from "./chips/light-chip"
import { SpacerChip } from "./chips/spacer-chip"
import { WeatherChip } from "./chips/weather-chip"
import { ensureUniqueIds } from "@/lib/config-utils"

interface Chip {
  id?: string // Made id optional
  type: "entity" | "light" | "spacer" | "weather"
  entityId?: string
  name?: string
  icon?: string
}

interface ChipRowProps {
  chips: Chip[]
}

export function ChipRow({ chips }: ChipRowProps) {
  const chipsWithIds = useMemo(() => ensureUniqueIds(chips), [chips])

  if (!chipsWithIds || chipsWithIds.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 pb-4">
      {chipsWithIds.map((chip) => {
        switch (chip.type) {
          case "entity":
            return <EntityChip key={chip.id} entityId={chip.entityId!} name={chip.name} icon={chip.icon} />
          case "light":
            return <LightChip key={chip.id} entityId={chip.entityId!} name={chip.name} />
          case "weather":
            return <WeatherChip key={chip.id} entityId={chip.entityId!} name={chip.name} />
          case "spacer":
            return <SpacerChip key={chip.id} />
          default:
            return null
        }
      })}
    </div>
  )
}
