export function createCompleter<T>() {
  let resolver: (value?: T) => void
  let rejecter: (reason?: any) => void
  let isDone = false
  const promise = new Promise((resolve, reject) => {
    resolver = (e) => {
      if (isDone) {
        throw new Error('Completer is done')
      } else {
        resolve(e)
      }
      isDone = true
    }
    rejecter = (reason: any) => {
      if (isDone) {
        throw new Error('Completer is done')
      } else {
        reject(reason)
      }
    }
  })
  return { promise, resolver, rejecter }
}
