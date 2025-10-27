import { NextRequest } from "next/server";

const HA_URL = process.env.HA_URL || "http://192.168.1.181:8123";
const HA_TOKEN = process.env.HA_TOKEN || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

    let endpoint = "";
    let method = "POST";
    let requestBody: any = params;

    switch (type) {
      case "get_states":
        endpoint = "/api/states";
        method = "GET";
        break;
      case "get_state":
        endpoint = `/api/states/${params.entity_id}`;
        method = "GET";
        break;
      case "call_service":
        endpoint = `/api/services/${params.domain}/${params.service}`;
        requestBody = params.service_data || {};
        break;
      case "get_history":
        if (!params.entity_id || !params.start || !params.end) {
          return Response.json(
            { error: "Missing parameters" },
            { status: 400 }
          );
        }
        endpoint = `/api/history/period/${encodeURIComponent(
          params.start
        )}?filter_entity_id=${encodeURIComponent(
          params.entity_id
        )}&end_time=${encodeURIComponent(params.end)}`;
        method = "GET";
        break;
      default:
        return Response.json(
          { error: "Unknown request type" },
          { status: 400 }
        );
    }

    const url = `${HA_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${HA_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    if (method === "POST") {
      options.body = JSON.stringify(requestBody);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      console.error("[HA API] Error:", error);
      return Response.json(
        { error: `HA API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("[HA API] Request failed:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
