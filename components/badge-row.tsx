"use client"

import { BadgeWidget } from "./widgets/badge-widget"

interface Badge {
  id: string
  type: "badge"
  entityId: string
  name: string
  icon?: string
}

interface BadgeRowProps {
  badges: Badge[]
}

export function BadgeRow({ badges }: BadgeRowProps) {
  if (!badges || badges.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 pb-4">
      {badges.map((badge) => (
        <BadgeWidget key={badge.id} entityId={badge.entityId} name={badge.name} icon={badge.icon} />
      ))}
    </div>
  )
}
