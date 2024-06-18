/**
 * Returns an array with unique elements from the input array.
 *
 * This function has two overloads:
 * 1. For an array of strings, it returns an array with unique strings.
 * 2. For an array of objects, it returns an array with unique objects based on a specified property.
 *
 * @param array - The input array, either of strings or objects.
 * @returns An array with unique elements.
 */
export function setUniqueArray(array: string[]): string[]

/**
 * Returns an array with unique elements from the input array of objects based on a specific property.
 *
 * @param array - The input array of objects.
 * @param prop - The property of the objects used to determine uniqueness.
 * @returns An array with unique objects based on the specified property.
 */
export function setUniqueArray<T extends Record<string, any>>(array: T[], prop: string): T[]

/**
 * Implementation of the `setUniqueArray` function that handles both strings and objects.
 *
 * For an array of strings, it removes duplicate strings.
 * For an array of objects, it removes duplicates based on a specified property.
 *
 * @param array - The input array, either of strings or objects.
 * @param [prop] - Optional property name if the input array is an array of objects.
 * @returns An array with unique elements.
 */
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
