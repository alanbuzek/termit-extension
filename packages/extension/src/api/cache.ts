import browserApi from "../shared/browserApi";

export const cachedCall = (key, callback) => {
  console.log('about to return from cached call', key, callback)
  return async (...args) => {
    const cache = await browserApi.storageGet(key);
    if (cache) {
      return cache;
    }
    const result = await callback(...args);

    await browserApi.storageSet(key, result);

    return result;
  };
};