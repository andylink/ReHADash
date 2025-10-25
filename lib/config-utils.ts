interface BaseConfig {
  id?: string
  type: string
  entityId?: string
  entityIds?: string[]
}

/**
 * Generates a unique ID for a widget or chip if one is not provided
 * Priority: 1) Use provided id, 2) Use entityId, 3) Use first entityId, 4) Generate from type + index
 */
export function ensureId<T extends BaseConfig>(item: T, index: number): T & { id: string } {
  if (item.id) {
    return item as T & { id: string }
  }

  // Use entityId if available
  if (item.entityId) {
    return { ...item, id: item.entityId }
  }

  // Use first entityId if available (for light-group widgets)
  if (item.entityIds && item.entityIds.length > 0) {
    return { ...item, id: item.entityIds[0] }
  }

  // Generate from type + index
  return { ...item, id: `${item.type}-${index}` }
}

/**
 * Ensures all items in an array have unique IDs
 */
export function ensureUniqueIds<T extends BaseConfig>(items: T[]): Array<T & { id: string }> {
  const usedIds = new Set<string>()

  return items.map((item, index) => {
    const itemWithId = ensureId(item, index)

    // If ID is already used, append a number
    let finalId = itemWithId.id
    let counter = 1
    while (usedIds.has(finalId)) {
      finalId = `${itemWithId.id}-${counter}`
      counter++
    }

    usedIds.add(finalId)
    return { ...itemWithId, id: finalId }
  })
}
