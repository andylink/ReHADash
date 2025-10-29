import React from "react";
import type { CardConfig } from "@/types/card-types";
import { CARD_SIZES } from "../dashboard-grid";
import { EntityCard } from "./entity-card";
import { CustomCard } from "./custom-card";
import { PersonCard } from "./person-card";
// import other card types as needed

export function StackCard({
  items,
  direction = "vertical",
  size,
}: {
  items: CardConfig[];
  direction?: "vertical" | "horizontal";
  size?: keyof typeof CARD_SIZES;
}) {
  // Use size prop for parent card size, fallback to md
  const parentSizeObj =
    size && CARD_SIZES[size] ? CARD_SIZES[size] : { colSpan: 1, rowSpan: 2 };

  // For stack-card itself, use its own size if available
  // (for nested stack-cards, pass size prop down)
  // If this StackCard is rendered by another StackCard, it will get its size from config

  // For horizontal direction, calculate total colSpan of children
  let totalColSpan = 0;
  if (direction === "horizontal") {
    totalColSpan = items.reduce((sum, item) => {
      const sizeObj =
        item.size && CARD_SIZES[item.size]
          ? CARD_SIZES[item.size]
          : { colSpan: 1, rowSpan: 2 };
      return sum + sizeObj.colSpan;
    }, 0);
  }

  return (
    <div
      className={`flex ${
        direction === "vertical" ? "flex-col" : "flex-row"
      } gap-6 w-full h-full`}
      style={{
        height:
          direction === "vertical"
            ? `${
                parentSizeObj.rowSpan * 67.5 + (parentSizeObj.rowSpan - 1) * 24
              }px`
            : "100%",
        width: "100%",
      }}
    >
      {items.map((item, idx) => {
        const sizeObj =
          item.size && CARD_SIZES[item.size]
            ? CARD_SIZES[item.size]
            : { colSpan: 1, rowSpan: 2 };
        const gapSize = 24;
        const gaps = sizeObj.rowSpan > 1 ? (sizeObj.rowSpan - 1) * gapSize : 0;
        const height =
          direction === "vertical"
            ? `${Math.round(sizeObj.rowSpan * 67.5 + gaps)}px`
            : "100%";
        // For horizontal, width is proportional to colSpan/totalColSpan
        let width;
        if (direction === "horizontal" && totalColSpan > 0) {
          width = `${(sizeObj.colSpan / totalColSpan) * 93}%`;
        } else if (direction === "vertical") {
          width = "100%";
        } else {
          width = `${sizeObj.colSpan * 100}%`;
        }

        return (
          <div
            key={idx}
            style={{
              height,
              width,
            }}
            className="flex-shrink-0"
          >
            {item.type === "entity-card" && <EntityCard config={item} />}
            {item.type === "custom-card" && <CustomCard config={item} />}
            {item.type === "person-card" && <PersonCard config={item} />}
            {item.type === "stack-card" && (
              <StackCard
                items={(item as any).items}
                direction={(item as any).direction}
                size={item.size}
              />
            )}
            {/* Add other card types here as needed */}
          </div>
        );
      })}
    </div>
  );
}
