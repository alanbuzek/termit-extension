import 'regenerator-runtime/runtime.js';
import { cachedCall, SKIP_CACHE } from '../shared/api/cache';
import { UserData } from '../termit-ui-common/model/User';
import Vocabulary, {
  VocabularyData,
  CONTEXT as VOCABULARY_CONTEXT,
} from '../termit-ui-common/model/Vocabulary';
import Ajax, { content } from '../termit-ui-common/util/Ajax';
import Constants from '../termit-ui-common/util/Constants';
import JsonLdUtils from '../termit-ui-common/util/JsonLdUtils';
import SecurityUtils from '../content/util/SecurityUtils';
import BrowserApi from '../shared/BrowserApi';
import ExtensionMessage from '../shared/ExtensionMessage';
import StorageUtils from '../content/util/StorageUtils';
import { DEFAULT_INSTANCE } from '../content/component/shared/InstanceSelection';

// move this into a separte file
export async function runPageAnnotationAnalysis(
  pageHtml: string,
  vocabulary?: string
) {
  const instance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  const vocabularyRepository = instance?.graphDb || DEFAULT_INSTANCE.graphDb;
  const payload: any = {
    content: pageHtml,
    vocabularyContexts: [],
    // TODO: language
    language: 'cs',
    vocabularyRepository,
  };
  if (vocabulary) {
    payload.vocabularyContexts.push(vocabulary);
  }

  const annotaceApi = new Ajax({
    baseURL: instance?.annotaceService || DEFAULT_INSTANCE.annotaceService,
  });

  return annotaceApi.post(
    '/annotate-to-occurrences',
    content(payload)
      .param('enableKeywordExtraction', 'true')
      .accept(Constants.JSON_MIME_TYPE)
      .contentType(Constants.JSON_MIME_TYPE)
  );
}

export const loadVocabularies = cachedCall('vocabularies', async () => {
  const instance = await BrowserApi.storage.get(
    Constants.STORAGE.TERMIT_INSTANCE
  );

  const termitApi = new Ajax({
    baseURL: instance?.termitServer || Constants.TERMIT_SERVER_URL,
  });

  const vocabularies = await termitApi
    .get('/vocabularies')
    // eslint-disable-next-line @typescript-eslint/ban-types
    .then((data: object[]) =>
      data.length !== 0
        ? JsonLdUtils.compactAndResolveReferencesAsArray<VocabularyData>(
            data,
            VOCABULARY_CONTEXT
          )
        : []
    )
    .then((data: VocabularyData[]) =>
      data.map((v) => new Vocabulary(v).mapToMinifiedVersion())
    );

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
    '[Background] got handle message: ',
    message,
    'sendResponse: ',
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
        .catch((error) => sendResponse({ error }));

      break;
    }
    case ExtensionMessage.SetWaitingForAuth: {
      BrowserApi.storage
        .set(Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH, sender.tab.id)
        .then(() => sendResponse({ data: {} }));
      console.log('setting tab id: ', sender.tab);
      break;
    }
    default: {
      sendResponse({});
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
      console.log('storing: ', Constants.STORAGE.USER, userData);

      // refresh vocabularies cache
      loadVocabularies(SKIP_CACHE);

      const tabIdWaitingForAuth = await BrowserApi.storage.get(
        Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH
      );
      if (typeof tabIdWaitingForAuth === 'number') {
        console.log('sending to tab: ', tabIdWaitingForAuth);
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
      StorageUtils.clearStorageOnLogout();
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
      console.warn('Unknown message type: ', message.type);
      sendResponse({ error: true });
    }
  }

  return true;
}

type LoginEventPayload = {
  userData: UserData;
  authToken: string;
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === (chrome.runtime as any).OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: `${chrome.runtime.getURL('tutorial.html')}`,
      active: true,
    });
  }
});
