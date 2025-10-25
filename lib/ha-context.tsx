"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { HAEntity } from "./home-assistant";

console.log("[HA] ha-context.tsx loaded - connecting to Home Assistant");

// Mock data for Home Assistant entities (fallback)
const createMockEntities = (): Record<string, HAEntity> => ({
  "light.living_room": {
    entity_id: "light.living_room",
    state: "on",
    attributes: {
      friendly_name: "Living Room Light",
      brightness: 200,
      color_temp: 370,
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "light.bedroom": {
    entity_id: "light.bedroom",
    state: "off",
    attributes: {
      friendly_name: "Bedroom Light",
      brightness: 150,
      color_temp: 400,
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "light.kitchen": {
    entity_id: "light.kitchen",
    state: "on",
    attributes: {
      friendly_name: "Kitchen Light",
      brightness: 255,
      hs_color: [30, 80],
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "light.dining_room": {
    entity_id: "light.dining_room",
    state: "on",
    attributes: {
      friendly_name: "Dining Room Light",
      brightness: 200,
      hs_color: [45, 70],
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "light.hallway": {
    entity_id: "light.hallway",
    state: "off",
    attributes: {
      friendly_name: "Hallway Light",
      brightness: 180,
      hs_color: [60, 60],
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "light.bathroom": {
    entity_id: "light.bathroom",
    state: "on",
    attributes: {
      friendly_name: "Bathroom Light",
      brightness: 220,
      hs_color: [180, 50],
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "light.office": {
    entity_id: "light.office",
    state: "on",
    attributes: {
      friendly_name: "Office Light",
      brightness: 240,
      hs_color: [200, 65],
      supported_features: 43,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "climate.thermostat": {
    entity_id: "climate.thermostat",
    state: "heat",
    attributes: {
      friendly_name: "Thermostat",
      current_temperature: 21.5,
      temperature: 22,
      hvac_modes: ["off", "heat", "cool", "auto"],
      min_temp: 15,
      max_temp: 30,
      target_temp_step: 0.5,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "sensor.living_room_temperature": {
    entity_id: "sensor.living_room_temperature",
    state: "21.5",
    attributes: {
      friendly_name: "Living Room Temperature",
      unit_of_measurement: "°C",
      device_class: "temperature",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "sensor.living_room_humidity": {
    entity_id: "sensor.living_room_humidity",
    state: "45",
    attributes: {
      friendly_name: "Living Room Humidity",
      unit_of_measurement: "%",
      device_class: "humidity",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "switch.front_door_lock": {
    entity_id: "switch.front_door_lock",
    state: "on",
    attributes: {
      friendly_name: "Front Door Lock",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "weather.home": {
    entity_id: "weather.home",
    state: "22",
    attributes: {
      friendly_name: "Home Weather",
      condition: "partly-cloudy",
      humidity: 65,
      wind_speed: 12,
      temperature: 22,
      forecast: [],
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "person.john": {
    entity_id: "person.john",
    state: "home",
    attributes: {
      friendly_name: "John",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "person.jane": {
    entity_id: "person.jane",
    state: "away",
    attributes: {
      friendly_name: "Jane",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "binary_sensor.front_door": {
    entity_id: "binary_sensor.front_door",
    state: "off",
    attributes: {
      friendly_name: "Front Door",
      device_class: "door",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "binary_sensor.garage_door": {
    entity_id: "binary_sensor.garage_door",
    state: "off",
    attributes: {
      friendly_name: "Garage Door",
      device_class: "garage_door",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
  "switch.security_system": {
    entity_id: "switch.security_system",
    state: "on",
    attributes: {
      friendly_name: "Security System",
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  },
});

interface HAContextType {
  connected: boolean;
  error: string | null;
  entities: Record<string, HAEntity>;
  updateEntity: (entityId: string, updates: Partial<HAEntity>) => void;
  getEntity: (entityId: string) => HAEntity | null;
  callService: (
    domain: string,
    service: string,
    entityId: string,
    data?: Record<string, any>
  ) => Promise<void>;
}

const HAContext = createContext<HAContextType>({
  connected: false,
  error: null,
  entities: {},
  updateEntity: () => {},
  getEntity: () => null,
  callService: async () => {},
});

export function HAProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entities, setEntities] = useState<Record<string, HAEntity>>({});

  useEffect(() => {
    console.log(
      "[HA] HAProvider initializing - connecting to Home Assistant via SSE"
    );
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource("/api/ha/stream");

        eventSource.onopen = () => {
          console.log("[HA] SSE connection opened");
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            switch (data.type) {
              case "connected":
                console.log("[HA] Connected to Home Assistant");
                setConnected(true);
                setError(null);
                break;

              case "state_changed":
                console.log("[HA] State changed:", data.entity_id);
                if (data.new_state) {
                  setEntities((prev) => ({
                    ...prev,
                    [data.entity_id]: data.new_state,
                  }));
                }
                break;

              case "result":
                if (data.success && data.result) {
                  if (Array.isArray(data.result)) {
                    // This is the initial states response
                    console.log(
                      "[HA] Received initial states:",
                      data.result.length,
                      "entities"
                    );
                    const entitiesMap: Record<string, HAEntity> = {};
                    data.result.forEach((entity: HAEntity) => {
                      entitiesMap[entity.entity_id] = entity;
                    });
                    setEntities(entitiesMap);
                  }
                }
                break;

              case "error":
                console.error("[HA] Error from stream:", data.error);
                setError(data.error);
                break;
            }
          } catch (err) {
            console.error("[HA] Error parsing SSE message:", err);
          }
        };

        eventSource.onerror = (err) => {
          console.error("[HA] SSE error:", err);
          setConnected(false);
          eventSource?.close();

          // Fallback to polling if SSE fails
          console.log("[HA] SSE failed, falling back to polling");
          startPolling();
        };
      } catch (err) {
        console.error("[HA] Error creating EventSource:", err);
        startPolling();
      }
    };

    const startPolling = () => {
      // Fallback polling method
      const fetchStates = async () => {
        try {
          const response = await fetch("/api/ha", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "get_states" }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch states: ${response.statusText}`);
          }

          const states = await response.json();
          console.log(
            "[HA] Fetched states (polling):",
            states.length,
            "entities"
          );

          const entitiesMap: Record<string, HAEntity> = {};
          states.forEach((entity: HAEntity) => {
            entitiesMap[entity.entity_id] = entity;
          });

          setEntities(entitiesMap);
          setConnected(true);
          setError(null);
        } catch (err) {
          console.error("[HA] Error fetching states:", err);
          setError(err instanceof Error ? err.message : "Failed to connect");
          setConnected(false);

          // Fallback to mock data on error
          setEntities(createMockEntities());
        }
      };

      // Initial fetch
      fetchStates();

      // Poll for updates every 2 seconds
      reconnectTimeout = setInterval(fetchStates, 2000);
    };

    // Try SSE first
    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearInterval(reconnectTimeout);
      }
    };
  }, []);

  const updateEntity = useCallback(
    (entityId: string, updates: Partial<HAEntity>) => {
      setEntities((prev) => ({
        ...prev,
        [entityId]: {
          ...prev[entityId],
          ...updates,
          last_changed: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        },
      }));
    },
    []
  );

  const getEntity = useCallback(
    (entityId: string) => {
      return entities[entityId] || null;
    },
    [entities]
  );

  const callService = useCallback(
    async (
      domain: string,
      service: string,
      entityId: string,
      data?: Record<string, any>
    ) => {
      try {
        console.log(
          "[HA] callService:",
          domain,
          service,
          "for entity:",
          entityId,
          "data:",
          data
        );

        const serviceData: Record<string, any> = {
          entity_id: entityId,
          ...data,
        };

        const response = await fetch("/api/ha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "call_service",
            domain,
            service,
            service_data: serviceData,
          }),
        });

        if (!response.ok) {
          throw new Error(`Service call failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("[HA] Service call result:", result);

        // Fetch updated state after a short delay
        setTimeout(async () => {
          try {
            const stateResponse = await fetch("/api/ha", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "get_state",
                entity_id: entityId,
              }),
            });

            if (stateResponse.ok) {
              const updatedEntity = await stateResponse.json();
              updateEntity(entityId, updatedEntity);
            }
          } catch (err) {
            console.error("[HA] Error fetching updated state:", err);
          }
        }, 200);
      } catch (err) {
        console.error("[HA] Error calling service:", err);
        throw err;
      }
    },
    [updateEntity]
  );

  return (
    <HAContext.Provider
      value={{
        connected,
        error,
        entities,
        updateEntity,
        getEntity,
        callService,
      }}
    >
      {children}
    </HAContext.Provider>
  );
}

export function useHomeAssistant() {
  return useContext(HAContext);
}

export function useEntity(entityId: string) {
  const { connected, entities, updateEntity, getEntity, callService } =
    useHomeAssistant();
  const entity = getEntity(entityId) || null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[HA] useEntity called for:", entityId, "entity:", entity);
    if (connected) {
      setLoading(false);
    }
  }, [connected, entityId, entity]);

  return { entity, callService, loading, entityId };
}

export function useEntities(entityIds: string[]) {
  const { connected, entities, updateEntity, getEntity, callService } =
    useHomeAssistant();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected) {
      setLoading(false);
    }
  }, [connected]);

  return {
    entities: entityIds.map((id) => getEntity(id)),
    callService,
    loading,
    getEntity,
  };
}
