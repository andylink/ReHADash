import { NextRequest } from "next/server";
import WebSocket from "ws";

const HA_URL = process.env.HA_URL || "http://192.168.1.181:8123";
const HA_TOKEN = process.env.HA_TOKEN || "";

// Server-Sent Events endpoint for real-time updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const wsUrl =
        HA_URL.replace("http://", "ws://").replace("https://", "wss://") +
        "/api/websocket";

      let ws: WebSocket;
      let messageId = 1;
      let authenticated = false;
      let heartbeatInterval: NodeJS.Timeout;

      const sendMessage = (message: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ id: messageId++, ...message }));
        }
      };

      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      const connectWebSocket = () => {
        try {
          ws = new WebSocket(wsUrl);

          ws.on("open", () => {
            console.log("[HA WS] Connected to Home Assistant");
          });

          ws.on("message", (data: Buffer) => {
            try {
              const message = JSON.parse(data.toString());

              if (message.type === "auth_required") {
                console.log("[HA WS] Auth required");
                ws.send(
                  JSON.stringify({ type: "auth", access_token: HA_TOKEN })
                );
              } else if (message.type === "auth_ok") {
                console.log("[HA WS] Authenticated successfully");
                authenticated = true;

                // Subscribe to state changes
                sendMessage({
                  type: "subscribe_events",
                  event_type: "state_changed",
                });

                // Get initial states
                sendMessage({
                  type: "get_states",
                });

                // Send connected event
                sendEvent({ type: "connected" });

                // Start heartbeat
                heartbeatInterval = setInterval(() => {
                  sendMessage({ type: "ping" });
                }, 30000);
              } else if (message.type === "auth_invalid") {
                console.error("[HA WS] Authentication failed");
                sendEvent({ type: "error", error: "Authentication failed" });
              } else if (message.type === "event") {
                // Forward state change events to client
                if (message.event?.event_type === "state_changed") {
                  sendEvent({
                    type: "state_changed",
                    entity_id: message.event.data.entity_id,
                    new_state: message.event.data.new_state,
                    old_state: message.event.data.old_state,
                  });
                }
              } else if (message.type === "result") {
                // Forward results to client
                sendEvent({
                  type: "result",
                  id: message.id,
                  success: message.success,
                  result: message.result,
                });
              }
            } catch (err) {
              console.error("[HA WS] Error parsing message:", err);
            }
          });

          ws.on("error", (error) => {
            console.error("[HA WS] WebSocket error:", error);
            sendEvent({ type: "error", error: error.message });
          });

          ws.on("close", () => {
            console.log("[HA WS] Connection closed");
            authenticated = false;
            if (heartbeatInterval) {
              clearInterval(heartbeatInterval);
            }

            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
              console.log("[HA WS] Attempting to reconnect...");
              connectWebSocket();
            }, 5000);
          });
        } catch (err) {
          console.error("[HA WS] Error creating WebSocket:", err);
          sendEvent({
            type: "error",
            error: "Failed to create WebSocket connection",
          });
        }
      };

      connectWebSocket();

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        console.log("[HA WS] Client disconnected");
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
        if (ws) {
          ws.close();
        }
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
