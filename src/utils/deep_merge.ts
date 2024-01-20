/**
 * Checks if the given item is an object.
 * @param item The item to check
 * @returns True if the item is an object, false otherwise
 */
export function isObject(item: any): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Recursively merges two or more objects deeply.
 * Arrays are concatenated, and objects are merged together.
 * @param target The target object to merge into
 * @param sources Objects to merge into the target
 * @returns A new object resulting from the deep merge
 */
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target

  const merged = isObject(target) ? { ...target } : target

  for (const source of sources) {
    if (isObject(source)) {
      for (const key in source) {
        if (isObject(source[key]) && isObject(merged[key])) {
          merged[key] = mergeDeep(merged[key], source[key])
        } else if (Array.isArray(source[key]) && Array.isArray(merged[key])) {
          merged[key] = merged[key].concat(source[key]) // Merge arrays
        } else {
          merged[key] = source[key] // Replace or set values
        }
      }
    }
  }

  return merged
}

// Example usage
// const targetObject = {
//   a: 1,
//   b: {
//     c: 2,
//     d: [3, 4],
//     e: { f: 5 }
//   }
// }

// const sourceObject1 = {
//   b: {
//     c: 10,
//     d: [20],
//     e: { g: 30 }
//   },
//   h: 40
// }

// const sourceObject2 = {
//   b: {
//     d: [50, 60],
//     e: { h: 70 }
//   },
//   i: 80
// }

// const mergedObject = mergeDeep(targetObject, sourceObject1, sourceObject2)
// console.log(mergedObject)

// It'll give this:
// {
//   a: 1,
//   b: { c: 10, d: [ 3, 4, 20, 50, 60 ], e: { f: 5, g: 30, h: 70 } },
//   h: 40,
//   i: 80
// }
