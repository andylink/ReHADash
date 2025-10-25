"use client"

import { useHomeAssistant } from "@/lib/ha-context"
import type { ClimateCardConfig } from "@/types/card-types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Thermometer, Plus, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ClimateCardProps {
  config: ClimateCardConfig
}

export function ClimateCard({ config }: ClimateCardProps) {
  const { getEntity, callService } = useHomeAssistant()
  const entity = getEntity(config.entity)

  if (!entity) return null

  const currentTemp = entity.attributes.current_temperature
  const targetTemp = entity.attributes.temperature
  const hvacMode = entity.state
  const name = config.name || entity.attributes.friendly_name || config.entity

  const isOff = hvacMode === "off"
  const showControls = !isOff || !config.collapsible_controls

  const handleTempChange = (delta: number) => {
    const newTemp = (targetTemp || 20) + delta
    callService("climate", "set_temperature", config.entity, { temperature: newTemp })
  }

  const handleModeChange = (mode: string) => {
    callService("climate", "set_hvac_mode", config.entity, { hvac_mode: mode })
  }

  const getPrimaryInfo = () => {
    switch (config.primary_info || "name") {
      case "name":
        return name
      case "state":
        return hvacMode
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
        return hvacMode
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
    <Card className="p-4 h-full flex flex-col">
      <div className={cn("flex gap-4 flex-1", layoutClass)}>
        <div className="flex items-center gap-3 flex-1">
          {config.icon_type !== "none" && (
            <div className="p-3 rounded-lg bg-primary/10">
              <Thermometer className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium text-foreground">{getPrimaryInfo()}</div>
            {getSecondaryInfo() && <div className="text-sm text-muted-foreground">{getSecondaryInfo()}</div>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{currentTemp}°</div>
            <div className="text-sm text-muted-foreground">Target: {targetTemp}°</div>
          </div>
        </div>

        {showControls && (
          <div className="w-full space-y-3">
            {config.show_temperature_control && (
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleTempChange(-0.5)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium min-w-[60px] text-center">{targetTemp}°</span>
                <Button size="sm" variant="outline" onClick={() => handleTempChange(0.5)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            {config.hvac_modes && config.hvac_modes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.hvac_modes.map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={hvacMode === mode ? "default" : "outline"}
                    onClick={() => handleModeChange(mode)}
                    className="capitalize"
                  >
                    {mode.replace("_", " ")}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
