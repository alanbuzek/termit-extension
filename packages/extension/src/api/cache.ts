import BrowserApi from '../shared/BrowserApi';
import browserApi from "../shared/BrowserApi";

export const SKIP_CACHE = 'SKIP_CACHE';

export const cachedCall = (key, callback) => {
  return async (...args) => {
    const skipCache = args.length && args[args.length - 1] === SKIP_CACHE;
    // TODO: put cache back in
    if (!skipCache && false) {
      const cache = await BrowserApi.storage.get(key);
      console.log('read cache: ', cache);
      if (cache) {
        return cache;
      }
    }

    const result = await callback(...args);

    await BrowserApi.storage.set(key, result);

    return result;
  };
};
