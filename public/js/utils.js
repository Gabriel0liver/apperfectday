/**
 * @param {number} ms
 * @param {() => void} [callback]
 * @returns {Promise<void>}
 */
function macrotask(ms, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (callback) {
        callback();
      }
      resolve();
    }, ms);
  });
}

/**
 * Añade un
 * @template T
 * @param {{ promise: PromiseLike<T>; ms: number; }} options
 * @returns {Promise<T>}
 */
function waitAtLeast(options) {
  return Promise.all([options.promise, macrotask(options.ms)]).then(
    (r) => r[0]
  );
}
