"use client"

import { useHomeAssistant } from "@/lib/ha-context"
import { RoomTabs } from "@/components/room-tabs"
import { SettingsDropdown } from "@/components/settings-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Home, AlertCircle, Loader2 } from "lucide-react"
import dashboardConfig from "@/config/dashboard.json"
import { useDeviceType } from "@/hooks/use-device-type"
import { ChipRow } from "@/components/chip-row"

export default function Page() {
  const { connected, error } = useHomeAssistant()
  const deviceType = useDeviceType()
  const config = dashboardConfig[deviceType]

  const normalizedRooms = config.rooms.map((room: any) => {
    // If room already has items, use it
    if (room.items) {
      return room
    }

    // Otherwise, merge cards and widgets into items
    const items = [...(room.cards || []), ...(room.widgets || [])]

    return {
      ...room,
      items,
    }
  })

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Connecting to Home Assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{dashboardConfig.title}</h1>
              <p className="text-muted-foreground">Real-time smart home control</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsDropdown rooms={config.rooms} defaultRoom={config.defaultRoom} />
          </div>
        </header>

        {config.chips && <ChipRow chips={config.chips} />}

        <RoomTabs rooms={normalizedRooms} defaultRoom={config.defaultRoom} />
      </div>
    </div>
  )
}
