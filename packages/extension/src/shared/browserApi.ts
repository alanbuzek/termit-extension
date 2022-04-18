// promisified browser api calls
const sendMessage = (payload) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(payload, async (response) => {
      const { data, error } = response;

      if (error) {
        reject("There was an error sending this message: " + error);
        return;
      }

      resolve(data);
    });
  });
};

const storageSet = (key: string, value: any) => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, () => {
      chrome.storage.local.set({ [key]: value }, function () {
        console.log(
          "runtime.lastError (local.set): ",
          chrome.runtime.lastError
        );
        resolve(null);
      });
    });
  });
};

const storageGet = (key: string) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], function (result) {
      console.log("runtime.lastError (local.get): ", chrome.runtime.lastError);
      console.log("got result: ", result);
      resolve(result[key]);
    });
  });
};

export default {
  sendMessage,
  storageSet,
  storageGet,
};
