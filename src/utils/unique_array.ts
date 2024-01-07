/**
 * Returns an array with unique elements from the input array of strings
 * @param array Input array containing strings
 * @returns Unique array of strings
 */
export function setUniqueArray(array: string[]): string[]

/**
 * Returns an array with unique elements from the input array of objects based on a specific property
 * @param array Input array containing objects
 * @param prop Property of the objects to filter duplicates
 * @returns Unique array of objects
 */
export function setUniqueArray<T extends Record<string, any>>(
  array: T[],
  prop: string
): T[]

// Implementation
export function setUniqueArray(array: any[], prop?: string): any[] {
  if (typeof prop === 'string') {
    const uniqueMap = new Map()

    for (const item of array) {
      if (!uniqueMap.has(item[prop])) {
        uniqueMap.set(item[prop], item)
      }
    }

    return Array.from(uniqueMap.values())
  } else {
    return [...new Set(array)]
  }
}
