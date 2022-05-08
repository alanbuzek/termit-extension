import BrowserApi from "../shared/BrowserApi";

export const SKIP_CACHE = "SKIP_CACHE";

export const cachedCall = (key, callback) => {
  return async (...args) => {
    const skipCache = args.length && args[args.length - 1] === SKIP_CACHE;
    // // TODO: put cache back in
    if (!skipCache) {
      const cache = await BrowserApi.storage.get(key);
      console.log("cache result: ", cache, ", key: ", key);

      if (cache) {
        return cache;
      }
    }

    const result = await callback(...args);
    console.log("fresh result: ", result);
    // await BrowserApi.storage.set(key, result);

    return result;
  };
};
