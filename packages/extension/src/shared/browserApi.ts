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


export default {
  sendMessage,
}