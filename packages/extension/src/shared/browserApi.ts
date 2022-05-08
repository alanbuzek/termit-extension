const promisify = (functionCall) => (payload) =>
  new Promise((resolve, reject) => {
    functionCall(payload, (response) => {
      if (response?.error || chrome.runtime.lastError) {
        reject(response?.error || chrome.runtime.lastError);
        return;
      }
      resolve(response);
    });
  });

// promisified and contained browser api
const BrowserApi = {
  // promisified browser api calls
  sendMessage(payload) {
    // TODO: abstract promisify
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(payload, async (response) => {
        if (!response) {
          resolve(null);
        }
        const { data, error } = response;

        if (error) {
          reject("There was an error sending this message: " + error);
          return;
        }

        resolve(data);
      });
    });
  },
  sendMessageToTab(tabId, payload) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(tabId, payload, async (response) => {
        const { data, error } = response;

        if (error) {
          reject("There was an error sending this message: " + error);
          return;
        }

        resolve(data);
      });
    });
  },

  storage: {
    set(key: string, value: any) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, function () {
          resolve(null);
        });
      });
    },
    get(key: string, defaultValue?: any): Promise<any> {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    },
    remove(key: string) {
      return chrome.storage.local.remove(key);
    },
    clear() {
      return chrome.storage.local.clear();
    },
  },
};

export default BrowserApi;
