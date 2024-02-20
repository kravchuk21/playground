function abortable(promise, abortSignal) {
  return new Promise((resolve, reject) => {
      const onAbort = () => {
          reject('Aborted');
      }
    abortSignal.addEventListener('abort', onAbort, { once: true });

    promise.then((res) => {
        abortSignal.removeEventListener('abort', onAbort);
        resolve(res);
    }, (err) => {
        abortSignal.removeEventListener('abort', onAbort);
        reject(err);
    });
  })
}

const controller = new AbortController();

abortable(sleep(500), controller.signal)

controller.abort();