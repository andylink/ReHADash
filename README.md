# Home Assistant Dashboard

A beautiful, customizable dashboard for Home Assistant with real-time WebSocket updates and device-specific layouts.

## Setup

1. **Copy the environment file:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Configure your Home Assistant connection:**
   
   Edit `.env.local` and add your Home Assistant details:
   \`\`\`
   NEXT_PUBLIC_HA_URL=http://homeassistant.local:8123
   NEXT_PUBLIC_HA_TOKEN=your_long_lived_access_token_here
   \`\`\`

   To get a long-lived access token:
   - Go to your Home Assistant profile (click your username in the sidebar)
   - Scroll to "Long-Lived Access Tokens"
   - Click "Create Token"
   - Copy the token and paste it in your `.env.local` file

3. **Customize your dashboard:**
   
   Edit `config/dashboard.json` to configure separate dashboards for desktop, tablet, and mobile devices:
   
   \`\`\`json
   {
     "title": "My Smart Home",
     "desktop": {
       "defaultRoom": "main-floor",
       "rooms": [
         {
           "id": "main-floor",
           "name": "Main Floor",
           "icon": "home",
           "widgets": [
             {
               "id": "unique-id",
               "type": "light",
               "entityId": "light.living_room",
               "name": "Living Room",
               "size": "small"
             }
           ]
         }
       ]
     },
     "tablet": {
       "defaultRoom": "main-floor",
       "rooms": []
     },
     "mobile": {
       "defaultRoom": "main-floor",
       "rooms": []
     }
   }
   \`\`\`

## Device-Specific Dashboards

The dashboard automatically detects your device type and loads the appropriate configuration:

- **Desktop** (>1024px): Full-featured dashboard with 4-column grid
- **Tablet** (768-1024px): Optimized layout with 2-column grid
- **Mobile** (<768px): Compact layout with 2-column grid and simplified widgets

Each device type can have:
- Completely different room configurations
- Different widget layouts and sizes
- Device-optimized widget variants (e.g., compact mode for mobile)

### Example: Mobile-Optimized Widget

\`\`\`json
{
  "id": "lights-mobile",
  "type": "light-group",
  "entityIds": ["light.kitchen", "light.living_room"],
  "name": "Lights",
  "size": "medium-h",
  "compact": true
}
\`\`\`

The `compact` flag enables a simplified view that hides advanced controls on mobile devices.

## Widget Types

- **light**: Control lights with on/off and brightness
- **light-group**: Control multiple lights together with brightness and color
- **climate**: Control thermostats with temperature adjustment
- **sensor**: Display sensor values (temperature, humidity, etc.)
- **switch**: Toggle switches on/off

## Widget Sizes

The dashboard uses a standardized sizing system with proportional relationships:

- **xs** (Extra Small): 1×1 grid cells (135px × 135px)
- **small**: 1×2 grid cells (135px × 270px) - 2 xs widgets stack to equal 1 small
- **medium-h** (Medium Horizontal): 2×2 grid cells (270px × 270px)
- **medium-v** (Medium Vertical): 1×4 grid cells (135px × 540px) - 2 small widgets stack to equal 1 medium-v
- **large**: 2×4 grid cells (270px × 540px) - 4 small widgets in a 2×2 arrangement equal 1 large

### Size Relationships

- 2 xs = 1 small
- 2 small = 1 medium-v
- 4 small (2×2) = 1 large
- 8 xs (2×4) = 1 large

## Drag and Drop

Widgets can be reordered by dragging them to new positions. The layout is automatically saved per room in your browser's localStorage.

## Adding New Widgets

To add a widget to a specific device dashboard, edit the corresponding section in `config/dashboard.json`:

\`\`\`json
{
  "desktop": {
    "rooms": [
      {
        "widgets": [
          {
            "id": "my-new-widget",
            "type": "light",
            "entityId": "light.kitchen",
            "name": "Kitchen Light",
            "size": "small"
          }
        ]
      }
    ]
  }
}
\`\`\`

## Customization

- **Theme**: Edit `app/globals.css` to customize colors
- **Layout**: Modify the grid in `components/dashboard-grid.tsx`
- **New Widget Types**: Create new components in `components/widgets/`

## Features

- ✅ Real-time updates via WebSocket
- ✅ Automatic reconnection on connection loss
- ✅ Light/dark theme toggle
- ✅ Responsive grid layout
- ✅ Drag and drop widget reordering
- ✅ Multiple room tabs
- ✅ Device-specific dashboards (desktop, tablet, mobile)
- ✅ Standardized widget sizing system
- ✅ Easy configuration via JSON
- ✅ Type-safe with TypeScript
- ✅ Compact widget modes for mobile optimization
