# Dashboard Grid Layout Guide

Welcome! This guide will help you arrange cards on your dashboard. Don't worry if you're not a CSS expert - we'll keep things simple and visual.

## The Basics: How the Grid Works

Think of your dashboard as a **4-column table** (like a spreadsheet with 4 columns). Each card takes up a certain number of columns and rows.

\`\`\`
Your Dashboard (4 columns wide):
┌─────────┬─────────┬─────────┬─────────┐
│ Column 1│ Column 2│ Column 3│ Column 4│
├─────────┼─────────┼─────────┼─────────┤  ← Each row is 67.5px tall
│         │         │         │         │
└─────────┴─────────┴─────────┴─────────┘
\`\`\`

**Key Points:**
- Your dashboard has **4 columns** (numbered 1, 2, 3, 4)
- Each row is **67.5px tall**
- Cards can be different sizes (taking up different amounts of space)
- You position cards by telling them which column and row to start at

---

## Card Sizes: Complete Reference

Every card has a **size** that determines how much space it takes up. Each size comes in three variants:

- **Base size** (e.g., "xs") - balanced proportions
- **Horizontal variant** (e.g., "xs-h") - wider and shorter
- **Vertical variant** (e.g., "xs-v") - narrower and taller

### XXS Sizes (Tiny Cards)

| Size | Width | Height | Best For |
|------|-------|--------|----------|
| **xxs** | 0.5 columns | 1 row (67.5px) | Temperature, humidity sensors |
| **xxs-h** | 1 column | 1 row (67.5px) | Small status indicators |
| **xxs-v** | 0.5 columns | 2 rows (135px) | Tall narrow sensors |

**Note:** xxs is **half a column wide** - you can fit two side-by-side in one column!

### XS Sizes (Extra Small Cards)

| Size | Width | Height | Best For |
|------|-------|--------|----------|
| **xs** | 1 column | 1 row (67.5px) | Door sensors, switches |
| **xs-h** | 2 columns | 1 row (67.5px) | Wide status bar |
| **xs-v** | 1 column | 2 rows (135px) | Tall switch or sensor |

### SM Sizes (Small Cards)

| Size | Width | Height | Best For |
|------|-------|--------|----------|
| **sm** | 1 column | 2 rows (135px) | Single light with brightness |
| **sm-h** | 2 columns | 1 row (67.5px) | Wide compact control |
| **sm-v** | 1 column | 3 rows (202.5px) | Tall light control |

### MD Sizes (Medium Cards)

| Size | Width | Height | Best For |
|------|-------|--------|----------|
| **md** | 2 columns | 2 rows (135px) | Climate control, weather |
| **md-h** | 3 columns | 2 rows (135px) | Wide weather display |
| **md-v** | 2 columns | 3 rows (202.5px) | Tall climate control |

### LG Sizes (Large Cards)

| Size | Width | Height | Best For |
|------|-------|--------|----------|
| **lg** | 2 columns | 3 rows (202.5px) | Light groups with controls |
| **lg-h** | 3 columns | 2 rows (135px) | Wide control panel |
| **lg-v** | 2 columns | 4 rows (270px) | Tall detailed control |

### XL Sizes (Extra Large Cards)

| Size | Width | Height | Best For |
|------|-------|--------|----------|
| **xl** | 3 columns | 3 rows (202.5px) | Major dashboard sections |
| **xl-h** | 4 columns | 2 rows (135px) | Full-width status bar |
| **xl-v** | 3 columns | 4 rows (270px) | Tall detailed panel |

---

## How to Position Cards

Every card in your `dashboard.json` can have these properties:

\`\`\`json
{
  "type": "light-card",
  "entity": "light.kitchen",
  "size": "sm",
  "gridColumn": 1,
  "gridRow": 1
}
\`\`\`

**What each property means:**
- `size`: How big the card is (see table above)
- `gridColumn`: Which column to start at (1, 2, 3, or 4)
- `gridRow`: Which row to start at (1, 2, 3, etc.)

**Special for xxs cards:** You can use half-columns like 1.5, 2.5, 3.5 to position them between other cards.

---

## Visual Examples

### Example 1: Simple Row of Cards

\`\`\`
┌─────────┬─────────┬─────────┬─────────┐
│ Kitchen │  Door   │ Climate │ Climate │  Row 1
│  Light  │ Sensor  │ Control │ Control │
│   sm    │   xs    │   md    │   md    │  Row 2
└─────────┴─────────┴─────────┴─────────┘
\`\`\`

**Configuration:**
\`\`\`json
[
  { "type": "light-card", "entity": "light.kitchen", "size": "sm", "gridColumn": 1, "gridRow": 1 },
  { "type": "entity-card", "entity": "binary_sensor.door", "size": "xs", "gridColumn": 2, "gridRow": 1 },
  { "type": "climate-card", "entity": "climate.living_room", "size": "md", "gridColumn": 3, "gridRow": 1 }
]
\`\`\`

### Example 2: Using Tiny (xxs) Cards

\`\`\`
┌─────────┬─────────┬─────────┬─────────┐
│  Light  │  Light  │Tmp│Hum│ Weather │  Row 1
│   sm    │   sm    │xxs│xxs│   md    │
└─────────┴─────────┴───┴───┴─────────┘  Row 2
\`\`\`

**Configuration:**
\`\`\`json
[
  { "type": "light-card", "entity": "light.living_room", "size": "sm", "gridColumn": 1, "gridRow": 1 },
  { "type": "light-card", "entity": "light.bedroom", "size": "sm", "gridColumn": 2, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.temperature", "size": "xxs", "gridColumn": 3, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.humidity", "size": "xxs", "gridColumn": 3.5, "gridRow": 1 },
  { "type": "entity-card", "entity": "weather.home", "size": "md", "gridColumn": 4, "gridRow": 1 }
]
\`\`\`

**Notice:** Temperature is at column 3, humidity is at column 3.5 (half-column positioning!)

### Example 3: Stacking Cards Vertically

\`\`\`
┌─────────┬─────────┬─────────┬─────────┐
│  Large  │  Large  │  Temp   │ Weather │  Row 1
│  Light  │  Light  │  xxs    │   md    │
│  Group  │  Group  ├─────────┤         │  Row 2
│   lg    │   lg    │  Humid  │         │
│         │         │  xxs    │         │  Row 3
└─────────┴─────────┴─────────┴─────────┘
\`\`\`

**Configuration:**
\`\`\`json
[
  { "type": "light-card", "entityIds": ["light.all"], "size": "lg", "gridColumn": 1, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.temperature", "size": "xxs", "gridColumn": 3, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.humidity", "size": "xxs", "gridColumn": 3, "gridRow": 2 },
  { "type": "entity-card", "entity": "weather.home", "size": "md", "gridColumn": 4, "gridRow": 1 }
]
\`\`\`

**Notice:** Both sensors are at column 3, but different rows (1 and 2) to stack them vertically.

### Example 4: Using Horizontal and Vertical Variants

\`\`\`
┌─────────┬─────────┬─────────┬─────────┐
│  Wide Status Bar (xs-h)     │ Sensor  │  Row 1
├─────────┴─────────┬─────────┤  xs-v   │
│  Climate (md)     │  Light  │         │  Row 2
│                   │  sm-v   │         │
└───────────────────┴─────────┴─────────┘  Row 3
\`\`\`

**Configuration:**
\`\`\`json
[
  { "type": "entity-card", "entity": "sensor.status", "size": "xs-h", "gridColumn": 1, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.door", "size": "xs-v", "gridColumn": 3, "gridRow": 1 },
  { "type": "climate-card", "entity": "climate.living_room", "size": "md", "gridColumn": 1, "gridRow": 2 },
  { "type": "light-card", "entity": "light.bedroom", "size": "sm-v", "gridColumn": 3, "gridRow": 2 }
]
\`\`\`

---

## Common Patterns (Copy & Paste Ready!)

### Pattern 1: Two Tiny Sensors Side-by-Side
\`\`\`json
[
  { "type": "entity-card", "entity": "sensor.temperature", "size": "xxs", "gridColumn": 1, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.humidity", "size": "xxs", "gridColumn": 1.5, "gridRow": 1 }
]
\`\`\`

### Pattern 2: Two Tiny Sensors Stacked
\`\`\`json
[
  { "type": "entity-card", "entity": "sensor.temperature", "size": "xxs", "gridColumn": 1, "gridRow": 1 },
  { "type": "entity-card", "entity": "sensor.humidity", "size": "xxs", "gridColumn": 1, "gridRow": 2 }
]
\`\`\`

### Pattern 3: Row of Different Sizes
\`\`\`json
[
  { "type": "light-card", "entity": "light.kitchen", "size": "sm", "gridColumn": 1, "gridRow": 1 },
  { "type": "entity-card", "entity": "binary_sensor.door", "size": "xs", "gridColumn": 2, "gridRow": 1 },
  { "type": "climate-card", "entity": "climate.living_room", "size": "md", "gridColumn": 3, "gridRow": 1 }
]
\`\`\`

### Pattern 4: Full-Width Header with Cards Below
\`\`\`json
[
  { "type": "entity-card", "entity": "sensor.status", "size": "xl-h", "gridColumn": 1, "gridRow": 1 },
  { "type": "light-card", "entity": "light.living_room", "size": "md", "gridColumn": 1, "gridRow": 2 },
  { "type": "climate-card", "entity": "climate.bedroom", "size": "md", "gridColumn": 3, "gridRow": 2 }
]
\`\`\`

---

## Quick Tips

1. **Start simple** - Use whole numbers for columns (1, 2, 3, 4) and rows (1, 2, 3...)
2. **Use .5 for xxs cards** - Position tiny cards at 1.5, 2.5, 3.5 to fit them between others
3. **Check your math** - A card at column 3 that's 2 columns wide will reach column 4 (the edge)
4. **Cards can't go past column 4** - If a card is too wide, it will overflow!
5. **Leave positioning empty** - If you don't set gridColumn/gridRow, cards will auto-arrange
6. **Test on mobile** - The layout adjusts automatically, but check it looks good

---

## Troubleshooting

**My cards are overlapping!**
- Check that gridColumn + card width doesn't go past column 4
- Example: A "md" card (2 columns wide) at gridColumn 4 will overflow!
- Solution: Move it to gridColumn 3 or use a smaller size

**My xxs cards aren't side-by-side!**
- Make sure they have the same gridRow
- Use .5 increments for gridColumn (e.g., 1 and 1.5, not 1 and 2)

**My layout looks weird on mobile!**
- Mobile uses fewer columns, so cards reflow automatically
- Consider creating a separate mobile configuration in dashboard.json

**I want cards in a specific order but they're jumbled!**
- Set explicit gridColumn and gridRow for every card
- The grid places cards by position, not by order in the JSON file

---

## Need More Help?

- Check the existing dashboard.json for examples
- Try copying one of the patterns above and modifying it
- Remember: Column numbers are 1-4, rows start at 1
- For xxs cards, you can use half-columns (1.5, 2.5, 3.5)

Happy dashboard building!
