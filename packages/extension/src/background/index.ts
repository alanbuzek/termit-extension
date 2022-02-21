import axios from 'axios';
import { MessageType } from '../types';
// import { JSDOM } from 'jsdom';

// handles request from content scripts
function addListeners() {
  chrome.runtime.onMessage.addListener(handleMessages);
}

const annotationResults = {};
const sumResult = {
  highlights: {
    failures: 0,
    successes: 0,
    overselectedFailures: 0,
  },
  selectors: {
    successes: 0,
    failures: 0,
    overselectedFailures: 0,
  },
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
        .then((res) => {
          console.log('got response')
          
          sendResponse({ data: res.data })
          // console.log('before virtual dom: ')
          // const virtualDom = new JSDOM(res.data.annotatedDocument);
          // console.log('after')
        })
        .catch((err) => sendResponse({ error: err || true }));

      return true;
    }
    case MessageType.SaveAnnotaionResult: {
      const { result } = message.payload;

      annotationResults[result.url] = result;

      let success = 0;
      sumResult.highlights.failures += result.highlights.failures; 
      sumResult.highlights.successes += result.highlights.successes; 
      sumResult.highlights.overselectedFailures += result.highlights.overselectedFailures; 
      sumResult.selectors.failures += result.selectors.failures; 
      sumResult.selectors.successes += result.selectors.successes; 
      sumResult.selectors.overselectedFailures += result.selectors.overselectedFailures; 

      console.log('current result: ', result);
      console.log('sumResults: ', sumResult);
      console.log('annotationResults: ', annotationResults);

      return true;
    }
    default:
      console.error('Unknown MessageType');
  }

  return true;
}
