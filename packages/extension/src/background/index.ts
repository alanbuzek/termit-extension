import "regenerator-runtime/runtime.js";
// import api from "../api";
import { UserData } from "../common/model/User";
import Ajax, { content } from "../common/util/Ajax";
import Constants from "../common/util/Constants";
import SecurityUtils from "../common/util/SecurityUtils";
import BrowserApi from "../shared/BrowserApi";
import { MessageType } from "../types/messageTypes";
// import { JSDOM } from 'jsdom';

const annotaceApi = new Ajax({ baseURL: Constants.ANNOTACE_SERVER_URL });

export function runPageAnnotationAnalysis(
  vocabulary: string,
  pageHtml: string
) {
  return annotaceApi.post(
    "/annotate-to-occurrences",
    content({
      content: pageHtml,
      vocabularyRepository: vocabulary,
      vocabularyContexts: [],
      // TODO: language
      language: "cs",
    })
      .param("enableKeywordExtraction", "true")
      .accept(Constants.JSON_MIME_TYPE)
      .contentType(Constants.JSON_MIME_TYPE)
  );
}

export enum ExtensionMessage {
  LoginEvent,
  LogoutEvent,
  ConfigurationLoadedEvent,
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
    case MessageType.RunPageTextAnalysis: {
      runPageAnnotationAnalysis(
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
async function handleExternalMessages(message, sender, sendResponse) {
  switch (message.type) {
    case ExtensionMessage.LoginEvent: {
      // await storageTest('Constants.STORAGE.USER');
      // return;
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
      await BrowserApi.storage.remove(Constants.STORAGE.USER);
      sendResponse({ success: true });
      break;
    }
    case ExtensionMessage.ConfigurationLoadedEvent: {
      const { language, locale } = message.payload;
      if (language) {
        await BrowserApi.storage.set(Constants.STORAGE.LANGUAGE, language);
      }
      if (locale) {
        await BrowserApi.storage.set(Constants.STORAGE.LOCALE, locale);
      }
      sendResponse({ success: true });
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
  chrome.tabs.sendMessage(tab.id, { type: MessageType.OpenToolbar });
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
