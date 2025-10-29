// Card size definitions matching the grid system
// Grid: 8 columns on desktop (4 on mobile), each logical column = 2 actual grid columns
// Each row is 67.5px tall (2 rows = 135px for standard cards)
export const CARD_SIZES = {
  // XXS - Quarter-width, half-height
  xxs: { colSpan: 0.25, rowSpan: 1 },
  "xxs-h": { colSpan: 0.5, rowSpan: 1 },
  "xxs-v": { colSpan: 0.25, rowSpan: 2 },

  // XS - Half-width, half-height
  xs: { colSpan: 0.5, rowSpan: 1 },
  "xs-v": { colSpan: 0.5, rowSpan: 2 },
  "xs-h": { colSpan: 1, rowSpan: 1 },

  // SM - Full-width, half-height
  sm: { colSpan: 1, rowSpan: 1 },
  "sm-h": { colSpan: 2, rowSpan: 1 },
  "sm-v": { colSpan: 1, rowSpan: 2 },

  // MD - Full-width, full-height
  md: { colSpan: 1, rowSpan: 2 },
  "md-h": { colSpan: 2, rowSpan: 2 },
  "md-v": { colSpan: 1, rowSpan: 3 },
  "md-v-12": { colSpan: 2, rowSpan: 12 },

  // LG - Double-width, full-height
  lg: { colSpan: 2, rowSpan: 2 },
  "lg-h": { colSpan: 3, rowSpan: 2 },
  "lg-v": { colSpan: 2, rowSpan: 3 },

  // XL - Double-width, 3/12 height
  xl: { colSpan: 2, rowSpan: 3 },
  "xl-h": { colSpan: 3, rowSpan: 3 },
  "xl-v": { colSpan: 2, rowSpan: 4 },

  // XXL - Triple-width, 3/12 height
  xxl: { colSpan: 3, rowSpan: 3 },
  "xxl-h": { colSpan: 4, rowSpan: 3 },
  "xxl-v": { colSpan: 3, rowSpan: 6 },

  // Backward compatibility aliases
  small: { colSpan: 1, rowSpan: 2 },
  "medium-h": { colSpan: 2, rowSpan: 2 },
  "medium-v": { colSpan: 1, rowSpan: 4 },
  large: { colSpan: 2, rowSpan: 4 },
} as const;

export type CardSizeKey = keyof typeof CARD_SIZES;

// Base row height in pixels (matching the grid's auto-rows-[33.75px])
export const ROW_HEIGHT = 33.75; // Updated ROW_HEIGHT to match the grid's auto-rows-[33.75px]

// Calculate pixel dimensions from grid units
export function getCardDimensions(
  size: CardSizeKey | undefined,
  includeGaps = true,
  gapSize = 16 // default to mobile gap (gap-4 = 16px), pass 24 for desktop (gap-6 = 24px)
) {
  if (!size) {
    return {
      width: "100%",
      height: `${ROW_HEIGHT * 2 + (includeGaps ? gapSize : 0)}px`,
    }; // default md
  }

  const sizeConfig = CARD_SIZES[size];
  if (!sizeConfig) {
    return {
      width: "100%",
      height: `${ROW_HEIGHT * 2 + (includeGaps ? gapSize : 0)}px`,
    };
  }

  // Calculate height including gaps between rows
  // For n rows, there are n-1 gaps
  const gaps =
    includeGaps && sizeConfig.rowSpan > 1
      ? (sizeConfig.rowSpan - 1) * gapSize
      : 0;

  return {
    width: `${sizeConfig.colSpan * 100}%`,
    height: `${sizeConfig.rowSpan * ROW_HEIGHT + gaps}px`,
  };
}
