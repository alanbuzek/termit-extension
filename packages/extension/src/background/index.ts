import "regenerator-runtime/runtime.js";
import { UserData } from "../common/model/User";
import Ajax, { content } from "../common/util/Ajax";
import Constants from "../common/util/Constants";
import SecurityUtils from "../common/util/SecurityUtils";
import BrowserApi from "../shared/BrowserApi";
import { ExtensionMessage } from "../shared/ExtensionMessage";

const annotaceApi = new Ajax({ baseURL: Constants.ANNOTACE_SERVER_URL });

export function runPageAnnotationAnalysis(
  pageHtml: string,
  vocabulary?: string
) {
  const payload: any = {
    content: pageHtml,
    vocabularyContexts: [],
    // TODO: language
    language: "cs",
  };

  if (vocabulary) {
    payload.vocabularyRepository = vocabulary;
  }

  return annotaceApi.post(
    "/annotate-to-occurrences",
    content(payload)
      .param("enableKeywordExtraction", "true")
      .accept(Constants.JSON_MIME_TYPE)
      .contentType(Constants.JSON_MIME_TYPE)
  );
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
    case ExtensionMessage.RunPageTextAnalysis: {
      runPageAnnotationAnalysis(
        message.payload.pageHtml,
        message.payload.vocabulary
      )
        .then((res) => {
          sendResponse({ data: res });
        })
        .catch(
          (err) => sendResponse({ error: "here" })
          // sendResponse({ error: err || true })
        );

      break;
    }
    case ExtensionMessage.SetWaitingForAuth: {
      BrowserApi.storage
        .set(Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH, sender.tab.id)
        .then(() => sendResponse({ data: {} }));
      console.log("setting tab id: ", sender.tab);
      break;
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

      const tabIdWaitingForAuth = await BrowserApi.storage.get(
        Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH
      );
      if (typeof tabIdWaitingForAuth === "number") {
        console.log("sending to tab: ", tabIdWaitingForAuth);
        // talk to content scripts if relevant
        chrome.tabs.sendMessage(tabIdWaitingForAuth, {
          type: ExtensionMessage.LoginEvent,
        });
        await BrowserApi.storage.remove(
          Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH
        );
      }

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

// chrome.action.onClicked.addListener((tab) => {
//   if (!tab || !tab.id) {
//     return;
//   }
//   chrome.tabs.sendMessage(tab.id, { type: ExtensionMessage.OpenToolbar });
// });

type LoginEventPayload = {
  userData: UserData;
  authToken: string;
};

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {}
);

// const optionsUrl = chrome.runtime.getURL("options.html");

// chrome.tabs.query({ url: optionsUrl }, (tabs) => {
//   if (tabs.length) {
//     chrome.tabs.update(tabs[0].id!, { active: true });
//   } else {
//     chrome.tabs.create({ url: optionsUrl });
//   }
// });
