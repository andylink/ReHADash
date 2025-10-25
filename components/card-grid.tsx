"use client"

import type { CardConfig } from "@/types/card-types"
import { LightCard } from "@/components/cards/light-card"
import { ClimateCard } from "@/components/cards/climate-card"
import { EntityCard } from "@/components/cards/entity-card"

interface CardGridProps {
  cards: CardConfig[]
}

export function CardGrid({ cards }: CardGridProps) {
  const renderCard = (card: CardConfig, index: number) => {
    switch (card.type) {
      case "light-card":
        return <LightCard key={index} config={card} />
      case "climate-card":
        return <ClimateCard key={index} config={card} />
      case "entity-card":
        return <EntityCard key={index} config={card} />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => renderCard(card, index))}
    </div>
  )
}
