"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DashboardGrid } from "@/components/dashboard-grid"
import { Home, Bed, Sofa, Gauge } from "lucide-react"
import { useState, useEffect } from "react"
import type { DashboardItem } from "@/types/dashboard-item-types"

interface Widget {
  id: string
  type: string
  entityId?: string
  entityIds?: string[]
  name: string
  unit?: string
  compact?: boolean
}

type CardConfig = {}

interface Room {
  id: string
  name: string
  icon: string
  items: DashboardItem[]
}

interface RoomTabsProps {
  rooms: Room[]
  defaultRoom: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  bed: Bed,
  sofa: Sofa,
  gauge: Gauge,
}

export function RoomTabs({ rooms, defaultRoom }: RoomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultRoom)

  useEffect(() => {
    const savedDefault = localStorage.getItem("ha-default-room")
    if (savedDefault && rooms.some((r) => r.id === savedDefault)) {
      setActiveTab(savedDefault)
    }
  }, [rooms])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
        {rooms.map((room) => {
          const Icon = iconMap[room.icon] || Home
          return (
            <TabsTrigger
              key={room.id}
              value={room.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              <Icon className="h-4 w-4 mr-2" />
              {room.name}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {rooms.map((room) => (
        <TabsContent key={room.id} value={room.id} className="mt-6">
          {room.items.length > 0 && <DashboardGrid items={room.items} roomId={room.id} />}
        </TabsContent>
      ))}
    </Tabs>
  )
}
