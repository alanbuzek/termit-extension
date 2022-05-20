import BrowserApi from '../BrowserApi';

export const SKIP_CACHE = 'SKIP_CACHE';

/**
 * This function allows to call any function show results could have been in cache, based on the a 'key' value
 */
export const cachedCall =
  (key, callback) =>
  async (...args) => {
    const skipCache = args.length && args[args.length - 1] === SKIP_CACHE;
    if (!skipCache) {
      const cache = await BrowserApi.storage.get(key);

      if (cache) {
        return cache;
      }
    }

    const result = await callback(...args);
    console.debug('fresh result: ', result);

    return result;
  };
