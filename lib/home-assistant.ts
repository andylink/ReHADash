export interface HAEntity {
  entity_id: string
  state: string
  attributes: Record<string, any>
  last_changed: string
  last_updated: string
}

export interface HAMessage {
  type: string
  [key: string]: any
}

export class HomeAssistantClient {
  private ws: WebSocket | null = null
  private messageId = 1
  private subscribers = new Map<string, Set<(entity: HAEntity) => void>>()
  private entities = new Map<string, HAEntity>()
  private reconnectTimeout: NodeJS.Timeout | null = null
  private authenticated = false
  private pendingRequests = new Map<number, { resolve: (value: any) => void; reject: (error: any) => void }>()

  constructor(
    private url: string,
    private token: string,
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = this.url.replace("http", "ws") + "/api/websocket"

      try {
        this.ws = new WebSocket(wsUrl)
      } catch (error) {
        reject(error)
        return
      }

      this.ws.onopen = () => {
        console.log("[HA] WebSocket connected")
      }

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data) as HAMessage

        if (message.type === "auth_required") {
          this.send({ type: "auth", access_token: this.token })
        } else if (message.type === "auth_ok") {
          console.log("[HA] Authenticated successfully")
          this.authenticated = true
          this.subscribeToStateChanges()
          resolve()
        } else if (message.type === "auth_invalid") {
          console.error("[HA] Authentication failed")
          reject(new Error("Authentication failed"))
        } else if (message.type === "event") {
          this.handleStateChange(message)
        } else if (message.type === "result") {
          if (message.success && message.result) {
            if (Array.isArray(message.result)) {
              message.result.forEach((entity: HAEntity) => {
                this.entities.set(entity.entity_id, entity)
                this.notifySubscribers(entity.entity_id, entity)
              })
            }
          }
          const pending = this.pendingRequests.get(message.id)
          if (pending) {
            if (message.success) {
              pending.resolve(message.result)
            } else {
              pending.reject(new Error(message.error?.message || "Request failed"))
            }
            this.pendingRequests.delete(message.id)
          }
        }
      }

      this.ws.onerror = (error) => {
        console.error("[HA] WebSocket error:", error)
        reject(error)
      }

      this.ws.onclose = () => {
        console.log("[HA] WebSocket closed")
        this.authenticated = false
        this.scheduleReconnect()
      }
    })
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return

    this.reconnectTimeout = setTimeout(() => {
      console.log("[HA] Attempting to reconnect...")
      this.reconnectTimeout = null
      this.connect().catch(console.error)
    }, 5000)
  }

  private send(message: HAMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ id: this.messageId++, ...message }))
    }
  }

  private subscribeToStateChanges() {
    this.send({
      type: "subscribe_events",
      event_type: "state_changed",
    })

    this.send({
      type: "get_states",
    })
  }

  private handleStateChange(message: HAMessage) {
    if (message.event?.data?.new_state) {
      const entity = message.event.data.new_state as HAEntity
      this.entities.set(entity.entity_id, entity)
      this.notifySubscribers(entity.entity_id, entity)
    }
  }

  private notifySubscribers(entityId: string, entity: HAEntity) {
    const callbacks = this.subscribers.get(entityId)
    if (callbacks) {
      callbacks.forEach((callback) => callback(entity))
    }
  }

  subscribe(entityId: string, callback: (entity: HAEntity) => void) {
    if (!this.subscribers.has(entityId)) {
      this.subscribers.set(entityId, new Set())
    }
    this.subscribers.get(entityId)!.add(callback)

    const currentEntity = this.entities.get(entityId)
    if (currentEntity) {
      callback(currentEntity)
    }

    return () => {
      const callbacks = this.subscribers.get(entityId)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(entityId)
        }
      }
    }
  }

  async getState(entityId: string): Promise<HAEntity | null> {
    const cached = this.entities.get(entityId)
    if (cached) {
      return cached
    }

    if (!this.authenticated) {
      return null
    }

    return new Promise((resolve, reject) => {
      const id = this.messageId
      this.pendingRequests.set(id, {
        resolve: (result) => {
          if (Array.isArray(result)) {
            const entity = result.find((e: HAEntity) => e.entity_id === entityId)
            resolve(entity || null)
          } else {
            resolve(result)
          }
        },
        reject,
      })

      this.send({
        type: "get_states",
      })

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error("Request timeout"))
        }
      }, 5000)
    })
  }

  async callService(domain: string, service: string, data?: Record<string, any>) {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        reject(new Error("Not authenticated"))
        return
      }

      const id = this.messageId
      this.pendingRequests.set(id, { resolve, reject })

      this.send({
        type: "call_service",
        domain,
        service,
        service_data: data,
      })

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error("Service call timeout"))
        }
      }, 10000)
    })
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    this.ws?.close()
    this.ws = null
    this.authenticated = false
  }
}
