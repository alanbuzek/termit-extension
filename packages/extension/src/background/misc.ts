import ExtensionMessage from '../shared/ExtensionMessage';

export function handleBrowserActionClick(tab) {
  if (!tab || !tab.id) {
    return;
  }
  chrome.tabs.sendMessage(tab.id, { type: ExtensionMessage.OpenToolbar });
}

export function handleExtensionInstalled(details) {
  if (details.reason === (chrome.runtime as any).OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: `${chrome.runtime.getURL('tutorial.html')}`,
      active: true,
    });
  }
}
