/* global chrome */
/* src/content.js */
import { MessageType } from "../types";
import AnnotatorGuest from "./hypothesis/annotatorGuest";
import { EventBus } from "./hypothesis/utils/emitter";
import { Sidebar } from "./hypothesis/sidebar";
import Vocabulary from "../common/model/Vocabulary";
import { preloadURL } from "./hypothesis/helpers";
import { markTerm } from './marker';
// import { markTerm } from './marker';

const contentState = {
  annotations: null,
  sidebar: null,
};

// TODO: use this later
const classesMap = {
  unknownTermOcc: "suggested-term-occurrence selected-occurrence",
  knownTermOcc: "suggested-term-occurrence selected-occurrence",
  termDefinition: "term-definition",
  newTermProposal: "proposed-occurrence suggested-term-occurrence",
  existingTermProposal: "proposed-occurrence assigned-term-occurrence",
};

const annotate = (vocabulary: Vocabulary) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: MessageType.GetAnnotations,
        payload: {
          // pageLang: document.documentElement.lang,
          pageHtml: document.body.outerHTML,
          vocabulary: vocabulary.iri,
        },
      },
      (response) => {
        const {
          data: { termOccurrencesSelectors: data },
          error,
        } = response;

        if (error || !data) {
          console.error("There was an error annotationg this page: ", error);
          return;
        }

        contentState.annotations = data;
        const results = {
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
        data.forEach((term) => markTerm(term, results));

        resolve(data);
      }
    );
  });
};

export const overlay = {
  previousOverflowValue: "",
  init() {
    const overlay = document.createElement("div");
    overlay.id = "termit-overlay";
    document.body.appendChild(overlay);
  },
  on() {
    this.previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("termit-overlay").style.display = "block";
  },
  off() {
    document.body.style.overflow = this.previousOverflowValue;
    document.getElementById("termit-overlay").style.display = "none";
  },
};

window.addEventListener("load", async () => {
  overlay.init();

  const styleSheetsToLoad = [
    "/static/css/annotator.css",
    "/static/css/styles.css",
    "/static/css/bootstrap-termit.css",
  ];

  styleSheetsToLoad.forEach((stylesheetPath) =>
    preloadURL(
      document,
      "style",
      chrome.runtime.getURL(stylesheetPath)
    )
  );

  initSidebar();

  new AnnotatorGuest(document.body);
});


function initSidebar() {
  const eventBus = new EventBus();
  const sidebar = new Sidebar(
    document.body,
    eventBus,
    contentState,
    async (vocabulary: Vocabulary) => {
      const annotations = await annotate(vocabulary);
      contentState.annotations = annotations;
      sidebar.render();
    }
  );
}
