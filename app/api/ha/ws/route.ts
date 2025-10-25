import { NextRequest } from "next/server";

const HA_URL = process.env.HA_URL || "http://192.168.1.181:8123";
const HA_TOKEN = process.env.HA_TOKEN || "";

// This endpoint provides WebSocket proxy information
export async function GET(request: NextRequest) {
  // For Next.js, we'll use Server-Sent Events (SSE) as an alternative to WebSocket
  // or direct REST API polling from the client

  return Response.json({
    wsUrl: HA_URL.replace("http", "ws") + "/api/websocket",
    restUrl: HA_URL,
    useProxy: true, // Indicates client should use API proxy
  });
}
