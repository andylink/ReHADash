"use client";

import { useMemo } from "react";
import { LightCard } from "./cards/light-card";
import { GraphCard } from "./cards/graph-card";
import { ClimateCard } from "./cards/climate-card";
import { EntityCard } from "./cards/entity-card";
import { useMobile } from "@/hooks/use-mobile";
import { ensureUniqueIds } from "@/lib/config-utils";
import type { CardConfig } from "@/types/card-types";

// Grid: 8 columns on desktop (4 on mobile), each logical column = 2 actual grid columns
// Each row is 67.5px tall (2 rows = 135px for standard cards)
// Sizes use logical columns: xxs=0.5, xs=1, sm=1x2, md=2x2, lg=2x3, xl=3x3
const CARD_SIZES = {
  // XXS - Half-width cards
  xxs: { colSpan: 0.5, rowSpan: 1 }, // Base: 0.5 cols × 1 row
  "xxs-h": { colSpan: 1, rowSpan: 1 }, // Horizontal: 1 col × 1 row (double width)
  "xxs-v": { colSpan: 0.5, rowSpan: 2 }, // Vertical: 0.5 cols × 2 rows (double height)

  // XS - Extra small cards
  xs: { colSpan: 1, rowSpan: 1 }, // Base: 1 col × 1 row
  "xs-h": { colSpan: 2, rowSpan: 1 }, // Horizontal: 2 cols × 1 row (double width)
  "xs-v": { colSpan: 1, rowSpan: 2 }, // Vertical: 1 col × 2 rows (double height)

  // SM - Small cards
  sm: { colSpan: 1, rowSpan: 2 }, // Base: 1 col × 2 rows
  "sm-h": { colSpan: 2, rowSpan: 1 }, // Horizontal: 2 cols × 1 row (wider, shorter)
  "sm-v": { colSpan: 1, rowSpan: 3 }, // Vertical: 1 col × 3 rows (taller)

  // MD - Medium cards
  md: { colSpan: 2, rowSpan: 2 }, // Base: 2 cols × 2 rows
  "md-h": { colSpan: 3, rowSpan: 2 }, // Horizontal: 3 cols × 2 rows (wider)
  "md-v": { colSpan: 2, rowSpan: 3 }, // Vertical: 2 cols × 3 rows (taller)

  // LG - Large cards
  lg: { colSpan: 2, rowSpan: 3 }, // Base: 2 cols × 3 rows
  "lg-h": { colSpan: 3, rowSpan: 2 }, // Horizontal: 3 cols × 2 rows (wider, shorter)
  "lg-v": { colSpan: 2, rowSpan: 4 }, // Vertical: 2 cols × 4 rows (taller)

  // XL - Extra large cards
  xl: { colSpan: 3, rowSpan: 3 }, // Base: 3 cols × 3 rows
  "xl-h": { colSpan: 4, rowSpan: 2 }, // Horizontal: 4 cols × 2 rows (full width, shorter)
  "xl-v": { colSpan: 3, rowSpan: 4 }, // Vertical: 3 cols × 4 rows (taller)

  // Backward compatibility aliases
  small: { colSpan: 1, rowSpan: 2 },
  "medium-h": { colSpan: 2, rowSpan: 2 },
  "medium-v": { colSpan: 1, rowSpan: 4 },
  large: { colSpan: 2, rowSpan: 4 },
} as const;

interface DashboardItem {
  id?: string;
  type: "light-card" | "climate-card" | "entity-card" | "graph-card";
  entityId?: string;
  entityIds?: string[];
  name?: string;
  unit?: string;
  size?:
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxs-h"
    | "xxs-v"
    | "xs-h"
    | "xs-v"
    | "sm-h"
    | "sm-v"
    | "md-h"
    | "md-v"
    | "lg-h"
    | "lg-v"
    | "xl-h"
    | "xl-v"
    | "small"
    | "medium-h"
    | "medium-v"
    | "large";
  colSpan?: number;
  rowSpan?: number;
  gridColumn?: number;
  gridRow?: number;
  compact?: boolean;
  // Card-specific properties
  entity?: string;
  layout?: string;
  primary_info?: string;
  secondary_info?: string;
  icon_type?: string;
  icon_color?: string;
  show_brightness_control?: boolean;
  show_color_temp_control?: boolean;
  show_color_control?: boolean;
  collapsible_controls?: boolean;
  use_light_color?: boolean;
  show_temperature_control?: boolean;
  hvac_modes?: string[];
  tap_action?: string;
  hold_action?: string;
  double_tap_action?: string;
  fill_container?: boolean;
  icon?: string;
}

interface DashboardGridProps {
  items: DashboardItem[];
  roomId: string;
}

export function DashboardGrid({ items, roomId }: DashboardGridProps) {
  const itemsWithIds = useMemo(() => ensureUniqueIds(items), [items]);

  const isMobile = useMobile();

  const renderItem = (item: DashboardItem) => {
    if (item.type === "light-card") {
      return <LightCard config={item as any} />;
    }
    if (item.type === "climate-card") {
      return <ClimateCard config={item as any} />;
    }
    if (item.type === "entity-card") {
      return <EntityCard config={item as any} />;
    }
    if (item.type === "graph-card") {
      return <GraphCard config={item as any} />;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6 auto-rows-[67.5px]">
      {itemsWithIds.map((item) => {
        const size =
          item.size && CARD_SIZES[item.size as keyof typeof CARD_SIZES]
            ? CARD_SIZES[item.size as keyof typeof CARD_SIZES]
            : { colSpan: item.colSpan || 1, rowSpan: item.rowSpan || 1 };

        // gridColumn works in logical 4-column grid, but we multiply by 2 for the 8-column CSS grid
        const actualColSpan = size.colSpan * 2;
        const gridColumnStyle = item.gridColumn
          ? `${item.gridColumn * 2 - 1} / span ${actualColSpan}`
          : `span ${actualColSpan}`;

        const gridRowStyle = item.gridRow
          ? `${item.gridRow} / span ${size.rowSpan}`
          : `span ${size.rowSpan}`;

        return (
          <div
            key={item.id}
            style={{
              gridColumn: gridColumnStyle,
              gridRow: gridRowStyle,
            }}
            className="h-full"
          >
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
