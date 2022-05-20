import SecurityUtils from '../content/util/SecurityUtils';
import StorageUtils from '../content/util/StorageUtils';
import { SKIP_CACHE } from '../shared/api/cache';
import BrowserApi from '../shared/BrowserApi';
import ExtensionMessage from '../shared/ExtensionMessage';
import { UserData } from '../termit-ui-common/model/User';
import Constants from '../termit-ui-common/util/Constants';
import backgroundHelper from './backgroundHelper';

type LoginEventPayload = {
  userData: UserData;
  authToken: string;
};

export default async function handleExternalMessages(
  message,
  sender,
  sendResponse
) {
  switch (message.type) {
    case ExtensionMessage.LoginEvent: {
      const { userData, authToken } = message.payload as LoginEventPayload;

      await BrowserApi.storage.set(Constants.STORAGE.USER, userData);
      await SecurityUtils.saveToken(authToken);

      // refresh vocabularies cache
      backgroundHelper.loadVocabularies(SKIP_CACHE);

      const tabIdWaitingForAuth = await BrowserApi.storage.get(
        Constants.STORAGE.TAB_ID_WAITING_FOR_AUTH
      );
      if (typeof tabIdWaitingForAuth === 'number') {
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
