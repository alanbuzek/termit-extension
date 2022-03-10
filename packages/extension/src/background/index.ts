import "regenerator-runtime/runtime.js";
import { MessageType } from "../types";
// import { JSDOM } from 'jsdom';

console.log("executing listener");

// handles request from content scripts
function addListeners() {
  console.log("adding listeners");
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
};

addListeners();

function handleMessages(message, sender, sendResponse) {
  console.log("got handle message: ", message, "sendResponse: ", sendResponse);

  fetch("http://localhost:8888/annotate?enableKeywordExtraction=true", {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      content: message.payload.pageHtml,
      vocabularyRepository:
        "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/slovník",
      vocabularyContexts: [],
      language: "cs",
    }), // body data type must match "Content-Type" header
  })
    .then((res) => {
      console.log("got response, res: ", res);

      return res.json();
      // console.log('before virtual dom: ')
      // const virtualDom = new JSDOM(res.data.annotatedDocument);
      // console.log('after')
    })
    .then((res) => {
      console.log("res: ", res);
      sendResponse({ data: res });
    })
    .catch(
      (err) => sendResponse({ error: "here" })
      // sendResponse({ error: err || true })
    );
  console.log("past post");

  return true;
}
