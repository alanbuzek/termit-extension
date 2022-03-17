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
  switch (message.type) {
    case MessageType.GetAnnotations: {
      console.log(
        "got handle message: ",
        message,
        "sendResponse: ",
        sendResponse
      );
      
      api.annotatePage(message.payload.vocabulary, message.payload.pageHtml)
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
  console.log('action clicked: ', tab);
  if (!tab || !tab.id) {
    return;
  }
  chrome.tabs.sendMessage(
    tab.id,
    { type: MessageType.OpenToolbar },
    function (response) {
      console.log("GOT Response");
    }
  );
});

console.log("action handler registered");
