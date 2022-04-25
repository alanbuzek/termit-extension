import { resolve } from "path";
import "regenerator-runtime/runtime.js";
import api from "../api";
import { SKIP_CACHE } from "../api/cache";
import { UserData } from "../common/model/User";
import Constants from "../common/util/Constants";
import SecurityUtils from "../common/util/SecurityUtils";
import BrowserApi from "../shared/BrowserApi";
import { MessageType } from "../types/messageTypes";
// import { JSDOM } from 'jsdom';

export enum ExtensionMessage {
  LoginEvent,
  LogoutEvent,
}

// handles request from content scripts
function addListeners() {
  chrome.runtime.onMessage.addListener(handleMessages);
  chrome.runtime.onMessageExternal.addListener(handleExternalMessages);
}

addListeners();

function handleMessages(message, sender, sendResponse) {
  console.log(
    "[Background] got handle message: ",
    message,
    "sendResponse: ",
    sendResponse
  );

  switch (message.type) {
    // TODO: why not just call it directly from content script?
    case MessageType.GetPageAnnotationsAnalysis: {
      api
        .runPageAnnotationAnalysis(
          message.payload.vocabulary,
          message.payload.pageHtml
        )
        .then((res) => {
          sendResponse({ data: res });
        })
        .catch(
          (err) => sendResponse({ error: "here" })
          // sendResponse({ error: err || true })
        );
    }
  }

  return true;
}

// const BrowserStorage = {
//   set(key: string, value: any) {
//     return new Promise((resolve) => {
//       chrome.storage.local.set({ [key]: value }, function () {
//         chrome.storage.local.get([key], (result) => {
//           console.log("Inside got key: ", result[key]);
//           resolve(result[key]);
//         });
//       });
//     });
//   },
//   get(key: string, defaultValue?: any): Promise<any> {
//     return new Promise((resolve) => {
//       console.log("getting: ", [key]);
//       chrome.storage.local.get([key], (result) => {
//         console.log("OUTSIDE got key2: ", result[key]);
//         resolve(result[key]);
//       });
//     });
//   },
//   remove(key: string) {
//     return chrome.storage.local.remove(key);
//   },
// };

// const storageTest = async (name) => {
//   console.log("starting storage test!");
//   const value = { complex: "TEST-NAME-" + Math.random() };
//   console.log("setting test: ", { [name]: value });
//   console.log("getting test: ", [name]);

//   await BrowserStorage.set(name, value);

//   await BrowserStorage.get(name).then((result) => {
//     console.log("OUTSIDE got name H-E-R-E: ", result);
//   });
// };

async function handleExternalMessages(message, sender, sendResponse) {
  switch (message.type) {
    case ExtensionMessage.LoginEvent: {
      // await storageTest('Constants.STORAGE.USER');
      // return;
      console.log("got to login event case");
      const name = "NO-NAME-" + Math.random();
      const { userData, authToken } = message.payload as LoginEventPayload;

      // TODO: handle failure
      await BrowserApi.storage.set(Constants.STORAGE.USER, userData);
      await SecurityUtils.saveToken(authToken);

      sendResponse({ success: true });
      break;
    }
    case ExtensionMessage.LogoutEvent: {
      SecurityUtils.clearToken();
      BrowserApi.storage.remove(Constants.STORAGE.USER);
      break;
    }
    default: {
      console.warn("Unknown message type: ", message.type);
      sendResponse({ error: true });
    }
  }

  return true;
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) {
    return;
  }
  chrome.tabs.sendMessage(
    tab.id,
    { type: MessageType.OpenToolbar },
    function (response) {}
  );
});

// if (SecurityUtils.isLoggedIn()){
//   api.loadVocabularies(SKIP_CACHE);
// }

type LoginEventPayload = {
  userData: UserData;
  authToken: string;
};

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {}
);
