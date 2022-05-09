import "regenerator-runtime/runtime.js";
import { cachedCall, SKIP_CACHE } from "../api/cache";
import { UserData } from "../common/model/User";
import Vocabulary, {
  VocabularyData,
  CONTEXT as VOCABULARY_CONTEXT,
} from "../common/model/Vocabulary";
import Ajax, { content } from "../common/util/Ajax";
import Constants from "../common/util/Constants";
import JsonLdUtils from "../common/util/JsonLdUtils";
import SecurityUtils from "../common/util/SecurityUtils";
import { cleanOnLogout } from "../content/helper/storageHelpers";
import BrowserApi from "../shared/BrowserApi";
import { ExtensionMessage } from "../shared/ExtensionMessage";
export async function runPageAnnotationAnalysis(
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

  const instance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  const annotaceApi = new Ajax({
    baseURL: instance?.annotaceService || Constants.ANNOTACE_SERVER_URL,
  });

  return annotaceApi.post(
    "/annotate",
    content(payload)
      .param("enableKeywordExtraction", "true")
      .accept(Constants.JSON_MIME_TYPE)
      .contentType(Constants.JSON_MIME_TYPE)
  );
}

export const loadVocabularies = cachedCall("vocabularies", async () => {
  const instance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  const termitApi = new Ajax({
    baseURL: instance?.termitServer || Constants.TERMIT_SERVER_URL,
  });

  const vocabularies = await termitApi
    .get("/vocabularies")
    .then((data: object[]) => {
      return data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<VocabularyData>(
            data,
            VOCABULARY_CONTEXT
          )
        : [];
    })
    .then((data: VocabularyData[]) => {
      return data.map((v) => new Vocabulary(v).mapToMinifiedVersion());
    });

  return vocabularies;
});

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
      const { userData, authToken } = message.payload as LoginEventPayload;

      // TODO: handle failure
      await BrowserApi.storage.set(Constants.STORAGE.USER, userData);
      await SecurityUtils.saveToken(authToken);
      console.log("storing: ", Constants.STORAGE.USER, userData);

      // refresh vocabularies cache
      loadVocabularies(SKIP_CACHE);

      const tabIdWaitingForAuth = await BrowserApi.storage.get(
        Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH
      );
      if (typeof tabIdWaitingForAuth === "number") {
        console.log("sending to tab: ", tabIdWaitingForAuth);
        // talk to content scripts if relevant
        chrome.tabs.sendMessage(
          tabIdWaitingForAuth,
          {
            type: ExtensionMessage.LoginEvent,
          },
          async (response) => {
            if (response?.success) {
              // focus relevant tab
              chrome.tabs.update(tabIdWaitingForAuth, { active: true });
              await BrowserApi.storage.remove(
                Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH
              );
            }
          }
        );
      }

      sendResponse({ success: true });
      break;
    }
    case ExtensionMessage.LogoutEvent: {
      SecurityUtils.clearToken();
      cleanOnLogout();
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
