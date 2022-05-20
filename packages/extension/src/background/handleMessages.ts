import BrowserApi from '../shared/BrowserApi';
import ExtensionMessage from '../shared/ExtensionMessage';
import Constants from '../termit-ui-common/util/Constants';
import backgroundHelper from './backgroundHelper';

export default function handleMessages(message, sender, sendResponse) {
  console.log(
    '[Background] got handle message: ',
    message,
    'sendResponse: ',
    sendResponse
  );

  switch (message.type) {
    case ExtensionMessage.RunPageTextAnalysis: {
      backgroundHelper
        .runPageAnnotationAnalysis(
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
      break;
    }
    default: {
      sendResponse({});
    }
  }

  return true;
}
