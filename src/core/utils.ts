export function deepClone(elem: any): any {
  if (typeof elem === 'object' && elem !== null) {
    return Object.keys(elem).reduce(
      (acc, key) => {
        acc[key] = deepClone(elem[key])
        return acc
      },
      Array.isArray(elem) ? [] : ({} as any)
    )
  }
  return elem
}
