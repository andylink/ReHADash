"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings, Check } from "lucide-react"
import { useState, useEffect } from "react"

interface Room {
  id: string
  name: string
}

interface SettingsDropdownProps {
  rooms: Room[]
  defaultRoom: string
}

export function SettingsDropdown({ rooms, defaultRoom }: SettingsDropdownProps) {
  const [selectedDefault, setSelectedDefault] = useState(defaultRoom)

  useEffect(() => {
    const savedDefault = localStorage.getItem("ha-default-room")
    if (savedDefault) {
      setSelectedDefault(savedDefault)
    }
  }, [])

  const handleSetDefault = (roomId: string) => {
    setSelectedDefault(roomId)
    localStorage.setItem("ha-default-room", roomId)
    // Reload to apply the new default
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Default Room</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {rooms.map((room) => (
          <DropdownMenuItem key={room.id} onClick={() => handleSetDefault(room.id)}>
            <div className="flex items-center justify-between w-full">
              <span>{room.name}</span>
              {selectedDefault === room.id && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
