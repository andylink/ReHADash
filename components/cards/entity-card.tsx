"use client"

import { useHomeAssistant } from "@/lib/ha-context"
import type { EntityCardConfig } from "@/types/card-types"
import { Card } from "@/components/ui/card"
import { Power } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface EntityCardProps {
  config: EntityCardConfig
}

export function EntityCard({ config }: EntityCardProps) {
  const { getEntity, callService } = useHomeAssistant()
  const entity = getEntity(config.entity)

  if (!entity) return null

  const isActive = entity.state === "on" || entity.state === "home" || entity.state === "open"
  const name = config.name || entity.attributes.friendly_name || config.entity
  const iconColor = isActive ? config.icon_color || "text-blue-500" : "text-muted-foreground"

  const handleTap = () => {
    const action = config.tap_action || "more-info"
    if (action === "toggle") {
      const domain = config.entity.split(".")[0]
      callService(domain, isActive ? "turn_off" : "turn_on", config.entity)
    }
  }

  const getPrimaryInfo = () => {
    switch (config.primary_info || "name") {
      case "name":
        return name
      case "state":
        return entity.state
      case "last-changed":
        return formatDistanceToNow(new Date(entity.last_changed), { addSuffix: true })
      case "last-updated":
        return formatDistanceToNow(new Date(entity.last_updated), { addSuffix: true })
      case "none":
        return null
    }
  }

  const getSecondaryInfo = () => {
    switch (config.secondary_info || "state") {
      case "name":
        return name
      case "state":
        return entity.state
      case "last-changed":
        return formatDistanceToNow(new Date(entity.last_changed), { addSuffix: true })
      case "last-updated":
        return formatDistanceToNow(new Date(entity.last_updated), { addSuffix: true })
      case "none":
        return null
    }
  }

  const layoutClass =
    config.layout === "vertical"
      ? "flex-col items-start"
      : config.layout === "horizontal"
        ? "flex-row items-center justify-between"
        : "flex-col"

  return (
    <Card
      className={cn("p-4 h-full flex flex-col cursor-pointer transition-all hover:bg-accent", isActive && "bg-card/80")}
      onClick={handleTap}
    >
      <div className={cn("flex gap-4 flex-1", layoutClass)}>
        <div className="flex items-center gap-3 flex-1">
          {config.icon_type !== "none" && (
            <div className={cn("p-3 rounded-lg transition-colors", isActive ? "bg-primary/10" : "bg-muted")}>
              <Power className={cn("h-5 w-5", iconColor)} />
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium text-foreground">{getPrimaryInfo()}</div>
            {getSecondaryInfo() && <div className="text-sm text-muted-foreground">{getSecondaryInfo()}</div>}
          </div>
        </div>
      </div>
    </Card>
  )
}
