import "regenerator-runtime/runtime.js";
import api from '../api';
import { MessageType } from "../types";
// import { JSDOM } from 'jsdom';

// handles request from content scripts
function addListeners() {
  chrome.runtime.onMessage.addListener(handleMessages);
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
      api.runPageAnnotationAnalysis(message.payload.vocabulary, message.payload.pageHtml)
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

chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) {
    return;
  }
  chrome.tabs.sendMessage(
    tab.id,
    { type: MessageType.OpenToolbar },
    function (response) {
    }
  );
});

api.loadVocabularies('SKIP_CACHE');