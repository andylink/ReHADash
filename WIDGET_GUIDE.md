# Creating Custom Widgets

This guide explains how to create new widget types for your Home Assistant dashboard.

## Quick Start

Creating a new widget is easy with the `BaseWidget` template component:

1. **Create your widget file** in `components/widgets/your-widget.tsx`
2. **Use the BaseWidget template** for consistent styling and drag-and-drop support
3. **Add the widget type** to `dashboard-grid.tsx`
4. **Configure it** in `config/dashboard.json`
5. **Add mock data** (optional) in `lib/ha-context.tsx`

## Example: Weather Widget

\`\`\`tsx
"use client"

import { useEntity } from "@/lib/ha-context"
import { BaseWidget } from "./base-widget"
import { Cloud } from 'lucide-react'

interface WeatherWidgetProps {
  entityId: string
  name: string
}

export function WeatherWidget({ entityId, name }: WeatherWidgetProps) {
  const { entity } = useEntity(entityId)

  if (!entity) {
    return <BaseWidget icon={Cloud} title={name} subtitle="Weather" loading />
  }

  return (
    <BaseWidget icon={Cloud} title={name} subtitle={entity.attributes?.condition}>
      {/* Your custom widget content here */}
      <div className="text-center">
        <p className="text-5xl font-bold">{entity.state}°C</p>
      </div>
    </BaseWidget>
  )
}
\`\`\`

## BaseWidget Props

The `BaseWidget` component provides:
- **icon**: Lucide icon component
- **title**: Widget title (entity name)
- **subtitle**: Optional subtitle (e.g., entity state or type)
- **loading**: Shows loading spinner when true
- **children**: Your custom widget content
- **className**: Additional CSS classes

## Adding to Dashboard Grid

In `components/dashboard-grid.tsx`:

\`\`\`tsx
// 1. Import your widget
import { WeatherWidget } from "./widgets/weather-widget"

// 2. Add type to Widget interface
interface Widget {
  type: "light" | "climate" | "sensor" | "switch" | "light-group" | "weather"
  // ... other properties
}

// 3. Add case to renderWidget switch
case "weather":
  return <WeatherWidget entityId={widget.entityId!} name={widget.name} />
\`\`\`

## Configuration

Add to `config/dashboard.json`:

\`\`\`json
{
  "id": "weather",
  "type": "weather",
  "entityId": "weather.home",
  "name": "Weather",
  "size": "medium-h",
  "recommendedSize": "medium-h"
}
\`\`\`

## Widget Sizes

- **xs**: 1×1 (135px) - Tiny indicators
- **small**: 1×2 (270px) - Compact sensors
- **medium-h**: 2×2 (270px) - Horizontal medium widgets
- **medium-v**: 1×4 (540px) - Vertical medium widgets
- **large**: 2×4 (540px) - Full-featured widgets

## Tips

- Use `overflow-auto` on content containers for responsive sizing
- Add `drag-handle` class to draggable areas (BaseWidget includes this)
- Use `truncate` for text that might overflow
- Test your widget at different sizes
- Follow existing widget patterns for consistency
