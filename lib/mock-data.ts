import type { HAEntity } from "./home-assistant"

// Mock data for Home Assistant entities
export const mockEntities: Record<string, HAEntity> = {
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
      rgb_color: [255, 170, 51],
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
      hs_color: [30, 80],
      rgb_color: [255, 170, 51],
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
      hs_color: [0, 0],
      rgb_color: [255, 255, 255],
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
      hs_color: [200, 60],
      rgb_color: [102, 178, 255],
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
}

// Simulate state changes for mock data
export function toggleMockEntity(entityId: string): HAEntity | null {
  const entity = mockEntities[entityId]
  if (!entity) return null

  // Toggle state based on entity type
  if (entity.entity_id.startsWith("light.")) {
    entity.state = entity.state === "on" ? "off" : "on"
    if (entity.state === "on" && entity.attributes.brightness) {
      entity.attributes.brightness = 255
    }
  } else if (entity.entity_id.startsWith("switch.")) {
    entity.state = entity.state === "on" ? "off" : "on"
  }

  entity.last_changed = new Date().toISOString()
  entity.last_updated = new Date().toISOString()

  return { ...entity }
}

export function updateMockEntity(entityId: string, data: Record<string, any>): HAEntity | null {
  const entity = mockEntities[entityId]
  if (!entity) return null

  // Update attributes based on data
  if (data.brightness !== undefined) {
    entity.attributes.brightness = data.brightness
    entity.state = data.brightness > 0 ? "on" : "off"
  }

  if (data.temperature !== undefined) {
    entity.attributes.temperature = data.temperature
  }

  if (data.hvac_mode !== undefined) {
    entity.state = data.hvac_mode
  }

  if (data.hs_color !== undefined) {
    entity.attributes.hs_color = data.hs_color
  }

  if (data.rgb_color !== undefined) {
    entity.attributes.rgb_color = data.rgb_color
  }

  entity.last_changed = new Date().toISOString()
  entity.last_updated = new Date().toISOString()

  return { ...entity }
}
