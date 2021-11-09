import axios from 'axios';
import { MessageType } from '../types';

// handles request from content scripts
function addListeners() {
  chrome.runtime.onMessage.addListener(handleMessages);
}

addListeners();

function handleMessages(message, sender, sendResponse) {
  switch (message.type) {
    case MessageType.GetAnnotations: {
      const { pageHtml } = message.payload;

      axios
        .post('http://localhost:8080/annotate?enableKeywordExtraction=true', {
          content: pageHtml,
          vocabularyRepository:
            'http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník',
          vocabularyContexts: [],
          language: 'cs',
        })
        .then((res) => sendResponse({ data: res.data }))
        .catch((err) => sendResponse({ error: err || true }));

      return true;
    }
    default:
      console.error('Unknown MessageType');
  }

  return true;
}
