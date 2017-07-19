//
export async function wrapDeferred(deferred: any) {
  return new Promise((resolve, reject) => {
    deferred.then(resolve, reject)
  })
}
