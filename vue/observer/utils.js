export function def(obj, key, val, enumerable = false) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    configurable: true,
    writable: true,
  })
}