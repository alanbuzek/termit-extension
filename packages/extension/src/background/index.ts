import 'regenerator-runtime/runtime.js';
import handleMessages from './handleMessages';
import handleExternalMessages from './handleExternalMessages';
import { handleBrowserActionClick, handleExtensionInstalled } from './misc';

// register all background script listeners here
function addListeners() {
  chrome.runtime.onMessage.addListener(handleMessages);
  chrome.runtime.onMessageExternal.addListener(handleExternalMessages);
  chrome.action.onClicked.addListener(handleBrowserActionClick);
  chrome.runtime.onInstalled.addListener(handleExtensionInstalled);
}

addListeners();
