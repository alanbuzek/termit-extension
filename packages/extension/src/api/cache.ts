import browserApi from "../shared/browserApi";

export const cachedCall = (key, callback) => {
  console.log("about to return from cached call", key, callback);
  return async (...args) => {
    const skipCache = args.length && args[args.length - 1] === 'SKIP_CACHE';
    if (!skipCache) {
      const cache = await browserApi.storageGet(key);
      if (cache) {
        return cache;
      }
    }

    const result = await callback(...args);

    await browserApi.storageSet(key, result);

    return result;
  };
};
