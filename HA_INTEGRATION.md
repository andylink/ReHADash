# Home Assistant Integration Implementation

## Overview

This project now connects to your Home Assistant server at `192.168.1.181:8123` using a hybrid approach:

- **Server-Sent Events (SSE)** for real-time updates via WebSocket proxy
- **REST API** fallback for polling if SSE fails
- **Mock data** as final fallback for development

## Architecture

### Backend API Routes

#### 1. `/app/api/ha/route.ts`

REST API proxy for Home Assistant requests:

- `POST /api/ha` - Handles service calls and state queries
- Supports:
  - `get_states` - Get all entity states
  - `get_state` - Get single entity state
  - `call_service` - Execute Home Assistant services

#### 2. `/app/api/ha/stream/route.ts`

Real-time WebSocket proxy using Server-Sent Events:

- Connects to Home Assistant WebSocket API
- Authenticates using your token
- Forwards state changes to browser clients
- Auto-reconnects on connection loss
- 30-second heartbeat to keep connection alive

### Frontend Integration

#### `/lib/ha-context.tsx`

React Context Provider that:

1. **Tries SSE first** - Establishes EventSource connection for real-time updates
2. **Falls back to polling** - If SSE fails, polls REST API every 2 seconds
3. **Falls back to mock data** - If both fail, uses mock data for development
4. **Service calls** - Executes services (turn on/off lights, etc.)
5. **State management** - Maintains entity state and notifies subscribers

### Environment Variables

#### `.env.local`

```
HA_URL=http://192.168.1.181:8123
HA_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Security Note**: This file is gitignored to keep your token secure.

## How It Works

### Connection Flow

```
Browser → EventSource(/api/ha/stream) → WebSocket(ws://192.168.1.181:8123/api/websocket)
         ↓
      Receives real-time state changes
         ↓
      Updates React Context
         ↓
      Components re-render with new data
```

### Service Call Flow

```
Component → callService() → POST /api/ha → HA REST API → Execute Service
                                                         ↓
                                        WebSocket pushes state change
                                                         ↓
                                        Context updates
                                                         ↓
                                        UI updates automatically
```

## Usage in Components

### Using a single entity

```tsx
import { useEntity } from "@/lib/ha-context";

function LightCard() {
  const { entity, callService } = useEntity("light.living_room");

  const toggle = () => {
    callService("light", "toggle", "light.living_room");
  };

  return (
    <div>
      <span>Light is {entity?.state}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

### Using multiple entities

```tsx
import { useEntities } from "@/lib/ha-context";

function Dashboard() {
  const { entities, callService } = useEntities([
    "light.living_room",
    "light.bedroom",
    "climate.thermostat",
  ]);

  return (
    <div>
      {entities.map(
        (entity) => entity && <div key={entity.entity_id}>{entity.state}</div>
      )}
    </div>
  );
}
```

## Benefits of This Approach

1. **Real-time Updates**: SSE/WebSocket provides instant state changes
2. **Reliable Fallback**: Multiple fallback layers ensure app works in various conditions
3. **Secure**: Token never exposed to browser, stays on server
4. **CORS-free**: No CORS issues since API proxy runs on same domain
5. **Auto-reconnect**: Automatically reconnects on connection loss
6. **Type-safe**: Full TypeScript support with HAEntity types

## Testing the Connection

1. **Server is running at**: http://localhost:3000
2. **Check browser console** for connection logs:

   - `[HA] Connected to Home Assistant` - Success!
   - `[HA] SSE connection opened` - Real-time updates active
   - `[HA] Received initial states: X entities` - States loaded

3. **Check server logs** for WebSocket status:
   - `[HA WS] Connected to Home Assistant`
   - `[HA WS] Authenticated successfully`

## Troubleshooting

### Connection Issues

- Verify Home Assistant is accessible at `http://192.168.1.181:8123`
- Check token is valid (create new long-lived access token if needed)
- Check Home Assistant logs for authentication errors

### SSE Fallback

If SSE fails, the app automatically falls back to polling. Check console for:

```
[HA] SSE failed, falling back to polling
[HA] Fetched states (polling): X entities
```

### Mock Data Mode

If all connections fail, mock data loads automatically for development:

```
[HA] Error fetching states: ...
```

## Next Steps

1. ✅ Environment variables configured
2. ✅ API routes created
3. ✅ Real-time WebSocket connection implemented
4. ✅ React Context updated
5. ✅ Server running

You're all set! The dashboard should now be connected to your Home Assistant server with real-time updates.
