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
}: {
  items: CardConfig[];
  direction?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={`flex ${
        direction === "vertical" ? "flex-col" : "flex-row"
      } gap-0 w-full h-full`}
    >
      {items.map((item, idx) => {
        let rounded: "default" | "top" | "bottom" | "left" | "right" | "none" =
          "default";
        if (direction === "vertical") {
          if (idx === 0) rounded = "top";
          else if (idx === items.length - 1) rounded = "bottom";
          else rounded = "none";
        } else {
          if (idx === 0) rounded = "left";
          else if (idx === items.length - 1) rounded = "right";
          else rounded = "none";
        }

        // Get size from CARD_SIZES
        const sizeObj =
          item.size && CARD_SIZES[item.size]
            ? CARD_SIZES[item.size]
            : { colSpan: 1, rowSpan: 2 }; // default to sm

        // Calculate height and width
        const height =
          direction === "vertical" ? `${sizeObj.rowSpan * 67.5}px` : "100%";
        const width =
          direction === "horizontal" ? `${sizeObj.colSpan * 100}%` : "100%";
        return (
          <div key={idx} style={{ height, width }} className="flex-shrink-0">
            {item.type === "entity-card" && (
              <EntityCard config={item} rounded={rounded} />
            )}
            {item.type === "custom-card" && (
              <CustomCard config={item} rounded={rounded} />
            )}
            {item.type === "person-card" && (
              <PersonCard config={item} rounded={rounded} />
            )}
            {item.type === "stack-card" && (
              <StackCard
                items={(item as any).items}
                direction={(item as any).direction}
              />
            )}
            {/* Add other card types here as needed */}
          </div>
        );
      })}
    </div>
  );
}
