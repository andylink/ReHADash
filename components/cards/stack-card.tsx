import React from "react";
import { EntityCard } from "./entity-card";
import { CustomCard } from "./custom-card";
// import other card types as needed

export function StackCard({
  items,
  direction = "vertical",
}: {
  items: any[];
  direction?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={`flex ${
        direction === "vertical" ? "flex-col" : "flex-row"
      } gap-0`}
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
        if (item.type === "entity-card")
          return <EntityCard key={idx} config={item} rounded={rounded} />;
        if (item.type === "custom-card")
          return <CustomCard key={idx} config={item} rounded={rounded} />;
        // Add other card types here as needed
        return null;
      })}
    </div>
  );
}
